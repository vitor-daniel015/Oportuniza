import { supabase } from "./supabaseClient";
import { assertTextAllowed } from "./ContentModerationService";

export const postLoginRedirectKey = "oportuniza:post-login-redirect";

export async function createReviewInvitation(email: string, hours = 72) {
  const { data, error } = await supabase.rpc("create_review_invitation", {
    p_contratante_email: email,
    p_expires_in_hours: hours,
  });
  if (error) throw error;
  return `${window.location.origin}/avaliar/${data as string}`;
}

export interface ReviewInvitationSummary {
  id: string;
  contratante_email: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

export async function getMyReviewInvitations() {
  const { data, error } = await supabase
    .from("review_invitations")
    .select("id, contratante_email, expires_at, used_at, created_at")
    .order("created_at", { ascending: false })
    .limit(5);
  if (error) throw error;
  return (data ?? []) as ReviewInvitationSummary[];
}

export async function getReviewInvitation(token: string) {
  const { data, error } = await supabase.rpc("get_review_invitation", {
    p_token: token,
  });
  if (error) throw error;
  return data?.[0] as
    | {
        prestador_id: string;
        prestador_nome: string;
        expires_at: string;
        available: boolean;
      }
    | undefined;
}

export async function submitInvitedReview(
  token: string,
  rating: number,
  comment: string,
) {
  assertTextAllowed(comment);
  const { error } = await supabase.rpc("submit_invited_review", {
    p_token: token,
    p_nota: rating,
    p_comentario: comment.trim() || null,
  });
  if (error) throw error;
}
