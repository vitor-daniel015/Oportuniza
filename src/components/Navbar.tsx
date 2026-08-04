import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
    { label: "Início", href: "/" },
    { label: "Sobre Nós", href: "/#sobre" },
    { label: "Serviços", href: "/#servicos" },
    { label: "Contato", href: "/contato" },
];
export function Navbar({ onAuthClick }: { onAuthClick?: () => void }) {
    const [open, setOpen] = useState(false);
    return (
        <header className="relative z-50 h-40.5 rounded-bl-[110px] bg-linear-to-r from-brand-blue-depth via-[#27737C] to-brand-green-sprout px-5 pt-7 sm:px-10 lg:px-[7%]">
            <img 
            src="/assets/oportuniza-completo-branco.png" 
            alt="Logo"
            className="h-24 w-auto" />

            <nav className="absolute left-1/2 top-29 flex w-[86%] max-w-277.5 -translate-x-1/2 items-center justify-between rounded-[5px] bg-[#F7F9FA] px-4 py-4 shadow-[0_4px_4px_rgba(0,0,0,.25)] lg:px-5">
                <div className="hidden flex-1 items-center justify-around md:flex">
                    {links.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-brand-blue-depth"
                        >
                            {l.label}
                        </a>
                    ))}
                </div>
                <button
                    onClick={onAuthClick}
                    className="ml-auto rounded-[5px] bg-brand-blue-depth px-8 py-3 text-sm font-bold text-white hover:bg-[#163e61]"
                >
                    Acessar
                </button>
                <button
                    onClick={() => setOpen(!open)}
                    className="ml-3 p-2 text-brand-blue-depth md:hidden"
                >
                    {open ? <X /> : <Menu />}
                </button>
                {open && (
                    <div className="absolute inset-x-0 top-19 rounded-lg bg-white p-3 shadow-xl md:hidden">
                        {links.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                className="block rounded-lg px-4 py-3 text-sm font-bold text-text-secondary"
                            >
                                {l.label}
                            </a>
                        ))}
                    </div>
                )}
            </nav>
        </header>
    );
}
