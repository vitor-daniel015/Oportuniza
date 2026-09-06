import { supabase } from "./supabaseClient";

export type UserRole = "contratante" | "prestador";

export async function signUp(name: string, email: string, password: string, role: UserRole) {
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

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/meu-perfil`,
    },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}
