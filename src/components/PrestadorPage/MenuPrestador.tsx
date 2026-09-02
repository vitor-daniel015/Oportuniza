import { ChevronRight, ChevronLeft } from "lucide-react";
import React from "react";
import { categorias } from "../../lib/data";

interface MenuPrestadorProps {
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
}

export function MenuPrestador({ selectedCategory, setSelectedCategory }: MenuPrestadorProps) {
    const [startIndex, setStartIndex] = React.useState(0);

    const maxIndex = categorias.length - 5;

    const GoPrev = startIndex > 0;
    const GoNext = startIndex < maxIndex;

    const visibleCategories = categorias.slice(startIndex, startIndex + 5);

    const handlePrev = () => {
        if (GoPrev) {
            setStartIndex((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (GoNext) {
            setStartIndex((prev) => prev + 1);
        }
    };

    return (
        <div className="pt-18 align-items-center flex justify-center w-full h-60 p-5">
            <nav className="flex w-full items-center justify-between rounded-xl bg-linear-to-r from-blue-depth via-[#27737C] to-green-sprout px-10">

                {/* Botão de Seta na esquerda */}
                <button
                    aria-label="Ver mais"
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-white text-white transition-all duration-200`}
                    onClick={handlePrev}
                >
                    <ChevronLeft />
                </button>

                {/* Lista de Links */}
                <div className="flex flex-1 items-center justify-between px-10">
                    {visibleCategories.map((categoria, index) => (
                        <a
                            key={index}
                            onClick={() => setSelectedCategory(categoria.label)}
                            className="text-2xl font-bold text-white hover:opacity-80 transition-all duration-200"
                        >
                            {categoria.label}
                        </a>
                    ))}
                </div>

                {/* Botão de Seta na direita */}
                <button
                    aria-label="Ver mais"
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-white text-white transition-all duration-200`}
                    onClick={handleNext}
                >   
                    <ChevronRight />
                </button>

            </nav>
        </div>
    );
}