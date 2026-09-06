-- Alinha o banco ao marketplace Oportuniza sem apagar dados existentes.
-- Revise eventuais duplicidades em professional_services antes de executar.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'service_status') then
    create type public.service_status as enum (
      'aberto', 'em_andamento', 'concluido', 'cancelado'
    );
  end if;
end
$$;

-- Perfil: valores e formatos mínimos garantidos no próprio banco.
alter table public.profiles alter column rating drop default;
alter table public.profiles alter column rating drop not null;

alter table public.profiles drop constraint if exists profiles_estado_check;
alter table public.profiles add constraint profiles_estado_check
  check (estado is null or estado ~ '^[A-Z]{2}$') not valid;

alter table public.profiles drop constraint if exists profiles_rating_check;
alter table public.profiles add constraint profiles_rating_check
  check (rating is null or rating between 1 and 5) not valid;

comment on column public.profiles.rating is
  'Legado. A nota pública é calculada diretamente de reviews pela função get_prestadores_publicos.';

-- Evita que o mesmo prestador cadastre a mesma categoria várias vezes.
do $$
begin
  if exists (
    select 1
    from public.professional_services
    group by prestador_id, categoria_id
    having count(*) > 1
  ) then
    raise exception
      'Existem categorias duplicadas em professional_services. Corrija-as antes de executar esta migração.';
  end if;
end
$$;

create unique index if not exists professional_services_prestador_categoria_uidx
  on public.professional_services (prestador_id, categoria_id);

-- Solicitações são a origem verificável das avaliações.
create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  contratante_id uuid not null references public.profiles(id) on delete cascade,
  prestador_id uuid references public.profiles(id) on delete set null,
  categoria_id bigint references public.categories(id) on delete restrict,
  titulo text not null check (char_length(trim(titulo)) between 3 and 120),
  descricao text not null check (char_length(trim(descricao)) between 10 and 3000),
  cidade text not null,
  estado text not null check (estado ~ '^[A-Z]{2}$'),
  status public.service_status not null default 'aberto',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (status = 'concluido' and completed_at is not null)
    or (status <> 'concluido')
  )
);

-- A constraint NOT VALID protege novos registros sem apagar órfãos antigos.
alter table public.reviews drop constraint if exists reviews_solicitacao_id_fkey;
alter table public.reviews add constraint reviews_solicitacao_id_fkey
  foreign key (solicitacao_id) references public.service_requests(id)
  on delete cascade not valid;

create unique index if not exists reviews_solicitacao_autor_uidx
  on public.reviews (solicitacao_id, autor_id);

-- Cascatas apenas para dados dependentes que deixam de fazer sentido sem o dono.
alter table public.profiles drop constraint if exists profiles_id_fkey;
alter table public.profiles add constraint profiles_id_fkey
  foreign key (id) references auth.users(id) on delete cascade;

alter table public.professional_services drop constraint if exists professional_services_prestador_id_fkey;
alter table public.professional_services add constraint professional_services_prestador_id_fkey
  foreign key (prestador_id) references public.profiles(id) on delete cascade;

alter table public.professional_services drop constraint if exists professional_services_categoria_id_fkey;
alter table public.professional_services add constraint professional_services_categoria_id_fkey
  foreign key (categoria_id) references public.categories(id) on delete restrict;

alter table public.portfolios drop constraint if exists portfolios_prestador_id_fkey;
alter table public.portfolios add constraint portfolios_prestador_id_fkey
  foreign key (prestador_id) references public.profiles(id) on delete cascade;

alter table public.review_replies drop constraint if exists review_replies_avaliacao_id_fkey;
alter table public.review_replies add constraint review_replies_avaliacao_id_fkey
  foreign key (avaliacao_id) references public.reviews(id) on delete cascade;

alter table public.review_replies drop constraint if exists review_replies_prestador_id_fkey;
alter table public.review_replies add constraint review_replies_prestador_id_fkey
  foreign key (prestador_id) references public.profiles(id) on delete cascade;

alter table public.reviews drop constraint if exists reviews_autor_id_fkey;
alter table public.reviews add constraint reviews_autor_id_fkey
  foreign key (autor_id) references public.profiles(id) on delete cascade;

alter table public.reviews drop constraint if exists reviews_avaliado_id_fkey;
alter table public.reviews add constraint reviews_avaliado_id_fkey
  foreign key (avaliado_id) references public.profiles(id) on delete cascade;

alter table public.favorites drop constraint if exists favorites_contratante_id_fkey;
alter table public.favorites add constraint favorites_contratante_id_fkey
  foreign key (contratante_id) references public.profiles(id) on delete cascade;

alter table public.favorites drop constraint if exists favorites_prestador_id_fkey;
alter table public.favorites add constraint favorites_prestador_id_fkey
  foreign key (prestador_id) references public.profiles(id) on delete cascade;

-- Datas de atualização consistentes.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists service_requests_set_updated_at on public.service_requests;
create trigger service_requests_set_updated_at
before update on public.service_requests
for each row execute function public.set_updated_at();

-- Cadastro por senha e Google: nome, e-mail e role segura.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nome, email, role)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'nome'), ''),
      nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
      nullif(trim(new.raw_user_meta_data->>'name'), ''),
      'Usuário'
    ),
    new.email,
    case
      when new.raw_user_meta_data->>'role' = 'prestador'
        then 'prestador'::public.user_role
      else 'contratante'::public.user_role
    end
  )
  on conflict (id) do update
    set email = excluded.email,
        nome = case
          when public.profiles.nome = 'Usuário' then excluded.nome
          else public.profiles.nome
        end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.sync_user_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
