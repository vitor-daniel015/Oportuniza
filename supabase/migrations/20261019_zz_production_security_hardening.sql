-- Endurecimento final para produção.
-- Execute depois das demais migrations. Revoga permissões antigas antes de
-- conceder somente o necessário para o aplicativo atual.
begin;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create or replace function private.is_published_provider(p_provider_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = p_provider_id
      and p.role::text = 'prestador'
      and p.cadastro_completo
  );
$$;

create or replace function private.is_published_review(p_review_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.reviews r
    join public.profiles p on p.id = r.avaliado_id
    where r.id = p_review_id
      and p.role::text = 'prestador'
      and p.cadastro_completo
  );
$$;

revoke all on function private.is_published_provider(uuid) from public;
revoke all on function private.is_published_review(uuid) from public;
grant execute on function private.is_published_provider(uuid) to anon, authenticated;
grant execute on function private.is_published_review(uuid) to anon, authenticated;

-- Apaga políticas acumuladas de migrations antigas para evitar permissões
-- permissivas combinadas por OR.
do $$
declare policy_record record;
begin
  for policy_record in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'profiles', 'categories', 'professional_services', 'portfolios',
        'service_requests', 'reviews', 'review_replies', 'favorites',
        'review_invitations', 'notifications', 'profile_view_events',
        'professional_search_events'
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

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.professional_services enable row level security;
alter table public.portfolios enable row level security;
alter table public.service_requests enable row level security;
alter table public.reviews enable row level security;
alter table public.review_replies enable row level security;
alter table public.favorites enable row level security;
alter table public.review_invitations enable row level security;
alter table public.notifications enable row level security;
alter table public.profile_view_events enable row level security;
alter table public.professional_search_events enable row level security;

-- Limites no banco: protegem mesmo quando alguém ignora o formulário React e
-- chama a API diretamente. NOT VALID preserva registros antigos fora do padrão,
-- mas já bloqueia novos valores inválidos.
alter table public.profiles drop constraint if exists profiles_nome_length_check;
alter table public.profiles add constraint profiles_nome_length_check
  check (char_length(trim(nome)) between 2 and 120) not valid;
alter table public.profiles drop constraint if exists profiles_bio_length_check;
alter table public.profiles add constraint profiles_bio_length_check
  check (bio is null or char_length(bio) <= 2000) not valid;
alter table public.profiles drop constraint if exists profiles_location_length_check;
alter table public.profiles add constraint profiles_location_length_check
  check (
    (cidade is null or char_length(cidade) <= 100)
    and (bairro is null or char_length(bairro) <= 100)
  ) not valid;

alter table public.portfolios drop constraint if exists portfolios_text_length_check;
alter table public.portfolios add constraint portfolios_text_length_check
  check (
    char_length(trim(titulo)) between 2 and 120
    and (descricao is null or char_length(descricao) <= 2000)
  ) not valid;

alter table public.reviews drop constraint if exists reviews_comment_length_check;
alter table public.reviews add constraint reviews_comment_length_check
  check (comentario is null or char_length(comentario) <= 2000) not valid;

alter table public.review_replies drop constraint if exists review_replies_text_length_check;
alter table public.review_replies add constraint review_replies_text_length_check
  check (char_length(trim(resposta_texto)) between 1 and 2000) not valid;

alter table public.review_invitations drop constraint if exists review_invitations_email_length_check;
alter table public.review_invitations add constraint review_invitations_email_length_check
  check (char_length(contratante_email) between 3 and 320) not valid;

create policy "profiles read own"
on public.profiles for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = id);

create policy "categories read active"
on public.categories for select to anon, authenticated
using (ativo);

create policy "services read own"
on public.professional_services for select to authenticated
using ((select auth.uid()) = prestador_id);

create policy "portfolios read published or own"
on public.portfolios for select to anon, authenticated
using (
  (select auth.uid()) = prestador_id
  or private.is_published_provider(prestador_id)
);
create policy "portfolios insert own"
on public.portfolios for insert to authenticated
with check (
  (select auth.uid()) = prestador_id
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role::text = 'prestador'
  )
);
create policy "portfolios delete own"
on public.portfolios for delete to authenticated
using ((select auth.uid()) = prestador_id);

create policy "requests read involved"
on public.service_requests for select to authenticated
using ((select auth.uid()) in (contratante_id, prestador_id));

create policy "reviews read published or own"
on public.reviews for select to anon, authenticated
using (
  (select auth.uid()) = autor_id
  or (select auth.uid()) = avaliado_id
  or private.is_published_provider(avaliado_id)
);

