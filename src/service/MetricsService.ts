import { supabase } from "./supabaseClient";

export interface ProviderMetrics {
  profile_views_total: number;
  profile_views_30_days: number;
  profile_views_7_days: number;
  category_searches_30_days: number;
  reviews_total: number;
  average_rating: number | null;
}

export async function getMyProviderMetrics() {
  const { data, error } = await supabase.rpc("get_my_provider_metrics");
  if (error) throw error;
  return data as ProviderMetrics;
}

export async function recordProfileView(providerId: string) {
  const key = `oportuniza:profile-view:${providerId}`;
  if (sessionStorage.getItem(key)) return;
  const { error } = await supabase.rpc("record_profile_view", {
    p_provider_id: providerId,
  });
  if (error) console.warn("Não foi possível registrar a visualização.", error);
  else sessionStorage.setItem(key, "1");
}

export async function recordProfessionalSearch(categoryName: string) {
  const key = `oportuniza:professional-search:${categoryName}`;
  if (sessionStorage.getItem(key)) return;
  const { error } = await supabase.rpc("record_professional_search", {
    p_category_name: categoryName,
  });
  if (error) console.warn("Não foi possível registrar a busca.", error);
  else sessionStorage.setItem(key, "1");
}
