-- A foto de perfil deve poder ser atualizada sem reenviar CPF, telefone ou
-- endereço. A RPC altera somente a URL do avatar do próprio usuário.
begin;

create or replace function public.update_my_avatar(p_avatar_url text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  clean_url text := nullif(trim(p_avatar_url), '');
  expected_path text;
begin
  if current_user_id is null then
    raise exception 'Usuário não autenticado';
  end if;

  if clean_url is null or char_length(clean_url) > 2048 then
    raise exception 'Endereço da foto inválido';
  end if;

  expected_path := '/storage/v1/object/public/profile-media/'
    || current_user_id::text || '/avatar/';

  if clean_url !~ '^https://' or position(expected_path in clean_url) = 0 then
    raise exception 'A foto deve pertencer à sua conta';
  end if;

  update public.profiles
  set avatar_url = clean_url
  where id = current_user_id;

  if not found then
    raise exception 'Perfil não encontrado';
  end if;
end;
$$;

revoke execute on function public.update_my_avatar(text)
  from public, anon, authenticated;
grant execute on function public.update_my_avatar(text)
  to authenticated;

commit;
