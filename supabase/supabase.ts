import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "placeholder-anon-key";

export const isSupabaseConfigured =
  !supabaseUrl.includes("placeholder") &&
  supabaseKey !== "placeholder-anon-key";
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function testSupabaseConnection(): Promise<{
  ok: boolean;
  message: string;
}> {
  if (!isSupabaseConfigured)
    return {
      ok: false,
      message: "As variáveis do Supabase ainda não foram configuradas.",
    };
  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);
    if (error)
      return {
        ok: false,
        message: `Conexão encontrada, mas o schema não está pronto: ${error.message}`,
      };
    return {
      ok: true,
      message: "Supabase conectado e schema validado com sucesso.",
    };
  } catch {
    return {
      ok: false,
      message: "Não foi possível acessar o projeto Supabase.",
    };
  }
}
