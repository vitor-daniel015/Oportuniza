create or replace function public.set_my_initial_role(p_role public.user_role)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_role not in ('contratante'::public.user_role, 'prestador'::public.user_role) then
    raise exception 'Tipo de conta inválido.';
  end if;

  update public.profiles
  set
    role = p_role,
    updated_at = now()
  where id = (select auth.uid())
    and role <> 'admin'::public.user_role
    and onboarding_completo = false;
end;
$$;

revoke all on function public.set_my_initial_role(public.user_role) from public;
grant execute on function public.set_my_initial_role(public.user_role) to authenticated;
