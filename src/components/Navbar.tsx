import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { label: "Início", href: "/" },
  { label: "Sobre Nós", href: "/#sobre" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Contato", href: "/#contato" },
];

type NavbarProps = {
  onAuthClick?: () => void;
};

export function Navbar({ onAuthClick }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <header className="relative z-40 h-38 bg-linear-to-r from-brand-blue-depth via-[#27737C] to-brand-green-sprout px-8 md:h-40 md:rounded-bl-[110px] md:px-10 md:pt-7 lg:px-[7%]">
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
            aria-label="Abrir menu"
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
                className="px-4 py-2 text-sm font-bold text-text-secondary transition-colors hover:text-brand-blue-depth"
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={onAuthClick}
            className="ml-auto rounded-[5px] bg-brand-blue-depth px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#163e61]"
          >
            Acessar
          </button>
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
          className={`ml-auto flex h-full w-[82%] max-w-90 flex-col bg-linear-to-b from-brand-blue-depth via-[#27737C] to-brand-green-sprout px-7 py-8 shadow-2xl transition-transform duration-300 ease-out ${
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

          <button
            type="button"
            onClick={() => {
              closeMenu();
              onAuthClick?.();
            }}
            className="mt-auto rounded-xl bg-white px-6 py-4 font-bold text-brand-blue-depth shadow-lg"
          >
            Acessar
          </button>
        </aside>
      </div>
    </>
  );
}
