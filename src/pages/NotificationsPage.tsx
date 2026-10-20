import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { BackButton } from "../components/BackButton";
import { useAuth } from "../contexts/AuthContext";
import {
  getNotifications,
  markAllNotificationsRead,
  type AppNotification,
} from "../service/NotificationService";

export function NotificationsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    getNotifications()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setFetching(false));
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/entrar" replace />;

  async function markAll() {
    await markAllNotificationsRead();
    setItems((current) =>
      current.map((item) => ({ ...item, read_at: new Date().toISOString() })),
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onAuthClick={() => navigate("/entrar")} />
      <main className="mx-auto min-h-[65vh] max-w-4xl px-5 py-12 md:pt-24">
        <BackButton label="Voltar" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-text-title">Notificações</h1>
            <p className="mt-2 text-text-secondary">Seu histórico de alterações e novidades da conta.</p>
          </div>
          {items.some((item) => !item.read_at) && (
            <button type="button" onClick={markAll} className="flex items-center gap-2 rounded-xl border border-blue-depth px-4 py-2 font-bold text-blue-depth">
              <CheckCheck size={19} /> Marcar como lidas
            </button>
          )}
        </div>

        <section className="mt-8 space-y-3">
          {fetching ? (
            <p className="text-text-secondary">Carregando notificações...</p>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <Bell className="mx-auto text-text-secondary" size={36} />
              <h2 className="mt-3 text-xl font-bold text-text-title">Nenhuma notificação ainda</h2>
              <p className="mt-2 text-text-secondary">Suas próximas alterações aparecerão aqui.</p>
            </div>
          ) : (
            items.map((item) => (
              <article key={item.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${item.read_at ? "border-gray-100" : "border-green-sprout/50"}`}>
                <div className="flex gap-3">
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.read_at ? "bg-gray-300" : "bg-green-sprout"}`} />
                  <div>
                    <p className="font-semibold text-text-title">{item.message}</p>
                    <time className="mt-1 block text-xs text-text-secondary">
                      {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(item.created_at))}
                    </time>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
