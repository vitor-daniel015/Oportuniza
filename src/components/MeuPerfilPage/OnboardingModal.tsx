import { Save } from "lucide-react";
import type { FormEvent } from "react";
import type { SaveProfileInput } from "../../service/MeuPerfilService";
import { InputField } from "../InputField";
import type { ProfileFormSetter } from "./ProfileForm";

export function OnboardingModal({
  form,
  setForm,
  saving,
  error,
  onSubmit,
}: {
  form: SaveProfileInput;
  setForm: ProfileFormSetter;
  saving: boolean;
  error: string;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center overflow-y-auto bg-[#10253b]/70 p-3 backdrop-blur-sm sm:p-6">
      <form
        onSubmit={onSubmit}
        className="my-auto max-h-[calc(100dvh-1.5rem)] w-full min-w-0 max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:rounded-3xl sm:p-10"
      >
        <h2 className="text-xl font-medium leading-tight text-blue-depth sm:text-3xl">
          Para terminar seu cadastro precisamos apenas de algumas informações
        </h2>
        <h3 className="mt-3 text-lg font-extrabold text-green-sprout sm:mt-4 sm:text-2xl">
          Informações pessoais
        </h3>
        <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
          <InputField
            id="onboarding-cpf"
            type="text"
            label="CPF"
            placeholder="000.000.000-00"
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: e.target.value })}
            required
          />
          <InputField
            id="onboarding-whatsapp"
            type="tel"
            label="WhatsApp"
            placeholder="(15) 99999-9999"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            required
          />
          <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4">
            <InputField
              id="onboarding-city"
              type="text"
              label="Cidade"
              placeholder="Sua cidade"
              value={form.cidade}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
              required
            />
            <InputField
              id="onboarding-neighborhood"
              type="text"
              label="Bairro"
              placeholder="Seu bairro"
              value={form.bairro}
              onChange={(e) => setForm({ ...form, bairro: e.target.value })}
              required
            />
          </div>
          <InputField
            id="onboarding-state"
            type="text"
            label="Estado"
            placeholder="SP"
            value={form.estado}
            maxLength={2}
            onChange={(e) =>
              setForm({ ...form, estado: e.target.value.toUpperCase() })
            }
            required
          />
        </div>
        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <button
          disabled={saving}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-depth to-green-sprout px-4 py-3 font-bold text-white sm:mt-7 sm:px-6"
        >
          <Save size={19} /> {saving ? "Salvando..." : "Terminar cadastro"}
        </button>
      </form>
    </div>
  );
}
