// Array com os itens do menu conforme a imagem
const categorias = [
    { label: "Pedreiro", href: "/pedreiro" },
    { label: "Faxineira", href: "/faxineira" },
    { label: "Pedreiro", href: "/pedreiro-2" },
    { label: "Pedreiro", href: "/pedreiro-3" },
    { label: "Pedreiro", href: "/pedreiro-4" },
];

export function MenuPrestador() {
    return (
        <div className="pt-24">
            <nav className="flex w-full max-w-[1000px] items-center justify-between rounded-xl bg-linear-to-r from-blue-depth via-[#27737C] to-green-sprout px-10 py-5 shadow-sm">

                {/* Lista de Links */}
                <div className="flex flex-1 items-center justify-between pr-10">
                    {categorias.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            className="text-base font-bold text-white transition-opacity hover:opacity-80"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Botão de Seta na direita */}
                <button
                    aria-label="Ver mais"
                    className="flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] border-white text-white transition-transform hover:scale-110 cursor-pointer"
                >
                    {/* SVG de uma seta (chevron) fina */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </button>
            </nav>
        </div>
    );
}