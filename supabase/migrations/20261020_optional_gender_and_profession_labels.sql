-- Gênero opcional usado exclusivamente para flexionar o nome da profissão.
-- A data de nascimento não é coletada: ela não possui finalidade necessária
-- no funcionamento atual do Oportuniza.
begin;

alter table public.profiles
  add column if not exists genero text;

alter table public.profiles
  drop constraint if exists profiles_genero_check;
alter table public.profiles
  add constraint profiles_genero_check
  check (genero is null or genero in ('homem', 'mulher'));

alter table public.categories
  add column if not exists nome_masculino text;
alter table public.categories
  add column if not exists nome_feminino text;

update public.categories
set nome_masculino = case nome
      when 'Pedreiro' then 'Pedreiro'
      when 'Faxineira' then 'Faxineiro'
      when 'Encanador' then 'Encanador'
      when 'Eletricista' then 'Eletricista'
      when 'Pintor' then 'Pintor'
      when 'Babá' then 'Babá'
      when 'Jardineiro' then 'Jardineiro'
      when 'Cozinheiro' then 'Cozinheiro'
      else coalesce(nome_masculino, nome)
    end,
    nome_feminino = case nome
      when 'Pedreiro' then 'Pedreira'
      when 'Faxineira' then 'Faxineira'
      when 'Encanador' then 'Encanadora'
      when 'Eletricista' then 'Eletricista'
      when 'Pintor' then 'Pintora'
      when 'Babá' then 'Babá'
      when 'Jardineiro' then 'Jardineira'
      when 'Cozinheiro' then 'Cozinheira'
      else coalesce(nome_feminino, nome)
    end;

grant select (genero) on public.profiles to authenticated;

create or replace function public.set_my_gender(p_genero text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  clean_gender text := nullif(lower(trim(p_genero)), '');
begin
  if current_user_id is null then
    raise exception 'Usuário não autenticado';
  end if;
  if clean_gender is not null and clean_gender not in ('homem', 'mulher') then
    raise exception 'Opção de gênero inválida';
  end if;

  update public.profiles
  set genero = clean_gender
  where id = current_user_id;

  if not found then
    raise exception 'Perfil não encontrado';
  end if;
end;
$$;

revoke execute on function public.set_my_gender(text)
  from public, anon, authenticated;
grant execute on function public.set_my_gender(text)
  to authenticated;

-- Mantém o nome canônico em specialty para filtros e métricas e fornece a
-- versão adequada para exibição em specialty_label. O gênero bruto não sai
-- deste endpoint.
drop function if exists public.get_prestadores_publicos();
create function public.get_prestadores_publicos()
returns table (
  service_id uuid,
  prestador_id uuid,
  nome text,
  specialty text,
  specialty_label text,
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
    case
      when p.genero = 'mulher' then coalesce(c.nome_feminino, c.nome)
      when p.genero = 'homem' then coalesce(c.nome_masculino, c.nome)
      else c.nome
    end,
    round(avg(r.nota)::numeric, 1),
    coalesce(ps.descricao, p.bio),
    p.avatar_url,
    p.bairro,
    p.cidade,
    p.estado,
    p.bio,
    case when p.whatsapp_publico then p.whatsapp else null end
  from public.profiles p
  join public.professional_services ps on ps.prestador_id = p.id
  join public.categories c on c.id = ps.categoria_id and c.ativo
  left join public.reviews r on r.avaliado_id = p.id
  where p.role::text = 'prestador'
    and p.cadastro_completo
  group by ps.id, p.id, p.nome, p.genero, c.nome,
           c.nome_masculino, c.nome_feminino, ps.descricao,
           p.avatar_url, p.bairro, p.cidade, p.estado, p.bio,
           p.whatsapp, p.whatsapp_publico;
$$;

revoke execute on function public.get_prestadores_publicos()
  from public, anon, authenticated;
grant execute on function public.get_prestadores_publicos()
  to authenticated;

commit;
