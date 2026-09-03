create or replace function public.handle_new_user ()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nome, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'nome'), ''), 'Usuário'),
    case
      when new.raw_user_meta_data->>'role' = 'prestador' then 'prestador'::public.user_role
      else 'contratante'::public.user_role
    end
  );
  return new;
end;
$$;
