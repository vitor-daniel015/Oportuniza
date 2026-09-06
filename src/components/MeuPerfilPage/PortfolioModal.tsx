import { ImagePlus } from "lucide-react";
import type { FormEvent } from "react";
import { InputField } from "../InputField";
import { ProfileModal } from "./ProfileModal";

interface PortfolioModalProps {
  open: boolean;
  title: string;
  description: string;
  file: File | null;
  saving: boolean;
  onClose: () => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: (event: FormEvent) => void;
}

export function PortfolioModal(props: PortfolioModalProps) {
  if (!props.open) return null;

  return (
    <ProfileModal title="Adicionar trabalho" onClose={props.onClose}>
      <form onSubmit={props.onSubmit} className="min-w-0 space-y-4">
        <InputField
          id="portfolio-title"
          type="text"
          label="Título"
          placeholder="Ex.: Reforma de cozinha"
          value={props.title}
          onChange={(event) => props.onTitleChange(event.target.value)}
          required
        />

        <div className="min-w-0">
          <span className="mb-1 ml-4 block text-xs font-medium text-gray-600">
            Foto do trabalho
          </span>
          <label className="flex min-w-0 cursor-pointer items-center gap-3 rounded-full bg-[#dadada] px-4 py-3 transition focus-within:ring-2 focus-within:ring-blue-depth">
            <ImagePlus className="shrink-0 text-blue-depth" size={21} />
            <span className="min-w-0 flex-1 truncate text-sm sm:text-base">
              {props.file?.name || "Escolher uma imagem"}
            </span>
            <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-depth">
              Procurar
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={(event) =>
                props.onFileChange(event.target.files?.[0] ?? null)
              }
              required
            />
          </label>
          <p className="mt-1 pl-4 text-xs text-text-secondary">
            JPG, PNG, WEBP ou GIF de até 5 MB.
          </p>
        </div>

        <label className="block min-w-0">
          <span className="mb-1 ml-4 block text-xs text-gray-600">
            Descrição
          </span>
          <textarea
            value={props.description}
            onChange={(event) => props.onDescriptionChange(event.target.value)}
            rows={4}
            className="w-full min-w-0 resize-none rounded-3xl bg-[#dadada] px-5 py-4 outline-none focus:ring-2 focus:ring-blue-depth"
          />
        </label>
        <button
          disabled={props.saving}
          className="w-full whitespace-normal rounded-lg bg-linear-to-r from-blue-depth to-green-sprout px-4 py-3 text-sm font-bold text-white disabled:opacity-60 sm:px-6 sm:text-base"
        >
          {props.saving ? "Enviando..." : "Adicionar ao portfólio"}
        </button>
      </form>
    </ProfileModal>
  );
}
