-- Sincronização Auth -> profiles e onboarding seguro de prestadores.

alter table public.profiles
  add column if not exists cadastro_completo boolean not null default false;
alter table public.profiles
  add column if not exists onboarding_completo boolean not null default false;

-- `rating` é um campo legado: a nota pública é calculada pelas avaliações.
-- Limpa mocks antigos fora do intervalo permitido antes de atualizar os perfis,
-- evitando que a constraint profiles_rating_check bloqueie esta migration.
update public.profiles
set rating = null
where rating is not null
  and rating not between 1 and 5;

-- Garante um profile para usuários antigos e sincroniza nome/e-mail conhecidos.
insert into public.profiles (id, nome, email, role, cadastro_completo)
select
  u.id,
  coalesce(
    nullif(trim(u.raw_user_meta_data->>'name'), ''),
    nullif(trim(u.raw_user_meta_data->>'full_name'), ''),
    nullif(split_part(u.email, '@', 1), ''),
    'Usuário'
  ),
  u.email,
  case
    when u.raw_user_meta_data->>'role' = 'prestador'
      then 'prestador'::public.user_role
    else 'contratante'::public.user_role
  end,
  false
from auth.users u
on conflict (id) do update set
  email = excluded.email,
  nome = case
    when public.profiles.nome is null or trim(public.profiles.nome) in ('', 'Usuário')
      then excluded.nome
    else public.profiles.nome
  end;

-- Mocks/prestadores antigos completos continuam visíveis depois da migração.
update public.profiles p
set cadastro_completo = true
where p.role::text = 'prestador'
  and nullif(trim(p.nome), '') is not null
  and nullif(trim(p.cidade), '') is not null
  and p.estado ~ '^[A-Z]{2}$'
  and nullif(trim(p.avatar_url), '') is not null
  and nullif(trim(p.bio), '') is not null
  and exists (
    select 1 from public.professional_services ps where ps.prestador_id = p.id
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nome, email, role, cadastro_completo)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'name'), ''),
      nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
      nullif(trim(new.raw_user_meta_data->>'nome'), ''),
      nullif(split_part(new.email, '@', 1), ''),
      'Usuário'
    ),
    new.email,
    case
      when new.raw_user_meta_data->>'role' = 'prestador'
        then 'prestador'::public.user_role
      else 'contratante'::public.user_role
    end,
    false
  )
  on conflict (id) do update set
    email = excluded.email,
    nome = case
      when public.profiles.nome is null or trim(public.profiles.nome) in ('', 'Usuário')
        then excluded.nome
      else public.profiles.nome
    end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Remove a versão anterior para que o PostgREST não encontre overloads ambíguos.
drop function if exists public.save_my_profile(text, text, text, text, text, text, text, bigint);

