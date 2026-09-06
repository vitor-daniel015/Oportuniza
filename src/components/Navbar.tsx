import { Menu, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ButtonOportuniza } from "../components/Button";
import { useAuth } from "../contexts/AuthContext";

const links = [
  { label: "Início", href: "/" },
  { label: "Sobre Nós", href: "/#sobrenos" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Contato", href: "/contato" },
];

type NavbarProps = {
  onAuthClick?: () => void;
};

export function Navbar({ onAuthClick }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

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
      <header className="relative z-40 h-38 bg-linear-to-r from-blue-depth via-[#27737C] to-green-sprout px-5 sm:px-8 md:h-40 md:rounded-bl-[110px] md:px-10 md:pt-7 lg:px-[7%]">
        <div className="flex h-full items-center justify-between md:block md:h-auto">
          <img
            src="/assets/oportuniza-completo-branco.png"
            alt="Oportuniza"
            className="h-auto w-44 object-contain sm:w-58 md:h-24 md:w-auto"
          />

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="rounded-md p-2 text-white md:hidden"
            aria-label="Abrir Menu"
            aria-expanded={isMenuOpen}
          >
            <Menu size={38} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="absolute left-1/2 top-29 hidden w-[86%] max-w-277 -translate-x-1/2 items-center justify-between rounded-[5px] bg-[#F7F9FA] px-5 py-4 shadow-[0_4px_4px_rgba(0,0,0,.25)] md:flex">
          <div className="flex flex-1 items-center justify-around">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-bold text-text-secondary transition-colors hover:text-text-title"
              >
                {link.label}
              </a>
            ))}
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <ButtonOportuniza title="Ver prestadores" link="/prestadores" color="#1e4f7a" colorHover="#163e61" />
              <Link to="/meu-perfil" aria-label="Meu perfil" title="Meu perfil" className="grid h-12 w-12 place-items-center rounded-full bg-blue-depth text-white transition hover:bg-green-sprout">
                <UserRound size={25} />
              </Link>
            </div>
          ) : (
            <ButtonOportuniza title="Acessar" link="/entrar" color="#1e4f7a" colorHover="#163e61" />
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
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl px-5 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {user ? (
            <div className="mt-auto space-y-3">
              <a
                href="/prestadores"
                onClick={closeMenu}
                className="block rounded-xl bg-white px-6 py-4 text-center font-bold text-text-title shadow-lg"
              >
                Ver prestadores
              </a>
              <Link
                to="/meu-perfil"
                onClick={closeMenu}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white px-6 py-4 font-bold text-white"
              >
                <UserRound size={19} />
                Meu perfil
              </Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => { closeMenu(); onAuthClick?.(); }}
              className="mt-auto rounded-xl bg-white px-6 py-4 font-bold text-text-title shadow-lg"
            >
              Acessar
            </button>
          )}
        </aside>
      </div>}
    </>
  );
}
