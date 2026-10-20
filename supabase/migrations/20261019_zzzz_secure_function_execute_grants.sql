-- Funções novas no PostgreSQL recebem EXECUTE de PUBLIC por padrão. Como os
-- papéis anon e authenticated herdam esse acesso, revogar somente de PUBLIC
-- não remove eventuais grants diretos já criados pelo Supabase.
--
-- Esta migration redefine explicitamente quem pode executar cada RPC usada
-- pelo aplicativo. Funções SECURITY DEFINER nunca devem ficar expostas além do
-- necessário, pois executam com os privilégios de seu proprietário.
begin;

-- Perfil, conta, métricas e notificações exigem uma sessão autenticada.
revoke execute on function public.add_my_notification(text, text)
  from public, anon, authenticated;
grant execute on function public.add_my_notification(text, text)
  to authenticated;

revoke execute on function public.create_review_invitation(text, integer)
  from public, anon, authenticated;
grant execute on function public.create_review_invitation(text, integer)
  to authenticated;

revoke execute on function public.delete_my_account()
  from public, anon, authenticated;
grant execute on function public.delete_my_account()
  to authenticated;

revoke execute on function public.get_my_provider_metrics()
  from public, anon, authenticated;
grant execute on function public.get_my_provider_metrics()
  to authenticated;

revoke execute on function public.get_prestadores_publicos()
  from public, anon, authenticated;
grant execute on function public.get_prestadores_publicos()
  to authenticated;

revoke execute on function public.record_my_legal_acceptance(text)
  from public, anon, authenticated;
grant execute on function public.record_my_legal_acceptance(text)
  to authenticated;

revoke execute on function public.record_professional_search(text)
  from public, anon, authenticated;
grant execute on function public.record_professional_search(text)
  to authenticated;

revoke execute on function public.record_profile_view(uuid)
  from public, anon, authenticated;
grant execute on function public.record_profile_view(uuid)
  to authenticated;

revoke execute on function public.save_my_profile(
  text, text, text, text, text, text, text, text, bigint, boolean
) from public, anon, authenticated;
grant execute on function public.save_my_profile(
  text, text, text, text, text, text, text, text, bigint, boolean
) to authenticated;

revoke execute on function public.set_my_initial_role(public.user_role)
  from public, anon, authenticated;
grant execute on function public.set_my_initial_role(public.user_role)
  to authenticated;

revoke execute on function public.submit_invited_review(text, smallint, text)
  from public, anon, authenticated;
grant execute on function public.submit_invited_review(text, smallint, text)
  to authenticated;

-- O token aleatório do convite funciona como credencial temporária. Esta RPC
-- precisa ser consultável antes do login para a tela explicar o convite, mas
-- retorna somente dados públicos e não permite publicar a avaliação.
revoke execute on function public.get_review_invitation(text)
  from public, anon, authenticated;
grant execute on function public.get_review_invitation(text)
  to anon, authenticated;

-- RPC antiga desativada e funções internas de triggers/validação.
revoke execute on function public.submit_provider_review(uuid, smallint, text)
  from public, anon, authenticated;
revoke execute on function public.handle_new_user()
  from public, anon, authenticated;
revoke execute on function public.sync_user_email()
  from public, anon, authenticated;
revoke execute on function public.is_valid_cpf(text)
  from public, anon, authenticated;
revoke execute on function public.set_updated_at()
  from public, anon, authenticated;

-- Novas funções ficam fechadas até receberem um GRANT explícito na migration
-- que as criar.
alter default privileges in schema public
  revoke execute on functions from public, anon, authenticated;

commit;
