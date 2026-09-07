import { supabase } from "./supabaseClient";
import { assertTextAllowed } from "./ContentModerationService";

export interface MeuPerfil {
  id: string;
  role: "contratante" | "prestador" | "admin";
  nome: string;
  cpf: string | null;
  cpf_cadastrado: boolean;
  email: string | null;
  whatsapp: string | null;
  cidade: string | null;
  bairro: string | null;
  estado: string | null;
  avatar_url: string | null;
  bio: string | null;
  cadastro_completo: boolean;
  onboarding_completo: boolean;
  whatsapp_publico: boolean;
}

export async function getMeuPerfil(userId: string) {
  const [
    { data: perfil, error: perfilError },
    { data: servicos, error: servicosError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, role, nome, email, whatsapp, whatsapp_publico, cpf_cadastrado, cidade, bairro, estado, avatar_url, bio, cadastro_completo, onboarding_completo",
      )
      .eq("id", userId)
      .single(),
    supabase
      .from("professional_services")
      .select("categoria_id")
      .eq("prestador_id", userId)
      .limit(1),
  ]);

  if (perfilError) throw perfilError;
  if (servicosError) throw servicosError;

  return {
    perfil: { ...(perfil as Omit<MeuPerfil, "cpf">), cpf: null } as MeuPerfil,
    categoriaId: servicos?.[0]?.categoria_id?.toString() ?? "",
  };
}

export interface SaveProfileInput {
  nome: string;
  cpf: string;
  whatsapp: string;
  cidade: string;
  bairro: string;
  estado: string;
  avatarUrl: string;
  bio: string;
  categoriaId: string;
  whatsappPublico: boolean;
}

export async function saveMeuPerfil(input: SaveProfileInput) {
  [input.nome, input.bio, input.cidade, input.bairro, input.estado].forEach(
    assertTextAllowed,
  );
  return supabase.rpc("save_my_profile", {
    p_nome: input.nome,
    p_cpf: input.cpf,
    p_whatsapp: input.whatsapp,
    p_cidade: input.cidade,
    p_bairro: input.bairro,
    p_estado: input.estado,
    p_avatar_url: input.avatarUrl,
    p_bio: input.bio,
    p_categoria_id: input.categoriaId ? Number(input.categoriaId) : null,
    p_whatsapp_publico: input.whatsappPublico,
  });
}

export interface MeuPortfolio {
  id: string;
  titulo: string;
  descricao: string | null;
  imagem_url: string;
}

export interface MinhaAvaliacao {
  id: string;
  nota: number;
  comentario: string | null;
  created_at: string;
  review_replies:
    | { id: string; resposta_texto: string; created_at: string }[]
    | null;
}

export async function getMeuConteudo(userId: string) {
  const [
    { data: portfolio, error: portfolioError },
    { data: reviews, error: reviewsError },
  ] = await Promise.all([
    supabase
      .from("portfolios")
      .select("id, titulo, descricao, imagem_url")
      .eq("prestador_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("reviews")
      .select(
        "id, nota, comentario, created_at, review_replies(id, resposta_texto, created_at)",
      )
      .eq("avaliado_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  if (portfolioError) throw portfolioError;
  if (reviewsError) throw reviewsError;
  return {
    portfolio: (portfolio ?? []) as MeuPortfolio[],
    reviews: (reviews ?? []) as MinhaAvaliacao[],
  };
}

async function uploadMedia(
  userId: string,
  folder: "avatar" | "portfolio",
  file: File,
) {
  if (!file.type.startsWith("image/"))
    throw new Error("Selecione um arquivo de imagem.");
  if (file.size > 5 * 1024 * 1024)
    throw new Error("A imagem deve ter no máximo 5 MB.");

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from("profile-media")
    .upload(path, file, { contentType: file.type });
  if (error) throw error;
  return supabase.storage.from("profile-media").getPublicUrl(path).data
    .publicUrl;
}

export function uploadAvatar(userId: string, file: File) {
  return uploadMedia(userId, "avatar", file);
}

function storagePath(url: string | null | undefined) {
  const marker = "/profile-media/";
  const path = url?.split(marker)[1];
  return path ? decodeURIComponent(path.split("?")[0]) : null;
}

export async function removeProfileMedia(url: string | null | undefined) {
  const path = storagePath(url);
  if (!path) return;
  const { error } = await supabase.storage.from("profile-media").remove([path]);
  if (error) throw error;
}

export async function deleteMyAccount(userId: string) {
  for (const folder of ["avatar", "portfolio"] as const) {
    const { data, error } = await supabase.storage
      .from("profile-media")
      .list(`${userId}/${folder}`, { limit: 100 });
    if (error) throw error;
    const paths = (data ?? []).map((item) => `${userId}/${folder}/${item.name}`);
    if (paths.length) {
      const { error: removeError } = await supabase.storage
        .from("profile-media")
        .remove(paths);
      if (removeError) throw removeError;
    }
  }
  const { error } = await supabase.rpc("delete_my_account");
  if (error) throw error;
}

export async function cleanupUnusedProfileMedia(
  userId: string,
  activeUrls: Array<string | null | undefined>,
) {
  const activePaths = new Set(activeUrls.map(storagePath).filter(Boolean));
  const unused: string[] = [];
  for (const folder of ["avatar", "portfolio"] as const) {
    const { data, error } = await supabase.storage
      .from("profile-media")
      .list(`${userId}/${folder}`, { limit: 100 });
    if (error) throw error;
    for (const item of data ?? []) {
      const path = `${userId}/${folder}/${item.name}`;
      if (!activePaths.has(path)) unused.push(path);
    }
  }
  if (unused.length) {
    const { error } = await supabase.storage.from("profile-media").remove(unused);
    if (error) throw error;
  }
}

export async function addPortfolio(
  userId: string,
  title: string,
  description: string,
  file: File,
) {
  assertTextAllowed(title);
  assertTextAllowed(description);
  const imageUrl = await uploadMedia(userId, "portfolio", file);
  const { error } = await supabase.from("portfolios").insert({
    prestador_id: userId,
    titulo: title.trim(),
    descricao: description.trim() || null,
    imagem_url: imageUrl,
  });
  if (error) throw error;
}

export async function removePortfolio(id: string) {
  const { data: item, error: findError } = await supabase
    .from("portfolios")
    .select("imagem_url")
    .eq("id", id)
    .single();
  if (findError) throw findError;

  const { error } = await supabase.from("portfolios").delete().eq("id", id);
  if (error) throw error;

  await removeProfileMedia(item.imagem_url);
}

export async function saveReviewReply(
  reviewId: string,
  userId: string,
  text: string,
) {
  assertTextAllowed(text);
  const { error } = await supabase.from("review_replies").upsert(
    {
      avaliacao_id: reviewId,
      prestador_id: userId,
      resposta_texto: text.trim(),
    },
    { onConflict: "avaliacao_id" },
  );
  if (error) throw error;
}
