import { BriefcaseBusiness, UserRound, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { signInWithGoogle, type UserRole } from "../service/LoginService";

type GoogleProps = {
  mode?: "signin" | "signup";
  role?: UserRole;
};

const Google = ({ mode = "signin", role }: GoogleProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [choiceOpen, setChoiceOpen] = useState(false);

  async function continueWithGoogle(selectedRole?: UserRole) {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const { error } = await signInWithGoogle(selectedRole);
      if (error) setErrorMessage(error.message);
    } catch {
      setErrorMessage("Não foi possível entrar com o Google. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoogleLogin() {
    if (mode === "signup") void continueWithGoogle(role);
    else setChoiceOpen(true);
  }

  return (
    <div className="mt-3 w-full">
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            Aguarde...
          </span>
        ) : (
          <>
            <GoogleIcon />
            {mode === "signup" ? "Criar conta com o Google" : "Entrar com o Google"}
          </>
        )}
      </button>

      {mode === "signin" && (
        <p className="mt-2 text-center text-xs leading-relaxed text-text-secondary">
          Primeiro acesso? Você poderá escolher como deseja usar o site.
        </p>
      )}
      {errorMessage && (
        <p role="alert" className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-600">
          {errorMessage}
        </p>
      )}

      {choiceOpen && (
        <div className="fixed inset-0 z-60 grid place-items-center overflow-y-auto bg-[#101522]/65 p-4" onMouseDown={() => setChoiceOpen(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="google-choice-title"
            className="relative my-auto w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl sm:p-8"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button type="button" onClick={() => setChoiceOpen(false)} aria-label="Fechar" className="absolute right-4 top-4 rounded-full p-2 text-gray-600 hover:bg-gray-100">
              <X size={24} />
            </button>
            <h2 id="google-choice-title" className="pr-10 text-2xl font-extrabold text-text-title">
              Como você deseja continuar?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Escolha a opção que melhor descreve o que você quer fazer.
            </p>

            <div className="mt-5 space-y-3">
              <ChoiceButton
                icon={<UserRound size={25} />}
                title="Quero contratar um serviço"
                description="Vou procurar profissionais para realizar um trabalho."
                onClick={() => void continueWithGoogle("contratante")}
              />
              <ChoiceButton
                icon={<BriefcaseBusiness size={25} />}
                title="Quero oferecer meus serviços"
                description="Sou profissional e quero divulgar meu trabalho para clientes."
                onClick={() => void continueWithGoogle("prestador")}
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => void continueWithGoogle()}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-bold text-blue-depth hover:bg-gray-50 disabled:opacity-50"
              >
                Já tenho uma conta — somente entrar
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

function ChoiceButton({ icon, title, description, onClick }: { icon: ReactNode; title: string; description: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-start gap-4 rounded-2xl border-2 border-gray-200 p-4 text-left transition hover:border-green-sprout hover:bg-green-50">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-depth text-white">{icon}</span>
      <span>
        <strong className="block text-base text-text-title">{title}</strong>
        <span className="mt-1 block text-sm leading-relaxed text-text-secondary">{description}</span>
      </span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" className="h-5 w-5 shrink-0">
      <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
      <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" />
      <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" />
      <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" />
    </svg>
  );
}

export default Google;
