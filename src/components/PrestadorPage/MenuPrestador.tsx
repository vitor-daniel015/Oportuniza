import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { getCategories, Category } from "../../service/CategoriesService";

interface MenuPrestadorProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export function MenuPrestador({ selectedCategory, setSelectedCategory }: MenuPrestadorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  // Busca os dados do Supabase ao montar o componente
  useEffect(() => {
    async function carregar() {
      try {
        const dados = await getCategories();
        setCategories(dados);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
      } 
    }

    carregar();
  }, []);

  const maxIndex = categories.length - 5;
  const goPrev = startIndex > 0;
  const goNext = startIndex < maxIndex;
  
  const handlePrev = () => {
      if (goPrev) {
          setStartIndex((prev) => prev - 1);
        }
    };
    
    const handleNext = () => {
        if (goNext) {
            setStartIndex((prev) => prev + 1);
        }
    };
    
    const visibleCategories = categories.slice(startIndex, startIndex + 5);

  return (
    <div className="pt-18 align-items-center flex justify-center w-full h-60 p-5">
      <nav className="flex w-full items-center justify-between rounded-xl bg-linear-to-r from-blue-depth via-[#27737C] to-green-sprout px-10">

        {/* Botão Esquerda */}
        <button
          type="button"
          aria-label="Anterior"
          disabled={!goPrev}
          className={`flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-white text-white transition-all duration-200 ${
            !goPrev ? "opacity-30 cursor-not-allowed" : "hover:scale-110 cursor-pointer"}`}
          onClick={handlePrev}
        >
          <ChevronLeft />
        </button>

        {/* Lista de Links */}
        <div className="flex flex-1 items-center justify-between px-10">
          {visibleCategories.map((categoria) => (
              <button
                key={categoria.id}
                type="button"
                onClick={() => setSelectedCategory(categoria.nome)}
                className={"text-2xl font-bold text-white hover:opacity-80 transition-all duration-200"}>
                {categoria.nome}
              </button>
            ))
        }
        </div>

        {/* Botão Direita */}
        <button
          type="button"
          aria-label="Próximo"
          disabled={!goNext}
          className={`flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-white text-white transition-all duration-200 ${
            !goNext ? "opacity-30 cursor-not-allowed" : "hover:scale-110 cursor-pointer"}`}
          onClick={handleNext}>
          <ChevronRight />
        </button>

      </nav>
    </div>
  );
}