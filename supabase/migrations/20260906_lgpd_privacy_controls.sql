-- Controles de privacidade, consentimento e exclusao (LGPD).
create extension if not exists "pgcrypto";
create extension if not exists "supabase_vault" with schema vault;

alter table public.profiles add column if not exists cpf_encrypted bytea;
alter table public.profiles add column if not exists cpf_fingerprint text;
alter table public.profiles add column if not exists cpf_cadastrado boolean not null default false;
alter table public.profiles add column if not exists whatsapp_publico boolean not null default false;
alter table public.profiles add column if not exists termos_aceitos_em timestamptz;
alter table public.profiles add column if not exists politica_versao text;
create unique index if not exists profiles_cpf_fingerprint_key
  on public.profiles(cpf_fingerprint) where cpf_fingerprint is not null;

do $$
begin
  if not exists (select 1 from vault.secrets where name = 'profile_cpf_encryption_key') then
    perform vault.create_secret(
      encode(extensions.gen_random_bytes(32), 'hex'),
      'profile_cpf_encryption_key',
      'Chave interna para proteger CPF; nunca enviar ao navegador'
    );
  end if;
end $$;

-- Registra aceite informado no cadastro por e-mail.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  insert into public.profiles(id,nome,email,role,cadastro_completo,termos_aceitos_em,politica_versao)
  values(new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'name'),''),nullif(trim(new.raw_user_meta_data->>'full_name'),''),nullif(split_part(new.email,'@',1),''),'Usuário'),
    new.email,
    case when new.raw_user_meta_data->>'role'='prestador' then 'prestador'::public.user_role else 'contratante'::public.user_role end,
    false,
    case when new.raw_user_meta_data->>'legal_version' is not null then now() else null end,
    new.raw_user_meta_data->>'legal_version')
  on conflict(id) do update set email=excluded.email,
    termos_aceitos_em=coalesce(public.profiles.termos_aceitos_em,excluded.termos_aceitos_em),
    politica_versao=coalesce(public.profiles.politica_versao,excluded.politica_versao);
  return new;
end $$;

create or replace function public.is_valid_cpf(value text)
returns boolean language plpgsql immutable set search_path = '' as $$
declare
  n text := regexp_replace(coalesce(value, ''), '[^0-9]', '', 'g');
  total integer;
  digit integer;
  i integer;
begin
  if length(n) <> 11 or n ~ '^(.)\1{10}$' then return false; end if;
  total := 0;
  for i in 1..9 loop total := total + substring(n, i, 1)::int * (11 - i); end loop;
  digit := (total * 10) % 11; if digit = 10 then digit := 0; end if;
  if digit <> substring(n, 10, 1)::int then return false; end if;
  total := 0;
  for i in 1..10 loop total := total + substring(n, i, 1)::int * (12 - i); end loop;
  digit := (total * 10) % 11; if digit = 10 then digit := 0; end if;
  return digit = substring(n, 11, 1)::int;
end $$;

-- Migra CPFs legados e apaga o texto puro.
do $$
declare secret_value text;
begin
  select decrypted_secret into secret_value
  from vault.decrypted_secrets where name = 'profile_cpf_encryption_key' limit 1;
  update public.profiles
  set cpf_encrypted = extensions.pgp_sym_encrypt(cpf, secret_value, 'cipher-algo=aes256'),
      cpf_fingerprint = encode(extensions.hmac(cpf, secret_value, 'sha256'), 'hex'),
      cpf_cadastrado = true,
      cpf = null
  where cpf is not null and length(regexp_replace(cpf, '[^0-9]', '', 'g')) = 11
    and cpf_encrypted is null;
end $$;

drop function if exists public.save_my_profile(text,text,text,text,text,text,text,text,bigint);
create function public.save_my_profile(
  p_nome text, p_cpf text, p_whatsapp text, p_cidade text, p_bairro text,
  p_estado text, p_avatar_url text, p_bio text, p_categoria_id bigint default null,
  p_whatsapp_publico boolean default false
) returns boolean language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid(); role_value text; clean_cpf text;
  clean_phone text; complete boolean; onboard boolean; secret_value text;
