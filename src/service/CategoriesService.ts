import { supabase } from "./supabaseClient";

export interface Category {
  id: number;
  nome: string;
  ativo: boolean;
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, nome, ativo");

  if (error) {
    console.error("Erro ao buscar categorias:", error);
    throw error;
  }

  return (data as Category[]) || [];
}