-- O banco valida o onboarding e decide se o cadastro pode ser publicado.
create or replace function public.save_my_profile(
  p_nome text,
  p_cpf text,
  p_whatsapp text,
  p_cidade text,
  p_bairro text,
  p_estado text,
  p_avatar_url text,
  p_bio text,
  p_categoria_id bigint default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  profile_role text;
  clean_cpf text;
  clean_whatsapp text;
  onboarding_complete boolean;
  is_complete boolean;
begin
  if current_user_id is null then
    raise exception 'Usuário não autenticado';
  end if;

  select role::text into profile_role
  from public.profiles
  where id = current_user_id;

  if profile_role is null then
    raise exception 'Perfil não encontrado';
  end if;

  if nullif(trim(p_nome), '') is null then
    raise exception 'O nome é obrigatório';
  end if;

  clean_cpf := regexp_replace(coalesce(p_cpf, ''), '[^0-9]', '', 'g');
  clean_whatsapp := regexp_replace(coalesce(p_whatsapp, ''), '[^0-9]', '', 'g');

  if length(clean_cpf) <> 11 then
    raise exception 'Informe um CPF com 11 dígitos';
  end if;

  if length(clean_whatsapp) not between 10 and 13 then
    raise exception 'Informe um WhatsApp válido';
  end if;

  if p_estado is not null and trim(p_estado) <> '' and upper(trim(p_estado)) !~ '^[A-Z]{2}$' then
    raise exception 'Use a sigla do estado com duas letras';
  end if;

  update public.profiles
  set
    nome = trim(p_nome),
    cpf = clean_cpf,
    whatsapp = clean_whatsapp,
    cidade = nullif(trim(p_cidade), ''),
    bairro = nullif(trim(p_bairro), ''),
    estado = nullif(upper(trim(p_estado)), ''),
    avatar_url = nullif(trim(p_avatar_url), ''),
    bio = nullif(trim(p_bio), '')
  where id = current_user_id;

  onboarding_complete :=
    length(clean_cpf) = 11
    and length(clean_whatsapp) between 10 and 13
    and nullif(trim(p_cidade), '') is not null
    and nullif(trim(p_bairro), '') is not null
    and upper(trim(p_estado)) ~ '^[A-Z]{2}$';

  if profile_role = 'prestador' then
    if p_categoria_id is not null then
      if not exists (
        select 1 from public.categories c where c.id = p_categoria_id and c.ativo
      ) then
        raise exception 'Categoria inválida ou inativa';
      end if;

      insert into public.professional_services (prestador_id, categoria_id, descricao)
      values (current_user_id, p_categoria_id, nullif(trim(p_bio), ''))
      on conflict (prestador_id, categoria_id) do update
        set descricao = excluded.descricao;
    end if;

    select
      nullif(trim(nome), '') is not null
      and nullif(trim(cidade), '') is not null
      and estado ~ '^[A-Z]{2}$'
      and nullif(trim(avatar_url), '') is not null
      and nullif(trim(bio), '') is not null
      and exists (
        select 1 from public.professional_services ps
        where ps.prestador_id = current_user_id
      )
    into is_complete
    from public.profiles
    where id = current_user_id;
  else
    is_complete := true;
  end if;

  update public.profiles
  set
    onboarding_completo = onboarding_complete,
    cadastro_completo = is_complete
  where id = current_user_id;

  return is_complete;
end;
$$;

revoke all on function public.save_my_profile(text, text, text, text, text, text, text, text, bigint) from public;
grant execute on function public.save_my_profile(text, text, text, text, text, text, text, text, bigint) to authenticated;

-- Corrige instalações antigas em que role foi criado como PostgreSQL `name`.
drop policy if exists "services manage own" on public.professional_services;
create policy "services manage own" on public.professional_services
  for all to authenticated
  using ((select auth.uid()) = prestador_id)
  with check (
    (select auth.uid()) = prestador_id
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role::text = 'prestador'
    )
  );

-- Recria o endpoint público: só prestadores completos são publicados.
drop function if exists public.get_prestadores_publicos();

create function public.get_prestadores_publicos()
returns table (
  service_id uuid,
  prestador_id uuid,
  nome text,
  specialty text,
  rating numeric,
  description text,
  avatar_url text,
  bairro text,
  cidade text,
  estado text,
  bio text,
  whatsapp text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    ps.id,
    p.id,
    p.nome,
    c.nome,
    round(avg(r.nota)::numeric, 1),
    coalesce(ps.descricao, p.bio),
    p.avatar_url,
    p.bairro,
    p.cidade,
    p.estado,
    p.bio,
    p.whatsapp
  from public.profiles p
  join public.professional_services ps on ps.prestador_id = p.id
  join public.categories c on c.id = ps.categoria_id and c.ativo
  left join public.reviews r on r.avaliado_id = p.id
  where p.role::text = 'prestador'
    and p.cadastro_completo
  group by ps.id, p.id, p.nome, c.nome, ps.descricao,
           p.avatar_url, p.bairro, p.cidade, p.estado, p.bio, p.whatsapp;
$$;

revoke all on function public.get_prestadores_publicos() from public;
grant execute on function public.get_prestadores_publicos() to anon, authenticated;
