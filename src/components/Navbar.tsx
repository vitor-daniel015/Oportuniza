import { LogOut, Menu, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonOportuniza } from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "../service/LoginService";

const links = [
  { label: "Início", href: "/" },
  { label: "Sobre Nós", href: "/#sobre" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Contato", href: "/contato" },
];

type NavbarProps = {
  onAuthClick?: () => void;
};

export function Navbar({ onAuthClick }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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

  async function handleSignOut() {
    setIsProfileOpen(false);
    closeMenu();
    await signOut();
  }

  return (
    <>
      <header className="relative z-40 h-38 bg-linear-to-r from-blue-depth via-[#27737C] to-green-sprout px-8 md:h-40 md:rounded-bl-[110px] md:px-10 md:pt-7 lg:px-[7%]">
        <div className="flex h-full items-center justify-between md:block md:h-auto">
          <img
            src="/assets/oportuniza-completo-branco.png"
            alt="Oportuniza"
            className="h-auto w-58 object-contain md:h-24 md:w-auto"
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
              <ButtonOportuniza title="Ver prestadores" link="/prestador" color="#1e4f7a" colorHover="#163e61" />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-md border border-blue-depth px-4 py-3 text-sm font-bold text-blue-depth transition hover:bg-blue-depth hover:text-white"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="menu"
                >
                  <UserRound size={18} />
                  Perfil
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 rounded-xl bg-white p-2 shadow-xl" role="menu">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      role="menuitem"
                    >
                      <LogOut size={17} />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <ButtonOportuniza title="Acessar" link="/entrar" color="#1e4f7a" colorHover="#163e61" />
          )}

        </nav>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-[#101522]/65 transition-opacity duration-300 md:hidden ${
          isMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
        aria-hidden={!isMenuOpen}
      >
        <aside
          className={`ml-auto flex h-full w-[82%] max-w-90 flex-col bg-linear-to-b from-blue-depth via-[#27737C] to-green-sprout px-7 py-8 shadow-2xl transition-transform duration-300 ease-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
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
            {links.map((link, index) => (
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
                href="/prestador"
                onClick={closeMenu}
                className="block rounded-xl bg-white px-6 py-4 text-center font-bold text-text-title shadow-lg"
              >
                Ver prestadores
              </a>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white px-6 py-4 font-bold text-white"
              >
                <LogOut size={19} />
                Sair
              </button>
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
      </div>
    </>
  );
}
