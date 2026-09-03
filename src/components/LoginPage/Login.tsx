import { BriefcaseBusiness, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { signIn, signUp, type UserRole } from "../../service/SingUpService";
import { InputField } from "../InputField";
import Google from "../Google";

export function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("contratante");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { session, loading: sessionLoading } = useAuth();
  const navigate = useNavigate();

  if (!sessionLoading && session) return <Navigate to="/" replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = isSignUp
      ? await signUp(nome.trim(), email.trim(), password, role)
      : await signIn(email.trim(), password);

    setLoading(false);
    if (error) return setMessage(error.message);
    if (isSignUp && !data.session) return setMessage("Conta criada! Confirme seu e-mail para entrar.");
    navigate("/", { replace: true });
  }

  return (
    <main className="min-h-screen bg-[#f4f6f7]">
      <section className="flex min-h-screen w-full flex-col overflow-hidden bg-[#f4f6f7] lg:flex-row">
        <aside className={`relative flex min-h-[310px] flex-col overflow-hidden bg-[#215985] px-7 py-7 text-white lg:min-h-full lg:w-[47%] lg:px-12 lg:py-10 ${isSignUp ? "lg:order-1 lg:[clip-path:polygon(0_0,100%_0,82%_100%,0_100%)]" : "lg:order-2 lg:[clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)] lg:pl-28"}`}>
          <Link to="/" aria-label="Voltar para o início">
            <img src="/assets/oportuniza-completo-branco.png" alt="Oportuniza" className="w-36 lg:w-44" />
          </Link>

          <div className="relative mx-auto my-auto grid h-44 w-full place-items-center lg:h-96">
            <img src="/assets/pessoa.png" alt="Pessoa trabalhando no notebook" className="h-full w-auto object-contain drop-shadow-2xl lg:max-h-96" />
          </div>
        </aside>

        <div className={`relative z-10 -mt-7 flex flex-1 items-center justify-center rounded-t-[32px] bg-[#f4f6f7] px-6 py-10 lg:mt-0 lg:rounded-none lg:px-16 ${isSignUp ? "lg:order-2" : "lg:order-1"}`}>
          <div className="w-full max-w-md">
            <h1 className="text-center text-3xl font-extrabold text-text-title lg:text-4xl">
              {isSignUp ? "Crie sua Conta!" : "Entre na sua Conta"}
            </h1>

            <div className="mt-6 grid grid-cols-2 rounded-lg bg-[#dedede] p-1 shadow-sm">
              <button type="button" onClick={() => setRole("contratante")} className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition ${role === "contratante" ? "bg-white text-green-sprout shadow-sm" : "text-text-secondary"}`}>
                <UserRound size={14} /> Contratante
              </button>
              <button type="button" onClick={() => setRole("prestador")} className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition ${role === "prestador" ? "bg-white text-blue-depth shadow-sm" : "text-text-secondary"}`}>
                <BriefcaseBusiness size={14} /> Prestador
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {isSignUp && (
                <InputField id="nome" type="text" aria-label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required autoComplete="name" placeholder="Digite seu nome" />
              )}
              <InputField id="email" type="email" aria-label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="Digite seu email" />
              <InputField id="senha" type="password" aria-label="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete={isSignUp ? "new-password" : "current-password"} placeholder={isSignUp ? "Crie sua senha" : "Digite sua senha"} />

              {message && <p role="alert" className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-depth">{message}</p>}
              <button type="submit" disabled={loading} className="w-full rounded-lg bg-linear-to-r from-blue-depth to-green-sprout px-6 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Aguarde..." : isSignUp ? "Criar Conta" : "Entrar"}
              </button>
            </form>

            <Google />

            <button type="button" onClick={() => { setIsSignUp((value) => !value); setMessage(""); }} className="mt-5 w-full text-sm font-semibold text-blue-depth hover:underline">
              {isSignUp ? "Já tem uma conta? Entre" : "Ainda não tem conta? Criar conta"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
