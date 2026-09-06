import { useState, type FormEvent } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { signIn } from "../../service/LoginService";
import { InputField } from "../InputField";
import Google from "../Google";

export function SingIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { session, loading: sessionLoading } = useAuth();
  const navigate = useNavigate();

  if (!sessionLoading && session) return <Navigate to="/" replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await signIn(email.trim(), password);

    setLoading(false);
    if (error) return setMessage(error.message);
    navigate("/", { replace: true });
  }

  return (
    <main className="min-h-screen bg-[#f4f6f7]">
      <section className="flex min-h-screen w-full flex-col overflow-hidden bg-[#f4f6f7] lg:flex-row">

        {/* Banner à direita no desktop */}
        <aside className="relative flex min-h-77.7 flex-col overflow-hidden bg-[#215985] px-7 py-7 text-white lg:order-2 lg:min-h-full lg:w-[47%] lg:px-12 lg:py-10 lg:[clip-path:polygon(0_0,100%_0,100%_100%,18%_100%)]">
          <Link to="/" aria-label="Voltar para o início" className="absolute top-6 right-6 lg:top-10 lg:right-10">
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

        {/* Formulário à esquerda no desktop */}
        <div className="relative z-10 -mt-7 flex flex-1 items-center justify-center rounded-t-4xl bg-[#f4f6f7] px-6 py-10 lg:order-1 lg:mt-0 lg:rounded-none lg:px-16">
          <div className="w-full max-w-md">
            <h1 className="text-center text-3xl font-extrabold text-text-title lg:text-4xl">
              Entre na sua Conta
            </h1>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
                autoComplete="current-password"
                placeholder="Digite sua senha"
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
                {loading ? "Aguarde..." : "Entrar"}
              </button>
            </form>

            <Google />

            <Link
              to="/cadastrar"
              className="mt-5 block w-full text-center text-sm font-semibold text-blue-depth hover:underline"
            >
              Ainda não tem conta? Criar conta
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