create policy "review replies read published or own"
on public.review_replies for select to anon, authenticated
using (
  (select auth.uid()) = prestador_id
  or private.is_published_review(avaliacao_id)
);
create policy "review replies insert own"
on public.review_replies for insert to authenticated
with check (
  (select auth.uid()) = prestador_id
  and exists (
    select 1 from public.reviews r
    where r.id = avaliacao_id and r.avaliado_id = (select auth.uid())
  )
);
create policy "review replies update own"
on public.review_replies for update to authenticated
using ((select auth.uid()) = prestador_id)
with check ((select auth.uid()) = prestador_id);
create policy "review replies delete own"
on public.review_replies for delete to authenticated
using ((select auth.uid()) = prestador_id);

create policy "favorites read own"
on public.favorites for select to authenticated
using ((select auth.uid()) = contratante_id);
create policy "favorites insert own"
on public.favorites for insert to authenticated
with check ((select auth.uid()) = contratante_id);
create policy "favorites delete own"
on public.favorites for delete to authenticated
using ((select auth.uid()) = contratante_id);

create policy "review invitations read own"
on public.review_invitations for select to authenticated
using ((select auth.uid()) = prestador_id);

create policy "notifications read own"
on public.notifications for select to authenticated
using ((select auth.uid()) = user_id);
create policy "notifications update own"
on public.notifications for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- Grants por tabela: RLS limita linhas; grants limitam operações e colunas.
revoke all on table public.profiles from anon, authenticated;
grant select (
  id, role, nome, email, whatsapp, whatsapp_publico, cidade, bairro, estado,
  avatar_url, bio, cadastro_completo, onboarding_completo, cpf_cadastrado,
  termos_aceitos_em, politica_versao, created_at, updated_at
) on public.profiles to authenticated;

revoke all on table public.categories from anon, authenticated;
grant select on public.categories to anon, authenticated;

revoke all on table public.professional_services from anon, authenticated;
grant select on public.professional_services to authenticated;

revoke all on table public.portfolios from anon, authenticated;
grant select on public.portfolios to anon, authenticated;
grant insert, delete on public.portfolios to authenticated;

revoke all on table public.service_requests from anon, authenticated;
grant select on public.service_requests to authenticated;

revoke all on table public.reviews from anon, authenticated;
grant select (id, avaliado_id, nota, comentario, created_at)
on public.reviews to anon, authenticated;

revoke all on table public.review_replies from anon, authenticated;
grant select on public.review_replies to anon, authenticated;
grant insert, update, delete on public.review_replies to authenticated;

revoke all on table public.favorites from anon, authenticated;
grant select, insert, delete on public.favorites to authenticated;

revoke all on table public.review_invitations from anon, authenticated;
grant select (id, prestador_id, contratante_email, expires_at, used_at, created_at)
on public.review_invitations to authenticated;

revoke all on table public.notifications from anon, authenticated;
grant select on public.notifications to authenticated;
grant update (read_at) on public.notifications to authenticated;

revoke all on table public.profile_view_events from anon, authenticated;
revoke all on table public.professional_search_events from anon, authenticated;

-- Índices usados pelos filtros RLS e pelas telas mais acessadas.
create index if not exists portfolios_provider_date_idx
  on public.portfolios(prestador_id, created_at desc);
create index if not exists reviews_evaluated_date_idx
  on public.reviews(avaliado_id, created_at desc);
create index if not exists reviews_author_idx
  on public.reviews(autor_id);
create index if not exists review_replies_provider_idx
  on public.review_replies(prestador_id);
create index if not exists service_requests_provider_idx
  on public.service_requests(prestador_id);
create index if not exists service_requests_client_idx
  on public.service_requests(contratante_id);
create index if not exists professional_services_provider_idx
  on public.professional_services(prestador_id);

