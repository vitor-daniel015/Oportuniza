import { supabase } from './supabaseClient';

export interface PrestadorPublico {
  service_id: string;
  prestador_id: string;
  nome: string;
  specialty: string;
  rating: number | null;
  description: string;
  avatar_url: string;
  bairro?: string;
  cidade: string;
  estado: string;
  bio: string;
  whatsapp: string | null;
}

export async function getPrestadoresPublicos(): Promise<PrestadorPublico[]> {
const { data, error } = await supabase.rpc('get_prestadores_publicos');

  if (error) {
    console.error('Erro ao buscar prestadores:', error);
    throw error;
  }

  return (data as PrestadorPublico[]) || [];
}









