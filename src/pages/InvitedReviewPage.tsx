import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import {
  getReviewInvitation,
  postLoginRedirectKey,
  submitInvitedReview,
} from "../service/ReviewInvitationService";

export function InvitedReviewPage() {
  const { token = "" } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { notify } = useToast();
  const [invite, setInvite] = useState<Awaited<ReturnType<typeof getReviewInvitation>>>();
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getReviewInvitation(token)
      .then(setInvite)
      .catch(() => setError("Não foi possível validar este convite."))
      .finally(() => setLoading(false));
  }, [token]);

  if (!authLoading && !user) {
    sessionStorage.setItem(postLoginRedirectKey, `/avaliar/${token}`);
    return <Navigate to="/entrar" replace />;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!invite || rating === 0) return;
    setSaving(true);
    setError("");
    try {
      await submitInvitedReview(token, rating, comment);
      notify("Avaliação publicada. Obrigado por compartilhar sua experiência!", "success");
      navigate(`/prestador/${invite.prestador_id}`, { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível publicar a avaliação.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onAuthClick={() => navigate("/entrar")} />
      <main className="mx-auto min-h-[65vh] max-w-2xl px-5 py-12 md:pt-24">
        <section className="rounded-3xl bg-white p-6 shadow-xl sm:p-9">
          {loading ? (
            <p className="text-text-secondary">Validando convite...</p>
          ) : !invite || !invite.available ? (
            <div className="text-center">
              <h1 className="text-2xl font-extrabold text-text-title">Convite indisponível</h1>
              <p className="mt-2 text-text-secondary">Este link é inválido, já foi utilizado ou expirou.</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <span className="text-sm font-bold uppercase tracking-wide text-green-herbal">Convite verificado</span>
              <h1 className="mt-2 text-3xl font-extrabold text-text-title">Avaliar {invite.prestador_nome}</h1>
              <p className="mt-2 text-text-secondary">Use este convite apenas se o serviço realmente foi realizado.</p>
              <p className="mt-1 text-xs text-text-secondary">Válido até {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(invite.expires_at))}</p>
              <div className="mt-6 flex gap-2" role="radiogroup" aria-label="Nota">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button" role="radio" aria-checked={rating === value} aria-label={`${value} estrelas`} onClick={() => setRating(value)} className="rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-depth">
                    <Star size={36} className={value <= rating ? "fill-amber-400 text-amber-400" : "text-gray-400"} />
                  </button>
                ))}
              </div>
              <label className="mt-6 block">
                <span className="mb-2 block font-bold text-text-title">Como foi o serviço?</span>
                <textarea required maxLength={1000} rows={5} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Conte sobre atendimento, qualidade e pontualidade" className="w-full resize-none rounded-2xl border border-gray-300 p-4 outline-none focus:border-blue-depth focus:ring-2 focus:ring-blue-depth/20" />
              </label>
              {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <button disabled={saving || rating === 0} className="mt-6 w-full rounded-xl bg-linear-to-r from-blue-depth to-green-sprout px-5 py-4 font-bold text-white disabled:opacity-50">
                {saving ? "Publicando..." : "Publicar avaliação"}
              </button>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