-- Notificações continuam registradas, mas por RPC validada e limitada.
create or replace function public.add_my_notification(
  p_message text,
  p_kind text default 'success'
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Usuário não autenticado';
  end if;
  if nullif(trim(p_message), '') is null or char_length(trim(p_message)) > 240 then
    raise exception 'Notificação inválida';
  end if;
  if p_kind not in ('success', 'info', 'warning') then
    raise exception 'Tipo de notificação inválido';
  end if;
  if (
    select count(*) from public.notifications n
    where n.user_id = current_user_id
      and n.created_at >= now() - interval '1 minute'
  ) >= 10 then
    return;
  end if;
  insert into public.notifications(user_id, message, kind)
  values(current_user_id, trim(p_message), p_kind);
end;
$$;

revoke all on function public.add_my_notification(text, text) from public;
grant execute on function public.add_my_notification(text, text) to authenticated;

-- Convites possuem token aleatório armazenado somente como hash, expiração,
-- uso único e limite de criação para evitar spam/ocupação indevida do banco.
create or replace function public.create_review_invitation(
  p_contratante_email text,
  p_expires_in_hours integer default 72
) returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  raw_token text := encode(extensions.gen_random_bytes(24), 'hex');
  clean_email text := lower(trim(p_contratante_email));
begin
  if current_user_id is null then raise exception 'Usuário não autenticado'; end if;
  if not exists (
    select 1 from public.profiles
    where id = current_user_id and role::text = 'prestador' and cadastro_completo
  ) then raise exception 'Complete seu perfil de prestador antes de gerar convites'; end if;
  if clean_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    or char_length(clean_email) > 320 then
    raise exception 'Informe um e-mail válido';
  end if;
  if p_expires_in_hours not between 1 and 168 then
    raise exception 'A validade deve ficar entre 1 hora e 7 dias';
  end if;
  if (
    select count(*) from public.review_invitations i
    where i.prestador_id = current_user_id
      and i.created_at >= now() - interval '1 hour'
  ) >= 20 then
    raise exception 'Limite temporário de convites atingido. Tente novamente mais tarde';
  end if;
  insert into public.review_invitations(
    prestador_id, contratante_email, token_hash, expires_at
  ) values (
    current_user_id,
    clean_email,
    encode(extensions.digest(convert_to(raw_token, 'UTF8'), 'sha256'), 'hex'),
    now() + make_interval(hours => p_expires_in_hours)
  );
  return raw_token;
end;
$$;

revoke all on function public.create_review_invitation(text, integer) from public;
grant execute on function public.create_review_invitation(text, integer) to authenticated;

-- Métricas: apenas usuários autenticados e sem repetição em curto intervalo.
create or replace function public.record_profile_view(p_provider_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare current_user_id uuid := auth.uid();
begin
  if current_user_id is null or current_user_id = p_provider_id then return; end if;
  if not exists (
    select 1 from public.profiles
    where id = p_provider_id and role::text = 'prestador' and cadastro_completo
  ) then return; end if;
  if exists (
    select 1 from public.profile_view_events
    where prestador_id = p_provider_id
      and visitante_id = current_user_id
      and created_at >= now() - interval '30 minutes'
  ) then return; end if;
  insert into public.profile_view_events(prestador_id, visitante_id)
  values(p_provider_id, current_user_id);
end;
$$;

create or replace function public.record_professional_search(p_category_name text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  category_id bigint;
begin
  if current_user_id is null then return; end if;
  select id into category_id from public.categories
  where ativo and lower(nome) = lower(trim(p_category_name)) limit 1;
  if category_id is null then return; end if;
  if exists (
    select 1 from public.professional_search_events
    where categoria_id = category_id
      and visitante_id = current_user_id
      and created_at >= now() - interval '30 minutes'
  ) then return; end if;
  insert into public.professional_search_events(categoria_id, visitante_id)
  values(category_id, current_user_id);
end;
$$;

-- Fecha permissões implícitas de funções SECURITY DEFINER.
revoke all on function public.record_profile_view(uuid) from public;
revoke all on function public.record_professional_search(text) from public;
grant execute on function public.record_profile_view(uuid) to authenticated;
grant execute on function public.record_professional_search(text) to authenticated;

revoke execute on function public.get_prestadores_publicos() from anon;
grant execute on function public.get_prestadores_publicos() to authenticated;
revoke execute on function public.submit_provider_review(uuid, smallint, text) from public, anon, authenticated;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.sync_user_email() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.is_valid_cpf(text) from public, anon, authenticated;

-- Storage: arquivos são públicos somente por URL; listar, alterar e apagar é
-- permitido apenas ao dono autenticado da pasta e do objeto.
drop policy if exists "profile media public read" on storage.objects;
drop policy if exists "profile media owner read" on storage.objects;
drop policy if exists "profile media owner insert" on storage.objects;
drop policy if exists "profile media owner update" on storage.objects;
drop policy if exists "profile media owner delete" on storage.objects;

create policy "profile media owner read"
on storage.objects for select to authenticated
using (
  bucket_id = 'profile-media'
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "profile media owner insert"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'profile-media'
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "profile media owner update"
on storage.objects for update to authenticated
using (
  bucket_id = 'profile-media'
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'profile-media'
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "profile media owner delete"
on storage.objects for delete to authenticated
using (
  bucket_id = 'profile-media'
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

commit;
