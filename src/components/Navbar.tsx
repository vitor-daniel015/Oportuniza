import { ArrowRight, BriefcaseBusiness, CircleHelp, Home, LogIn, Menu, MessageCircle, Search, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ButtonOportuniza } from "../components/Button";
import { useAuth } from "../contexts/AuthContext";

const links = [
  { label: "Página inicial", shortLabel: "Início", description: "Voltar para o começo", href: "/", icon: Home },
  { label: "Como funciona", shortLabel: "Como funciona", description: "Entenda como usar o Oportuniza", href: "/#servicos", icon: CircleHelp },
  { label: "Encontrar profissionais", shortLabel: "Profissionais", description: "Veja quem pode realizar seu serviço", href: "/prestadores", icon: Search },
  { label: "Fale conosco", shortLabel: "Contato", description: "Peça ajuda ou envie uma mensagem", href: "/contato", icon: MessageCircle },
];

type NavbarProps = {
  onAuthClick?: () => void;
};

export function Navbar({ onAuthClick }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const isGuest = !authLoading && !user;

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <>
      <header className={`relative z-40 bg-linear-to-r from-blue-depth via-[#27737C] to-green-sprout px-5 sm:px-8 md:h-40 md:rounded-bl-[110px] md:px-10 md:pt-7 lg:px-[7%] ${isGuest ? "h-55" : "h-38"}`}>
        <div className={`flex items-center justify-between md:block md:h-auto ${isGuest ? "h-34" : "h-full"}`}>
          <img
            src="/assets/oportuniza-completo-branco.png"
            alt="Oportuniza"
            className="h-auto w-44 object-contain sm:w-58 md:h-24 md:w-auto"
          />

          <div className="flex items-center gap-1 md:hidden">
            {isGuest && (
              <Link
                to="/entrar"
                className="rounded-lg px-3 py-2 text-sm font-bold text-white underline decoration-white/50 underline-offset-4"
              >
                Entrar
              </Link>
            )}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="rounded-md p-2 text-white"
              aria-label="Abrir menu com todas as opções"
              aria-expanded={isMenuOpen}
            >
              <Menu size={38} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {isGuest && (
          <Link
            to="/cadastrar"
            className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-xl bg-white px-5 py-4 text-blue-depth shadow-xl transition active:scale-[0.98] sm:left-8 sm:right-8 md:hidden"
          >
            <span>
              <strong className="block text-base">Faça parte do Oportuniza</strong>
            </span>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-depth text-white">
              <ArrowRight size={22} />
            </span>
          </Link>
        )}

        <nav className="absolute left-1/2 top-29 hidden w-[86%] max-w-277 -translate-x-1/2 items-center justify-between rounded-[5px] bg-[#F7F9FA] px-5 py-4 shadow-[0_4px_4px_rgba(0,0,0,.25)] md:flex">
          <div className="flex flex-1 items-center justify-around">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-bold text-text-secondary transition-colors hover:text-text-title"
              >
                {link.shortLabel}
              </a>
            ))}
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/meu-perfil" className="flex items-center gap-2 rounded-lg bg-blue-depth px-5 py-3 text-sm font-bold text-white transition hover:bg-green-sprout">
                <UserRound size={20} /> Minha conta
              </Link>
            </div>
          ) : (
            <ButtonOportuniza title="Entrar ou criar conta" link="/entrar" color="#1e4f7a" colorHover="#163e61" />
          )}

        </nav>
      </header>

      {isMenuOpen && <div
        className="fixed inset-0 z-50 bg-[#101522]/65 md:hidden"
        onClick={closeMenu}
      >
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          className="ml-auto flex h-full w-[82%] max-w-90 flex-col bg-linear-to-b from-blue-depth via-[#27737C] to-green-sprout px-7 py-8 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <img
              src="/assets/oportuniza-completo-branco.png"
              alt="Oportuniza"
              className="w-48"
            />
            <button
              type="button"
              onClick={closeMenu}
              className="rounded-md p-2 text-white"
              aria-label="Fechar menu"
            >
              <X size={30} />
            </button>
          </div>

          <nav className="mt-14 space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="flex items-center gap-4 rounded-xl px-4 py-3 text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15"><Icon size={21} /></span>
                <span>
                  <strong className="block">{link.label}</strong>
                  <span className="block text-xs font-normal text-white/80">{link.description}</span>
                </span>
              </a>
              );
            })}
          </nav>

          {user ? (
            <div className="mt-auto space-y-3">
              <a
                href="/prestadores"
                onClick={closeMenu}
                className="block rounded-xl bg-white px-6 py-4 text-center font-bold text-text-title shadow-lg"
              >
                <span className="flex items-center justify-center gap-2"><BriefcaseBusiness size={19} /> Encontrar um profissional</span>
              </a>
              <Link
                to="/meu-perfil"
                onClick={closeMenu}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white px-6 py-4 font-bold text-white"
              >
                <UserRound size={19} />
                Minha conta e meu perfil
              </Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => { closeMenu(); onAuthClick?.(); }}
              className="mt-auto rounded-xl bg-white px-6 py-4 font-bold text-text-title shadow-lg"
            >
              <span className="flex items-center justify-center gap-2"><LogIn size={19} /> Entrar ou criar conta</span>
            </button>
          )}
        </aside>
      </div>}
    </>
  );
}
