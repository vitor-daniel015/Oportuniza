import { X } from "lucide-react";
import { useEffect } from "react";

export type LightboxImage = {
  imagem_url: string;
  titulo: string;
  descricao?: string | null;
};

export function PortfolioLightbox({
  image,
  onClose,
}: {
  image: LightboxImage | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!image) return;

    function closeWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", closeWithEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeWithEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-[#07111d]/95 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-image-title"
      onMouseDown={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full bg-white px-4 py-2 font-bold text-blue-depth shadow-lg sm:right-7 sm:top-7"
        aria-label="Fechar imagem ampliada"
      >
        <X size={22} /> <span className="hidden sm:inline">Fechar</span>
      </button>

      <figure
        className="flex max-h-[calc(100dvh-1.5rem)] max-w-[min(96vw,1200px)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-3rem)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex min-h-0 flex-1 items-center justify-center bg-black">
          <img
            src={image.imagem_url}
            alt={image.titulo}
            className="max-h-[78dvh] max-w-full object-contain"
          />
        </div>
        <figcaption className="shrink-0 px-5 py-4 sm:px-7">
          <h2 id="portfolio-image-title" className="text-lg font-extrabold text-text-title sm:text-xl">
            {image.titulo}
          </h2>
          {image.descricao && (
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-text-secondary">
              {image.descricao}
            </p>
          )}
        </figcaption>
      </figure>
    </div>
  );
}
