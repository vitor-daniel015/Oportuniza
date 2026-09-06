import { supabase } from "./supabaseClient";
import type { PrestadorPublico } from "./PrestadoresPublicosService";

export async function getPerfilPublico(prestadorId: string) {
  const [perfilResult, portfolioResult, reviewsResult] =
    await Promise.all([
      supabase
        .rpc("get_prestadores_publicos")
        .eq("prestador_id", prestadorId),

      supabase
        .from("portfolios")
        .select("*")
        .eq("prestador_id", prestadorId)
        .order("created_at", { ascending: false }),

      supabase
        .from("reviews")
        .select(`
          id,
          nota,
          comentario,
          created_at,
          autor_id,
          review_replies (
            id,
            resposta_texto,
            created_at
          )
        `)
        .eq("avaliado_id", prestadorId)
        .order("created_at", { ascending: false }),
    ]);

  if (perfilResult.error) throw perfilResult.error;
  if (portfolioResult.error) throw portfolioResult.error;
  if (reviewsResult.error) throw reviewsResult.error;

  const servicos = (perfilResult.data as PrestadorPublico[]) || [];

  if (!servicos.length) {
    return null;
  }

  return {
    perfil: servicos[0],
    servicos,
    portfolio: portfolioResult.data,
    reviews: reviewsResult.data,
  };
}
