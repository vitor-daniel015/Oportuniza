import { BriefcaseBusiness, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { signUp, type UserRole } from "../../service/LoginService";
import { InputField } from "../InputField";
import Google from "../Google";

export function SingUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("contratante");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { session, loading: sessionLoading } = useAuth();
  const navigate = useNavigate();

  if (!sessionLoading && session) return <Navigate to="/meu-perfil" replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await signUp(name.trim(), email.trim(), password, role);

    setLoading(false);
    if (error) return setMessage(error.message);
    if (!data.session) return setMessage("Conta criada! Confirme seu e-mail para entrar.");
    navigate("/meu-perfil", { replace: true });
  }

  return (
    <main className="min-h-screen bg-[#f4f6f7]">
      <section className="flex min-h-screen w-full flex-col overflow-hidden bg-[#f4f6f7] lg:flex-row">
        <aside className="relative flex min-h-77.7 flex-col overflow-hidden bg-[#215985] px-7 py-7 text-white lg:order-1 lg:min-h-full lg:w-[47%] lg:px-12 lg:py-10 lg:[clip-path:polygon(0_0,100%_0,82%_100%,0_100%)]">
          <Link to="/" aria-label="Voltar para o início">
            <img src="/assets/oportuniza-completo-branco.png" alt="Oportuniza" className="w-36 lg:w-44" />
          </Link>

          <div className="relative mx-auto my-auto grid h-44 w-full place-items-center lg:h-96">
            <img
              src="/assets/pessoa.png"
              alt="Pessoa trabalhando no notebook"
              className="h-full w-auto object-contain drop-shadow-2xl lg:max-h-96"
            ></img>
          </div>
        </aside>

        {/* Formulário à direita no desktop */}
        <div className="relative z-10 -mt-7 flex flex-1 items-center justify-center rounded-t-4xl bg-[#f4f6f7] px-6 py-10 lg:order-2 lg:mt-0 lg:rounded-none lg:px-16">
          <div className="w-full max-w-md">
            <h1 className="text-center text-3xl font-extrabold text-text-title lg:text-4xl">
              Crie sua Conta!
            </h1>

            <fieldset className="mt-6">
              <legend className="text-center text-base font-bold text-text-title">
                O que você deseja fazer no Oportuniza?
              </legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setRole("contratante")}
                aria-pressed={role === "contratante"}
                className={`rounded-2xl border-2 p-4 text-left transition ${role === "contratante" ? "border-green-sprout bg-green-50 shadow-md" : "border-gray-200 bg-white hover:border-green-sprout/50"}`}
              >
                <span className="flex items-center gap-2 font-bold text-text-title">
                  <UserRound size={20} /> Quero contratar
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRole("prestador")}
                aria-pressed={role === "prestador"}
                className={`rounded-2xl border-2 p-4 text-left transition ${role === "prestador" ? "border-blue-depth bg-blue-50 shadow-md" : "border-gray-200 bg-white hover:border-blue-depth/50"}`}
              >
                <span className="flex items-center gap-2 font-bold text-text-title">
                  <BriefcaseBusiness size={20} /> Quero trabalhar
                </span>
              </button>
              </div>
              <p className="mt-3 rounded-xl bg-white px-4 py-3 text-sm leading-relaxed text-text-secondary shadow-sm">
                <strong className="text-text-title">{role === "prestador" ? "Prestador:" : "Contratante:"}</strong>{" "}
                {role === "prestador"
                  ? "poderá criar um perfil profissional, divulgar seus trabalhos, receber avaliações e clientes."
                  : "poderá procurar profissionais, conversar com eles e avaliar os serviços realizados."}
              </p>
            </fieldset>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <InputField
                id="name"
                type="text"
                aria-label="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Digite seu nome"
              />
              <InputField
                id="email"
                type="email"
                aria-label="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Digite seu email"
              />
              <InputField
                id="senha"
                type="password"
                aria-label="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Crie sua senha"
              />

              {message && (
                <p role="alert" className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-depth">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-linear-to-r from-blue-depth to-green-sprout px-6 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Aguarde..." : "Criar Conta"}
              </button>
            </form>

            <Google mode="signup" role={role} />

            <Link
              to="/entrar"
              className="mt-5 block w-full text-center text-sm font-semibold text-blue-depth hover:underline"
            >
              Já tem uma conta? Entre
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
