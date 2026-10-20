import { supabase } from "./supabaseClient";

export interface Category {
  id: number;
  nome: string;
  nome_masculino: string | null;
  nome_feminino: string | null;
  ativo: boolean;
}

export type ProfileGender = "homem" | "mulher" | "";

export function getCategoryDisplayName(
  category: Category | undefined,
  gender: ProfileGender,
) {
  if (!category) return "";
  if (gender === "mulher") return category.nome_feminino || category.nome;
  if (gender === "homem") return category.nome_masculino || category.nome;
  return category.nome;
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, nome, nome_masculino, nome_feminino, ativo");

  if (error) {
    console.error("Erro ao buscar categorias:", error);
    throw error;
  }

  return (data as Category[]) || [];
}
