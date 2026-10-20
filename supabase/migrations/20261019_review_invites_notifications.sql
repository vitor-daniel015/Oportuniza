create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.review_invitations (
  id uuid primary key default gen_random_uuid(),
  prestador_id uuid not null references public.profiles(id) on delete cascade,
  contratante_email text not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  used_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  check (expires_at > created_at)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text not null check (char_length(message) between 1 and 240),
  kind text not null default 'success' check (kind in ('success', 'info', 'warning')),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists review_invitations_provider_date_idx
  on public.review_invitations(prestador_id, created_at desc);
create index if not exists notifications_user_date_idx
  on public.notifications(user_id, created_at desc);

alter table public.review_invitations enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "provider reads own invitations" on public.review_invitations;
create policy "provider reads own invitations" on public.review_invitations
  for select to authenticated using (prestador_id = (select auth.uid()));
drop policy if exists "users read own notifications" on public.notifications;
create policy "users read own notifications" on public.notifications
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "users insert own notifications" on public.notifications;
create policy "users insert own notifications" on public.notifications
  for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists "users update own notifications" on public.notifications;
create policy "users update own notifications" on public.notifications
  for update to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

grant select on public.review_invitations to authenticated;
grant select, insert, update on public.notifications to authenticated;

create or replace function public.create_review_invitation(
  p_contratante_email text,
  p_expires_in_hours integer default 72
) returns text language plpgsql security definer set search_path = '' as $$
declare
  raw_token text := encode(extensions.gen_random_bytes(24), 'hex');
  clean_email text := lower(trim(p_contratante_email));
begin
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and role::text = 'prestador' and cadastro_completo
  ) then raise exception 'Complete seu perfil de prestador antes de gerar convites'; end if;
  if clean_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'Informe um e-mail válido';
  end if;
  if p_expires_in_hours not between 1 and 168 then
    raise exception 'A validade deve ficar entre 1 hora e 7 dias';
  end if;
  insert into public.review_invitations(prestador_id, contratante_email, token_hash, expires_at)
  values (
    auth.uid(),
    clean_email,
    encode(extensions.digest(convert_to(raw_token, 'UTF8'), 'sha256'), 'hex'),
    now() + make_interval(hours => p_expires_in_hours)
  );
  return raw_token;
end;
$$;

create or replace function public.get_review_invitation(p_token text)
returns table(prestador_id uuid, prestador_nome text, expires_at timestamptz, available boolean)
language sql stable security definer set search_path = '' as $$
  select i.prestador_id, p.nome, i.expires_at,
    i.used_at is null and i.expires_at > now()
  from public.review_invitations i
  join public.profiles p on p.id = i.prestador_id
  where i.token_hash = encode(
    extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'),
    'hex'
  )
  limit 1;
$$;

create or replace function public.submit_invited_review(
  p_token text,
  p_nota smallint,
  p_comentario text default null
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  invitation public.review_invitations%rowtype;
  current_email text := lower(coalesce(auth.jwt()->>'email', ''));
  category_id bigint;
  request_id uuid;
  review_id uuid;
begin
  if auth.uid() is null then raise exception 'Entre na sua conta para avaliar'; end if;
  if p_nota not between 1 and 5 then raise exception 'A nota deve estar entre 1 e 5'; end if;
  select * into invitation from public.review_invitations
  where token_hash = encode(
    extensions.digest(convert_to(p_token, 'UTF8'), 'sha256'),
    'hex'
  ) for update;
  if invitation.id is null then raise exception 'Convite inválido'; end if;
  if invitation.used_at is not null then raise exception 'Este convite já foi utilizado'; end if;
  if invitation.expires_at <= now() then raise exception 'Este convite expirou'; end if;
  if current_email <> invitation.contratante_email then
    raise exception 'Entre com o e-mail convidado para publicar esta avaliação';
  end if;
  if not exists (select 1 from public.profiles where id=auth.uid() and role::text='contratante') then
    raise exception 'Somente contas de contratante podem avaliar';
  end if;
  select categoria_id into category_id from public.professional_services
  where prestador_id=invitation.prestador_id order by id limit 1;
  insert into public.service_requests(contratante_id, prestador_id, categoria_id, titulo, descricao, cidade, estado, status, completed_at)
  select auth.uid(), invitation.prestador_id, category_id, 'Serviço confirmado por convite',
    'Avaliação autorizada pelo prestador por convite individual.',
    coalesce(nullif(trim(c.cidade),''), nullif(trim(p.cidade),''), 'Não informada'),
    coalesce(nullif(trim(c.estado),''), nullif(trim(p.estado),''), 'SP'),
    'concluido'::public.service_status, now()
  from public.profiles c join public.profiles p on p.id=invitation.prestador_id
  where c.id=auth.uid() returning id into request_id;
  insert into public.reviews(solicitacao_id, autor_id, avaliado_id, nota, comentario)
  values(request_id, auth.uid(), invitation.prestador_id, p_nota, nullif(trim(p_comentario),''))
  returning id into review_id;
  update public.review_invitations set used_at=now(), used_by=auth.uid() where id=invitation.id;
  insert into public.notifications(user_id, message, kind)
  values(invitation.prestador_id, 'Você recebeu uma nova avaliação.', 'info');
  return review_id;
end;
$$;

revoke all on function public.create_review_invitation(text, integer) from public;
revoke all on function public.get_review_invitation(text) from public;
revoke all on function public.submit_invited_review(text, smallint, text) from public;
grant execute on function public.create_review_invitation(text, integer) to authenticated;
grant execute on function public.get_review_invitation(text) to anon, authenticated;
grant execute on function public.submit_invited_review(text, smallint, text) to authenticated;

-- Impede a avaliação pública antiga sem convite.
revoke execute on function public.submit_provider_review(uuid, smallint, text) from authenticated;
revoke insert on public.reviews from authenticated;
