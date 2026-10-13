import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BarChart3, Eye, Search, Star } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { BackButton } from "../components/BackButton";
import { useAuth } from "../contexts/AuthContext";
import { getMeuPerfil } from "../service/MeuPerfilService";
import {
  getMyProviderMetrics,
  type ProviderMetrics,
} from "../service/MetricsService";

export function MetricsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<ProviderMetrics | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const profile = await getMeuPerfil(user!.id);
        const isProvider = profile.perfil.role === "prestador";
        setAllowed(isProvider);
        if (!isProvider) return;
        setMetrics(await getMyProviderMetrics());
      } catch {
        setError(
          "As métricas ainda não estão disponíveis. Aplique a migration de métricas no Supabase.",
        );
      }
    }
    void load();
  }, [user]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/entrar" replace />;
  if (allowed === false) return <Navigate to="/prestadores" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar onAuthClick={() => navigate("/entrar")} />
      <main className="mx-auto min-h-[65vh] max-w-6xl px-5 py-12 sm:px-8 md:pt-24">
        <BackButton label="Voltar" />
        <span className="text-sm font-bold uppercase tracking-widest text-green-herbal">
          Seu desempenho
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-text-title sm:text-4xl">
          Métricas do seu perfil
        </h1>
        <p className="mt-3 max-w-2xl text-text-secondary">
          Veja quantas pessoas demonstraram interesse no seu trabalho. Por
          privacidade, mostramos números agregados e não a identidade de quem
          apenas visitou ou pesquisou.
        </p>

        {error ? (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
            {error}
          </div>
        ) : !metrics ? (
          <p className="mt-10 text-text-secondary">Carregando métricas...</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={<Eye />}
              label="Visitas nos últimos 7 dias"
              value={metrics.profile_views_7_days}
            />
            <MetricCard
              icon={<BarChart3 />}
              label="Visitas nos últimos 30 dias"
              value={metrics.profile_views_30_days}
            />
            <MetricCard
              icon={<Search />}
              label="Buscas pela sua profissão em 30 dias"
              value={metrics.category_searches_30_days}
            />
            <MetricCard
              icon={<Star />}
              label="Avaliação média"
              value={
                metrics.average_rating === null
                  ? "Sem avaliações"
                  : `${metrics.average_rating.toFixed(1)} (${metrics.reviews_total})`
              }
            />
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-4">
              <p className="text-sm font-semibold text-text-secondary">
                Total histórico de visitas
              </p>
              <strong className="mt-2 block text-4xl text-text-title">
                {metrics.profile_views_total}
              </strong>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-blue-50 text-blue-depth">
        {icon}
      </span>
      <strong className="mt-5 block text-3xl text-text-title">{value}</strong>
      <p className="mt-1 text-sm text-text-secondary">{label}</p>
    </article>
  );
}