after update of email on auth.users
for each row when (old.email is distinct from new.email)
execute function public.sync_user_email();

-- RLS: profiles deixa de ser uma fonte pública de CPF, nascimento, WhatsApp e e-mail.
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.professional_services enable row level security;
alter table public.portfolios enable row level security;
alter table public.service_requests enable row level security;
alter table public.reviews enable row level security;
alter table public.review_replies enable row level security;
alter table public.favorites enable row level security;

-- Remove políticas antigas/desconhecidas para que nenhuma permissão permissiva sobreviva.
do $$
declare
  policy_record record;
begin
  for policy_record in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'profiles', 'categories', 'professional_services', 'portfolios',
        'service_requests', 'reviews', 'review_replies', 'favorites'
      )
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      policy_record.policyname,
      policy_record.schemaname,
      policy_record.tablename
    );
  end loop;
end
$$;

drop policy if exists "profiles public" on public.profiles;
drop policy if exists "own profile" on public.profiles;
create policy "profiles select own" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "profiles update own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id and role <> 'admin');

drop policy if exists "categories public" on public.categories;
create policy "categories public" on public.categories
  for select to anon, authenticated using (ativo);

drop policy if exists "services public" on public.professional_services;
drop policy if exists "own services" on public.professional_services;
create policy "services select public" on public.professional_services
  for select to anon, authenticated using (true);
create policy "services manage own" on public.professional_services
  for all to authenticated
  using ((select auth.uid()) = prestador_id)
  with check (
    (select auth.uid()) = prestador_id
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'prestador'::public.user_role
    )
  );

drop policy if exists "portfolio public" on public.portfolios;
drop policy if exists "own portfolio" on public.portfolios;
create policy "portfolio select public" on public.portfolios
  for select to anon, authenticated using (true);
create policy "portfolio manage own" on public.portfolios
  for all to authenticated
  using ((select auth.uid()) = prestador_id)
  with check (
    (select auth.uid()) = prestador_id
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'prestador'::public.user_role
    )
  );

drop policy if exists "requests involved" on public.service_requests;
drop policy if exists "client creates request" on public.service_requests;
create policy "requests select involved" on public.service_requests
  for select to authenticated
  using ((select auth.uid()) in (contratante_id, prestador_id));
create policy "requests create as client" on public.service_requests
  for insert to authenticated
  with check (
    (select auth.uid()) = contratante_id
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'contratante'::public.user_role
    )
  );
create policy "requests update involved" on public.service_requests
  for update to authenticated
  using ((select auth.uid()) in (contratante_id, prestador_id))
  with check ((select auth.uid()) in (contratante_id, prestador_id));

drop policy if exists "reviews public" on public.reviews;
drop policy if exists "valid completed review" on public.reviews;
create policy "reviews select public" on public.reviews
  for select to anon, authenticated using (true);
create policy "reviews create after completion" on public.reviews
  for insert to authenticated
  with check (
    (select auth.uid()) = autor_id
    and exists (
      select 1 from public.service_requests s
      where s.id = solicitacao_id
        and s.status = 'concluido'
        and (select auth.uid()) in (s.contratante_id, s.prestador_id)
        and avaliado_id in (s.contratante_id, s.prestador_id)
        and avaliado_id <> autor_id
    )
  );

drop policy if exists "replies public" on public.review_replies;
drop policy if exists "own reply" on public.review_replies;
create policy "replies select public" on public.review_replies
  for select to anon, authenticated using (true);
create policy "replies manage own" on public.review_replies
  for all to authenticated
  using ((select auth.uid()) = prestador_id)
  with check (
    (select auth.uid()) = prestador_id
    and exists (
      select 1 from public.reviews r
      where r.id = avaliacao_id and r.avaliado_id = prestador_id
    )
  );

drop policy if exists "own favorites" on public.favorites;
create policy "favorites manage own" on public.favorites
  for all to authenticated
  using ((select auth.uid()) = contratante_id)
  with check (
    (select auth.uid()) = contratante_id
    and contratante_id <> prestador_id
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'contratante'::public.user_role
    )
  );

-- A listagem pública passa por uma função com retorno limitado; a tabela profiles
-- continua privada e CPF/e-mail/WhatsApp nunca entram no payload público.
drop view if exists public.prestadores_publicos;

create or replace function public.get_prestadores_publicos()
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
  estado text
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
    ps.descricao,
    p.avatar_url,
    p.bairro,
    p.cidade,
    p.estado
  from public.profiles p
  join public.professional_services ps on ps.prestador_id = p.id
  join public.categories c on c.id = ps.categoria_id and c.ativo
  left join public.reviews r on r.avaliado_id = p.id
  where p.role = 'prestador'::public.user_role
  group by ps.id, p.id, p.nome, c.nome, ps.descricao,
           p.avatar_url, p.bairro, p.cidade, p.estado;
$$;

revoke all on function public.get_prestadores_publicos() from public;
grant execute on function public.get_prestadores_publicos() to anon, authenticated;

revoke all on table public.profiles from anon, authenticated;
grant select, update on table public.profiles to authenticated;
grant select on table public.categories, public.professional_services,
  public.portfolios, public.reviews, public.review_replies to anon, authenticated;
grant insert, update, delete on table public.professional_services,
  public.portfolios, public.service_requests, public.reviews,
  public.review_replies, public.favorites to authenticated;
grant select on table public.service_requests, public.favorites to authenticated;

-- Execute depois de corrigir possíveis avaliações órfãs:
-- alter table public.reviews validate constraint reviews_solicitacao_id_fkey;
