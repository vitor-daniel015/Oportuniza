-- Fluxo simples de avaliação: um contratante pode avaliar cada prestador uma vez.
-- Esta migration é independente e também funciona quando a migration estrutural
-- anterior ainda não criou service_requests.
create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'service_status'
  ) then
    create type public.service_status as enum ('aberto', 'em_andamento', 'concluido', 'cancelado');
  end if;
end
$$;

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  contratante_id uuid not null references public.profiles(id) on delete cascade,
  prestador_id uuid references public.profiles(id) on delete set null,
  categoria_id bigint references public.categories(id) on delete restrict,
  titulo text not null,
  descricao text not null,
  cidade text not null,
  estado text not null,
  status public.service_status not null default 'aberto',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.service_requests enable row level security;

drop policy if exists "requests select involved" on public.service_requests;
create policy "requests select involved" on public.service_requests
  for select to authenticated
  using ((select auth.uid()) in (contratante_id, prestador_id));

grant select on table public.service_requests to authenticated;

create or replace function public.submit_provider_review(
  p_prestador_id uuid,
  p_nota smallint,
  p_comentario text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  category_id bigint;
  request_id uuid;
  review_id uuid;
begin
  if current_user_id is null then
    raise exception 'Entre na sua conta para avaliar';
  end if;

  if current_user_id = p_prestador_id then
    raise exception 'Você não pode avaliar o próprio perfil';
  end if;

  if p_nota not between 1 and 5 then
    raise exception 'A nota deve estar entre 1 e 5';
  end if;

  if not exists (
    select 1 from public.profiles
    where id = current_user_id and role::text = 'contratante'
  ) then
    raise exception 'Somente contratantes podem avaliar prestadores';
  end if;

  select ps.categoria_id into category_id
  from public.professional_services ps
  join public.profiles p on p.id = ps.prestador_id
  where ps.prestador_id = p_prestador_id
    and p.role::text = 'prestador'
    and p.cadastro_completo
  order by ps.id
  limit 1;

  if category_id is null then
    raise exception 'Prestador indisponível para avaliação';
  end if;

  if exists (
    select 1 from public.reviews
    where autor_id = current_user_id and avaliado_id = p_prestador_id
  ) then
    raise exception 'Você já avaliou este prestador';
  end if;

  insert into public.service_requests (
    contratante_id, prestador_id, categoria_id, titulo, descricao,
    cidade, estado, status, completed_at
  )
  select
    current_user_id,
    p_prestador_id,
    category_id,
    'Serviço avaliado no Oportuniza',
    'Registro criado no momento da avaliação do serviço pelo contratante.',
    coalesce(nullif(trim(client.cidade), ''), nullif(trim(provider.cidade), ''), 'Não informada'),
    coalesce(nullif(trim(client.estado), ''), nullif(trim(provider.estado), ''), 'SP'),
    'concluido'::public.service_status,
    now()
  from public.profiles client
  join public.profiles provider on provider.id = p_prestador_id
  where client.id = current_user_id
  returning id into request_id;

  insert into public.reviews (solicitacao_id, autor_id, avaliado_id, nota, comentario)
  values (
    request_id,
    current_user_id,
    p_prestador_id,
    p_nota,
    nullif(trim(p_comentario), '')
  )
  returning id into review_id;

  return review_id;
end;
$$;

revoke all on function public.submit_provider_review(uuid, smallint, text) from public;
grant execute on function public.submit_provider_review(uuid, smallint, text) to authenticated;
