import { Star, X } from "lucide-react";
import type { FormEvent } from "react";

interface ReviewModalProps {
  open: boolean;
  professionalName: string;
  rating: number;
  comment: string;
  error: string;
  saving: boolean;
  onClose: () => void;
  onRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onSubmit: (event: FormEvent) => void;
}

export function ReviewModal(props: ReviewModalProps) {
  if (!props.open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center overflow-y-auto bg-[#10253b]/65 p-3 backdrop-blur-sm sm:p-6">
      <form
        onSubmit={props.onSubmit}
        className="relative my-auto max-h-[calc(100dvh-1.5rem)] w-full min-w-0 max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-9"
      >
        <button
          type="button"
          onClick={props.onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 rounded-full p-2 hover:bg-gray-100 sm:right-5 sm:top-5"
        >
          <X size={22} />
        </button>
        <h2 className="max-w-[calc(100%-2.5rem)] text-2xl font-extrabold leading-tight text-text-title">
          Avaliar {props.professionalName}
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Conte como foi sua experiência com esse profissional.
        </p>
        <div
          className="mt-5 flex justify-center gap-1 sm:mt-6 sm:justify-start sm:gap-2"
          role="radiogroup"
          aria-label="Nota"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={props.rating === value}
              aria-label={`${value} estrelas`}
              onClick={() => props.onRatingChange(value)}
              className="p-1"
            >
              <Star
                size={32}
                className={
                  value <= props.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-400"
                }
              />
            </button>
          ))}
        </div>
        <label className="mt-5 block min-w-0">
          <span className="mb-2 ml-3 block text-sm font-medium text-text-secondary">
            Comentário
          </span>
          <textarea
            value={props.comment}
            onChange={(event) => props.onCommentChange(event.target.value)}
            maxLength={1000}
            rows={5}
            required
            placeholder="Descreva o atendimento e o serviço realizado"
            className="w-full min-w-0 resize-none rounded-3xl bg-[#dadada] px-5 py-4 outline-none focus:ring-2 focus:ring-blue-depth"
          />
        </label>
        {props.error && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {props.error}
          </p>
        )}
        <button
          disabled={props.saving || props.rating === 0}
          className="mt-6 w-full rounded-lg bg-linear-to-r from-blue-depth to-green-sprout px-4 py-3 font-bold text-white disabled:opacity-60"
        >
          {props.saving ? "Enviando..." : "Publicar avaliação"}
        </button>
      </form>
    </div>
  );
}
