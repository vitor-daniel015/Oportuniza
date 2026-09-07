import { supabase } from "./supabaseClient";

export type UserRole = "contratante" | "prestador";

const pendingGoogleRoleKey = "oportuniza:pending-google-role";
const pendingLegalAcceptanceKey = "oportuniza:pending-legal-acceptance";
export const LEGAL_VERSION = "2026-09-06";

export async function signUp(
  name: string,
  email: string,
  password: string,
  role: UserRole,
  acceptedLegalTerms: boolean,
) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role, legal_version: acceptedLegalTerms ? LEGAL_VERSION : null },
      emailRedirectTo: `${window.location.origin}/meu-perfil`,
    },
  });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signInWithGoogle(role?: UserRole, acceptedLegalTerms = false) {
  if (role) sessionStorage.setItem(pendingGoogleRoleKey, role);
  else sessionStorage.removeItem(pendingGoogleRoleKey);
  if (acceptedLegalTerms) sessionStorage.setItem(pendingLegalAcceptanceKey, LEGAL_VERSION);

  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/meu-perfil`,
    },
  });
}

export async function applyPendingGoogleRole() {
  const role = sessionStorage.getItem(pendingGoogleRoleKey) as UserRole | null;
  if (role) {
    const { error } = await supabase.rpc("set_my_initial_role", { p_role: role });
    if (error) throw error;
    sessionStorage.removeItem(pendingGoogleRoleKey);
  }
  const version = sessionStorage.getItem(pendingLegalAcceptanceKey);
  if (version) {
    const { error } = await supabase.rpc("record_my_legal_acceptance", { p_version: version });
    if (error) throw error;
    sessionStorage.removeItem(pendingLegalAcceptanceKey);
  }
}

export async function signOut() {
  return supabase.auth.signOut();
}
