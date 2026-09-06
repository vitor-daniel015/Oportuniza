import { Save } from "lucide-react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { Category } from "../../service/CategoriesService";
import type { SaveProfileInput } from "../../service/MeuPerfilService";
import { InputField } from "../InputField";

export type ProfileFormSetter = Dispatch<SetStateAction<SaveProfileInput>>;

export function ProfileForm({
  form,
  setForm,
  categories,
  isProvider,
  saving,
  onSubmit,
}: {
  form: SaveProfileInput;
  setForm: ProfileFormSetter;
  categories: Category[];
  isProvider: boolean;
  saving: boolean;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="grid min-w-0 gap-4 sm:grid-cols-2">
      <InputField
        id="edit-name"
        type="text"
        label="Nome"
        placeholder="Seu nome"
        value={form.nome}
        onChange={(e) => setForm({ ...form, nome: e.target.value })}
        required
      />
      <InputField
        id="edit-whatsapp"
        type="tel"
        label="WhatsApp"
        placeholder="(15) 99999-9999"
        value={form.whatsapp}
        onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
        required
      />
      <InputField
        id="edit-city"
        type="text"
        label="Cidade"
        placeholder="Sua cidade"
        value={form.cidade}
        onChange={(e) => setForm({ ...form, cidade: e.target.value })}
        required
      />
      <InputField
        id="edit-neighborhood"
        type="text"
        label="Bairro"
        placeholder="Seu bairro"
        value={form.bairro}
        onChange={(e) => setForm({ ...form, bairro: e.target.value })}
        required
      />
      <InputField
        id="edit-state"
        type="text"
        label="Estado"
        placeholder="SP"
        maxLength={2}
        value={form.estado}
        onChange={(e) =>
          setForm({ ...form, estado: e.target.value.toUpperCase() })
        }
        required
      />
      {isProvider && (
        <label className="flex min-w-0 flex-col">
          <span className="mb-1 ml-4 text-xs text-gray-600">Categoria</span>
          <select
            value={form.categoriaId}
            onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
            className="min-w-0 rounded-full bg-[#dadada] px-5 py-3"
            required
          >
            <option value="">Selecione</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="min-w-0 sm:col-span-2">
        <span className="mb-1 ml-4 block text-xs text-gray-600">Sobre mim</span>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={5}
          className="w-full min-w-0 resize-none rounded-3xl bg-[#dadada] px-5 py-4"
          required={isProvider}
        />
      </label>
      <button
        disabled={saving}
        className="flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-depth to-green-sprout px-4 py-3 font-bold text-white sm:col-span-2 sm:px-6"
      >
        <Save size={18} /> {saving ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
