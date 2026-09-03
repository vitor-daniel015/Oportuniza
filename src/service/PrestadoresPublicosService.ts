import { supabase } from './supabaseClient';

export interface PrestadorPublico {
  prestador_id: string;
  nome: string;
  specialty: string;
  rating: number;
  description: string;
  avatar_url: string;
  bairro?: string;
  cidade: string;
  estado: string;
}

export async function getPrestadoresPublicos(): Promise<PrestadorPublico[]> {
const { data, error } = await supabase
  .from('prestadores_publicos')
  .select('prestador_id, nome, specialty, rating, description, avatar_url, bairro, cidade, estado');

  if (error) {
    console.error('Erro ao buscar prestadores:', error);
    throw error;
  }

  return (data as PrestadorPublico[]) || [];
}









