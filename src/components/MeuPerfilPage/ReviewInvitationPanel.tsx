import { useEffect, useState, type FormEvent } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import {
  createReviewInvitation,
  getMyReviewInvitations,
  type ReviewInvitationSummary,
} from "../../service/ReviewInvitationService";
import { useToast } from "../../contexts/ToastContext";
import { ProfileModal } from "./ProfileModal";

export function ReviewInvitationPanel() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [hours, setHours] = useState(72);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [invitations, setInvitations] = useState<ReviewInvitationSummary[]>([]);
  const { notify } = useToast();

  function refreshInvitations() {
    void getMyReviewInvitations().then(setInvitations).catch(() => undefined);
  }

  useEffect(refreshInvitations, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      setLink(await createReviewInvitation(email.trim(), hours));
      refreshInvitations();
      notify("Convite de avaliação criado.", "success");
    } catch (cause) {
      notify(cause instanceof Error ? cause.message : "Não foi possível criar o convite.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <section className="mt-10 flex flex-col gap-4 rounded-2xl border border-blue-depth/15 bg-white p-5 shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-depth text-white">
            <Link2 size={21} />
          </span>
          <div>
            <h2 className="text-xl font-extrabold text-text-title">Avaliações dos clientes</h2>
            <p className="mt-1 max-w-2xl text-sm text-text-secondary">
              Gere um convite individual depois de concluir um serviço.
            </p>
          </div>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="min-h-12 shrink-0 rounded-xl bg-blue-depth px-5 font-bold text-white transition hover:bg-[#163e61]">
          Solicitar avaliação
        </button>
      </section>

      {open && (
        <ProfileModal title="Solicitar uma avaliação" onClose={() => setOpen(false)}>
          <div className="mb-5 rounded-2xl bg-blue-50 p-4 text-sm leading-relaxed text-text-title">
            Informe o e-mail do contratante. O link poderá ser utilizado somente por essa pessoa, uma única vez e antes do vencimento.
          </div>

          <form onSubmit={submit} className="grid min-w-0 gap-4 sm:grid-cols-2">
            <label className="min-w-0 sm:col-span-2">
              <span className="mb-1 ml-1 block text-sm font-bold text-text-title">E-mail do contratante</span>
              <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="cliente@email.com" className="min-h-12 w-full min-w-0 rounded-xl bg-[#e5e5e5] px-4 text-text-title outline-none focus:ring-2 focus:ring-blue-depth" />
            </label>
            <label className="min-w-0">
              <span className="mb-1 ml-1 block text-sm font-bold text-text-title">Validade do convite</span>
              <select value={hours} onChange={(event) => setHours(Number(event.target.value))} className="min-h-12 w-full rounded-xl bg-[#e5e5e5] px-3 text-text-title outline-none focus:ring-2 focus:ring-blue-depth">
                <option value={24}>24 horas</option>
                <option value={72}>3 dias</option>
                <option value={168}>7 dias</option>
              </select>
            </label>
            <button disabled={loading} className="min-h-12 self-end rounded-xl bg-green-sprout px-5 font-bold text-white disabled:opacity-60">
              {loading ? "Gerando..." : "Gerar convite"}
            </button>
          </form>

          {link && (
            <div className="mt-5 min-w-0 rounded-2xl border border-blue-depth/15 bg-gray-50 p-4">
              <p className="break-all text-sm text-text-title">{link}</p>
              <button type="button" onClick={copyLink} className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-blue-depth px-4 font-bold text-blue-depth sm:w-auto">
                {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? "Link copiado" : "Copiar link"}
              </button>
            </div>
          )}

          {invitations.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-5">
              <h3 className="font-extrabold text-text-title">Convites recentes</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {invitations.map((invitation) => {
                  const expired = new Date(invitation.expires_at) <= new Date();
                  const status = invitation.used_at ? "Avaliação enviada" : expired ? "Expirado" : "Aguardando avaliação";
                  return (
                    <div key={invitation.id} className="min-w-0 rounded-xl bg-gray-100 p-3 text-sm text-text-title">
                      <strong className="block truncate">{invitation.contratante_email}</strong>
                      <span className="mt-1 block text-text-secondary">{status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </ProfileModal>
      )}
    </>
  );
}
