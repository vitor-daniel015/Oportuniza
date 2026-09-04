import { supabase } from "./supabaseClient";

export type UserRole = "contratante" | "prestador";

export async function signUp(nome: string, email: string, password: string, role: UserRole) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nome, role },
      emailRedirectTo: `${window.location.origin}/`,
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
      redirectTo: `${window.location.origin}/`,
    },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}
