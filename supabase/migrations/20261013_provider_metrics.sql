-- Métricas agregadas para prestadores. Não expõe a identidade dos visitantes.
create table if not exists public.profile_view_events (
  id bigint generated always as identity primary key,
  prestador_id uuid not null references public.profiles(id) on delete cascade,
  visitante_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.professional_search_events (
  id bigint generated always as identity primary key,
  categoria_id bigint not null references public.categories(id) on delete cascade,
  visitante_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists profile_view_events_provider_date_idx
  on public.profile_view_events(prestador_id, created_at desc);
create index if not exists professional_search_events_category_date_idx
  on public.professional_search_events(categoria_id, created_at desc);

alter table public.profile_view_events enable row level security;
alter table public.professional_search_events enable row level security;

create or replace function public.record_profile_view(p_provider_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() = p_provider_id then return; end if;
  if not exists (
    select 1 from public.profiles
    where id = p_provider_id and role = 'prestador' and cadastro_completo
  ) then return; end if;
  insert into public.profile_view_events(prestador_id, visitante_id)
  values (p_provider_id, auth.uid());
end;
$$;

create or replace function public.record_professional_search(p_category_name text)
returns void language plpgsql security definer set search_path = '' as $$
declare v_category_id bigint;
begin
  select id into v_category_id from public.categories
  where ativo and lower(nome) = lower(trim(p_category_name)) limit 1;
  if v_category_id is null then return; end if;
  insert into public.professional_search_events(categoria_id, visitante_id)
  values (v_category_id, auth.uid());
end;
$$;

create or replace function public.get_my_provider_metrics()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  if not exists (
    select 1 from public.profiles where id = auth.uid() and role = 'prestador'
  ) then raise exception 'Apenas prestadores podem acessar estas métricas'; end if;

  select jsonb_build_object(
    'profile_views_total', (select count(*) from public.profile_view_events where prestador_id = auth.uid()),
    'profile_views_30_days', (select count(*) from public.profile_view_events where prestador_id = auth.uid() and created_at >= now() - interval '30 days'),
    'profile_views_7_days', (select count(*) from public.profile_view_events where prestador_id = auth.uid() and created_at >= now() - interval '7 days'),
    'category_searches_30_days', (
      select count(*) from public.professional_search_events e
      where e.created_at >= now() - interval '30 days'
        and exists (select 1 from public.professional_services s where s.prestador_id = auth.uid() and s.categoria_id = e.categoria_id)
    ),
    'reviews_total', (select count(*) from public.reviews where avaliado_id = auth.uid()),
    'average_rating', (select round(avg(nota)::numeric, 1) from public.reviews where avaliado_id = auth.uid())
  ) into result;
  return result;
end;
$$;

revoke all on public.profile_view_events, public.professional_search_events from anon, authenticated;
revoke all on function public.get_my_provider_metrics() from public;
grant execute on function public.get_my_provider_metrics() to authenticated;
grant execute on function public.record_profile_view(uuid) to anon, authenticated;
grant execute on function public.record_professional_search(text) to anon, authenticated;
