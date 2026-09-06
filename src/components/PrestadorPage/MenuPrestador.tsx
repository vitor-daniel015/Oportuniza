import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { getCategories, Category } from "../../service/CategoriesService";

interface MenuPrestadorProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export function MenuPrestador({
  selectedCategory,
  setSelectedCategory,
}: MenuPrestadorProps) {
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
    <div className="w-full px-4 pb-2 pt-8 sm:flex sm:h-60 sm:items-center sm:justify-center sm:p-5 sm:pt-18">
      <div className="sm:hidden">
        <label
          htmlFor="category-filter"
          className="mb-2 block text-sm font-bold text-text-title"
        >
          Filtrar profissionais por categoria
        </label>
        <div className="relative rounded-xl bg-linear-to-r from-blue-depth to-green-sprout p-1 shadow-md">
          <select
            id="category-filter"
            value={selectedCategory ?? ""}
            onChange={(event) =>
              setSelectedCategory(event.target.value || null)
            }
            className="w-full appearance-none rounded-lg bg-white px-4 py-3 pr-10 font-semibold text-text-title outline-none focus:ring-2 focus:ring-green-sprout"
          >
            <option value="">Todas as categorias</option>
            {categories.map((categoria) => (
              <option key={categoria.id} value={categoria.nome}>
                {categoria.nome}
              </option>
            ))}
          </select>
          <ChevronRight
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-green-sprout"
            size={20}
          />
        </div>
        <p className="mt-2 text-xs text-text-secondary">
          Selecione uma opção para aplicar o filtro.
        </p>
      </div>

      <nav className="hidden min-w-0 w-full items-center justify-between rounded-xl bg-linear-to-r from-blue-depth via-[#27737C] to-green-sprout px-10 sm:flex sm:h-full">
        {/* Botão Esquerda */}
        <button
          type="button"
          aria-label="Anterior"
          disabled={!goPrev}
          className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-white text-white transition-all duration-200 sm:flex ${
            !goPrev
              ? "opacity-30 cursor-not-allowed"
              : "hover:scale-110 cursor-pointer"
          }`}
          onClick={handlePrev}
        >
          <ChevronLeft />
        </button>

        {/* Lista de Links */}
        <div className="flex min-w-0 flex-1 items-center gap-7 overflow-x-auto px-2 [scrollbar-width:none] sm:justify-between sm:px-10">
          {visibleCategories.map((categoria) => (
            <button
              key={categoria.id}
              type="button"
              onClick={() => setSelectedCategory(categoria.nome)}
              className={
                "shrink-0 whitespace-nowrap text-base font-bold text-white hover:opacity-80 transition-all duration-200 sm:text-2xl"
              }
            >
              {categoria.nome}
            </button>
          ))}
        </div>

        {/* Botão Direita */}
        <button
          type="button"
          aria-label="Próximo"
          disabled={!goNext}
          className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-white text-white transition-all duration-200 sm:flex ${
            !goNext
              ? "opacity-30 cursor-not-allowed"
              : "hover:scale-110 cursor-pointer"
          }`}
          onClick={handleNext}
        >
          <ChevronRight />
        </button>
      </nav>
    </div>
  );
}