begin
  if uid is null then raise exception 'Usuário não autenticado'; end if;
  select role::text into role_value from public.profiles where id = uid;
  if role_value is null then raise exception 'Perfil não encontrado'; end if;
  if nullif(trim(p_nome), '') is null then raise exception 'O nome é obrigatório'; end if;
  clean_cpf := regexp_replace(coalesce(p_cpf, ''), '[^0-9]', '', 'g');
  clean_phone := regexp_replace(coalesce(p_whatsapp, ''), '[^0-9]', '', 'g');
  if clean_cpf <> '' and not public.is_valid_cpf(clean_cpf) then raise exception 'Informe um CPF válido'; end if;
  if clean_cpf = '' and not coalesce((select cpf_cadastrado from public.profiles where id=uid), false)
    then raise exception 'Informe seu CPF'; end if;
  if length(clean_phone) not between 10 and 13 then raise exception 'Informe um WhatsApp válido'; end if;
  if nullif(trim(p_estado),'') is not null and upper(trim(p_estado)) !~ '^[A-Z]{2}$'
    then raise exception 'Use a sigla do estado com duas letras'; end if;

  if clean_cpf <> '' then
    select decrypted_secret into secret_value from vault.decrypted_secrets
      where name='profile_cpf_encryption_key' limit 1;
    if secret_value is null then raise exception 'Configuração segura do CPF indisponível'; end if;
  end if;

  update public.profiles set
    nome=trim(p_nome), whatsapp=clean_phone, whatsapp_publico=coalesce(p_whatsapp_publico,false),
    cidade=nullif(trim(p_cidade),''), bairro=nullif(trim(p_bairro),''),
    estado=nullif(upper(trim(p_estado)),''), avatar_url=nullif(trim(p_avatar_url),''),
    bio=nullif(trim(p_bio),''),
    cpf_encrypted=case when clean_cpf<>'' then extensions.pgp_sym_encrypt(clean_cpf,secret_value,'cipher-algo=aes256') else cpf_encrypted end,
    cpf_fingerprint=case when clean_cpf<>'' then encode(extensions.hmac(clean_cpf,secret_value,'sha256'),'hex') else cpf_fingerprint end,
    cpf_cadastrado=cpf_cadastrado or clean_cpf<>'' , cpf=null
  where id=uid;

  if role_value='prestador' and p_categoria_id is not null then
    if not exists(select 1 from public.categories where id=p_categoria_id and ativo)
      then raise exception 'Categoria inválida ou inativa'; end if;
    insert into public.professional_services(prestador_id,categoria_id,descricao)
      values(uid,p_categoria_id,nullif(trim(p_bio),''))
      on conflict(prestador_id,categoria_id) do update set descricao=excluded.descricao;
  end if;
  onboard := (select cpf_cadastrado from public.profiles where id=uid)
    and length(clean_phone) between 10 and 13 and nullif(trim(p_cidade),'') is not null
    and nullif(trim(p_bairro),'') is not null and upper(trim(p_estado)) ~ '^[A-Z]{2}$';
  if role_value='prestador' then
    select nullif(trim(nome),'') is not null and nullif(trim(cidade),'') is not null
      and estado ~ '^[A-Z]{2}$' and nullif(trim(avatar_url),'') is not null
      and nullif(trim(bio),'') is not null and exists(select 1 from public.professional_services s where s.prestador_id=uid)
      into complete from public.profiles where id=uid;
  else complete := true; end if;
  update public.profiles set onboarding_completo=onboard,cadastro_completo=complete where id=uid;
  return complete;
exception when unique_violation then
  raise exception 'Este CPF já está cadastrado em outra conta';
end $$;
revoke all on function public.save_my_profile(text,text,text,text,text,text,text,text,bigint,boolean) from public;
grant execute on function public.save_my_profile(text,text,text,text,text,text,text,text,bigint,boolean) to authenticated;

create or replace function public.record_my_legal_acceptance(p_version text)
returns void language sql security definer set search_path='' as $$
  update public.profiles set termos_aceitos_em=now(), politica_versao=p_version where id=auth.uid();
$$;
revoke all on function public.record_my_legal_acceptance(text) from public;
grant execute on function public.record_my_legal_acceptance(text) to authenticated;

create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path='' as $$
begin
  if auth.uid() is null then raise exception 'Usuário não autenticado'; end if;
  delete from auth.users where id=auth.uid();
end $$;
revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;

-- O endpoint público nunca revela CPF e só revela WhatsApp com autorização.
drop function if exists public.get_prestadores_publicos();
create function public.get_prestadores_publicos()
returns table(service_id uuid,prestador_id uuid,nome text,specialty text,rating numeric,
 description text,avatar_url text,bairro text,cidade text,estado text,bio text,whatsapp text)
language sql stable security definer set search_path='' as $$
 select ps.id,p.id,p.nome,c.nome,round(avg(r.nota)::numeric,1),coalesce(ps.descricao,p.bio),
 p.avatar_url,p.bairro,p.cidade,p.estado,p.bio,
 case when p.whatsapp_publico then p.whatsapp else null end
 from public.profiles p join public.professional_services ps on ps.prestador_id=p.id
 join public.categories c on c.id=ps.categoria_id and c.ativo
 left join public.reviews r on r.avaliado_id=p.id
 where p.role::text='prestador' and p.cadastro_completo
 group by ps.id,p.id,p.nome,c.nome,ps.descricao,p.avatar_url,p.bairro,p.cidade,p.estado,p.bio,p.whatsapp,p.whatsapp_publico;
$$;
revoke all on function public.get_prestadores_publicos() from public;
grant execute on function public.get_prestadores_publicos() to anon,authenticated;

-- Conteúdo público somente de prestadores com cadastro completo.
drop policy if exists "portfolio public read" on public.portfolios;
drop policy if exists "portfolios public read" on public.portfolios;
create policy "portfolio complete provider read" on public.portfolios for select to anon,authenticated
 using (exists(select 1 from public.profiles p where p.id=prestador_id and p.cadastro_completo));
drop policy if exists "reviews public read" on public.reviews;
create policy "reviews complete provider read" on public.reviews for select to anon,authenticated
 using (exists(select 1 from public.profiles p where p.id=avaliado_id and p.cadastro_completo));
drop policy if exists "replies public read" on public.review_replies;
create policy "replies of published reviews read" on public.review_replies for select to anon,authenticated
 using (exists(select 1 from public.reviews r join public.profiles p on p.id=r.avaliado_id
   where r.id=avaliacao_id and p.cadastro_completo));

-- Listagem de arquivos somente pelo dono; bucket público continua servindo URLs públicas.
drop policy if exists "profile media public read" on storage.objects;
create policy "profile media owner read" on storage.objects for select to authenticated
 using (bucket_id='profile-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
