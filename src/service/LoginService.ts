import { supabase } from "./supabaseClient";

export type UserRole = "contratante" | "prestador";

const pendingGoogleRoleKey = "oportuniza:pending-google-role";

export async function signUp(
  name: string,
  email: string,
  password: string,
  role: UserRole,
) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role },
      emailRedirectTo: `${window.location.origin}/meu-perfil`,
    },
  });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signInWithGoogle(role?: UserRole) {
  if (role) sessionStorage.setItem(pendingGoogleRoleKey, role);
  else sessionStorage.removeItem(pendingGoogleRoleKey);

  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/meu-perfil`,
    },
  });
}

export async function applyPendingGoogleRole() {
  const role = sessionStorage.getItem(pendingGoogleRoleKey) as UserRole | null;
  if (!role) return;

  const { error } = await supabase.rpc("set_my_initial_role", { p_role: role });
  if (error) throw error;
  sessionStorage.removeItem(pendingGoogleRoleKey);
}

export async function signOut() {
  return supabase.auth.signOut();
}
