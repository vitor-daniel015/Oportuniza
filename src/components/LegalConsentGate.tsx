import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LEGAL_VERSION } from "../service/LoginService";
import { supabase } from "../service/supabaseClient";

export function LegalConsentGate() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [required, setRequired] = useState(false);
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setRequired(false);
      return;
    }
    supabase
      .from("profiles")
      .select("termos_aceitos_em, politica_versao")
      .eq("id", user.id)
      .single()
      .then(({ data, error: loadError }) => {
        if (!loadError)
          setRequired(
            !data?.termos_aceitos_em || data.politica_versao !== LEGAL_VERSION,
          );
      });
  }, [user]);

  async function accept() {
    if (!checked) return setError("Marque a opção de aceite para continuar.");
    setSaving(true);
    setError("");
    const { error: saveError } = await supabase.rpc(
      "record_my_legal_acceptance",
      { p_version: LEGAL_VERSION },
    );
    setSaving(false);
    if (saveError)
      return setError("Não foi possível registrar o aceite. Tente novamente.");
    setRequired(false);
  }

  if (
    !user ||
    !required ||
    pathname === "/termos-de-uso" ||
    pathname === "/politica-de-privacidade"
  )
    return null;
  return (
    <div className="fixed inset-0 z-100 grid place-items-center overflow-y-auto bg-[#10253b]/80 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-title"
        className="my-auto w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-9"
      >
        <ShieldCheck className="text-green-sprout" size={42} />
        <h2
          id="legal-title"
          className="mt-4 text-2xl font-extrabold text-text-title"
        >
          Antes de continuar
        </h2>
        <p className="mt-3 leading-relaxed text-text-secondary">
          Sua conta já foi criada. Leia e aceite os documentos abaixo para
          acessar o Oportuniza.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            target="_blank"
            to="/termos-de-uso"
            className="font-bold text-blue-depth underline"
          >
            Ler Termos de Uso
          </Link>
          <Link
            target="_blank"
            to="/politica-de-privacidade"
            className="font-bold text-blue-depth underline"
          >
            Ler Política de Privacidade
          </Link>
        </div>
        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl bg-blue-50 p-4 text-sm leading-relaxed">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 accent-[#49a75d]"
          />
          <span>Li e aceito os Termos de Uso e a Política de Privacidade.</span>
        </label>
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        <button
          type="button"
          disabled={saving}
          onClick={accept}
          className="mt-5 w-full rounded-xl bg-linear-to-r from-blue-depth to-green-sprout px-5 py-4 font-bold text-white disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Aceitar e continuar"}
        </button>
      </section>
    </div>
  );
}
