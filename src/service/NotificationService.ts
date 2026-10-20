import { supabase } from "./supabaseClient";

export interface AppNotification {
  id: string;
  message: string;
  kind: "success" | "info" | "warning";
  read_at: string | null;
  created_at: string;
}

export async function saveNotification(message: string, kind = "success") {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return;
  await supabase.rpc("add_my_notification", {
    p_message: message.slice(0, 240),
    p_kind: kind,
  });
  window.dispatchEvent(new Event("oportuniza:notifications-updated"));
}

export async function getNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select("id, message, kind, read_at, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as AppNotification[];
}

export async function markAllNotificationsRead() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", data.user.id)
    .is("read_at", null);
  if (error) throw error;
  window.dispatchEvent(new Event("oportuniza:notifications-updated"));
}
