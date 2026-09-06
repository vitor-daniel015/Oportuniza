import { ArrowLeft, ArrowRight, BriefcaseBusiness, Camera, CheckCircle2, MapPin, Rocket, Save, UserRound, } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { Category } from "../../service/CategoriesService";
import type { SaveProfileInput } from "../../service/MeuPerfilService";
import { InputField } from "../InputField";
import { AvatarCropInput } from "./AvatarCropInput";
import type { ProfileFormSetter } from "./ProfileForm";

const steps = [
  { title: "Boas-vindas", icon: Rocket },
  { title: "Seus dados", icon: UserRound },
  { title: "Onde atende", icon: MapPin },
  { title: "Seu trabalho", icon: BriefcaseBusiness },
  { title: "Sua foto", icon: Camera },
];

export function OnboardingModal({
  form,
  setForm,
  categories,
  saving,
  error,
  onUploadAvatar,
  onSubmit,
}: {
  form: SaveProfileInput;
  setForm: ProfileFormSetter;
  categories: Category[];
  saving: boolean;
  error: string;
  onUploadAvatar: (file: File) => Promise<string>;
  onSubmit: (event: FormEvent) => void;
}) {
  const [step, setStep] = useState(0);
  const [stepError, setStepError] = useState("");
  const [uploading, setUploading] = useState(false);
  const CurrentIcon = steps[step].icon;

  function validateCurrentStep() {
    if (step === 1) {
      if (form.cpf.replace(/\D/g, "").length !== 11)
        return "Digite um CPF com 11 números.";
      const phoneLength = form.whatsapp.replace(/\D/g, "").length;
      if (phoneLength < 10 || phoneLength > 13)
        return "Digite um WhatsApp válido, incluindo o DDD.";
    }
    if (step === 2) {
      if (!form.cidade.trim() || !form.bairro.trim())
        return "Informe sua cidade e seu bairro.";
      if (!/^[A-Z]{2}$/.test(form.estado.trim().toUpperCase()))
        return "Digite a sigla do estado com duas letras, por exemplo: SP.";
    }
    if (step === 3) {
      if (!form.categoriaId) return "Escolha o tipo de serviço que você oferece.";
      if (!form.bio.trim())
        return "Conte um pouco sobre seu trabalho e sua experiência.";
    }
    if (step === 4 && !form.avatarUrl)
      return "Adicione uma foto para que os clientes reconheçam você.";
    return "";
  }

  function nextStep() {
    const validationMessage = validateCurrentStep();
    if (validationMessage) return setStepError(validationMessage);
    setStepError("");
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  async function selectAvatar(file?: File) {
    if (!file) return;
    setUploading(true);
    setStepError("");
    try {
      const avatarUrl = await onUploadAvatar(file);
      setForm((current) => ({ ...current, avatarUrl }));
    } catch (cause) {
      setStepError(cause instanceof Error ? cause.message : "Não foi possível enviar sua foto.");
    } finally {
      setUploading(false);
    }
  }

  function submit(event: FormEvent) {
    const validationMessage = validateCurrentStep();
    if (validationMessage) {
      event.preventDefault();
      setStepError(validationMessage);
      return;
    }
    onSubmit(event);
  }

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center overflow-y-auto bg-[#10253b]/75 p-3 backdrop-blur-sm sm:p-6">
      <form
        onSubmit={submit}
        className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl sm:max-h-[calc(100dvh-3rem)]"
      >
        <div className="bg-linear-to-r from-blue-depth via-[#27737c] to-green-sprout px-5 py-5 text-white sm:px-9">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                Passo {step + 1} de {steps.length}
              </p>
              <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
                Vamos preparar seu perfil
              </h2>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/15">
              <CurrentIcon size={25} />
            </span>
          </div>
          <div className="mt-4 flex gap-2" aria-label="Progresso do cadastro">
            {steps.map((item, index) => (
              <span
                key={item.title}
                className={`h-2 flex-1 rounded-full ${index <= step ? "bg-white" : "bg-white/30"}`}
                title={item.title}
              />
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-9">
          {step === 0 && <WelcomeStep name={form.nome} />}
          {step === 1 && (
            <section>
              <StepHeading title="Primeiro, seus dados pessoais" description="Esses dados ajudam a manter sua conta segura. Seu CPF não será mostrado no perfil público." />
              <div className="mt-6 space-y-4">
                <InputField id="onboarding-cpf" type="text" inputMode="numeric" label="CPF" placeholder="000.000.000-00" value={form.cpf} onChange={(event) => setForm({ ...form, cpf: event.target.value })} />
                <InputField id="onboarding-whatsapp" type="tel" label="WhatsApp com DDD" placeholder="(15) 99999-9999" value={form.whatsapp} onChange={(event) => setForm({ ...form, whatsapp: event.target.value })} />
                <p className="rounded-xl bg-blue-50 p-3 text-xs leading-relaxed text-blue-depth">
                  O WhatsApp aparecerá como botão de contato para os clientes falarem diretamente com você.
                </p>
              </div>
            </section>
          )}
          {step === 2 && (
            <section>
              <StepHeading title="Onde você trabalha?" description="Informe a região em que você atende. Isso ajuda os clientes a encontrar profissionais próximos." />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InputField id="onboarding-city" type="text" label="Cidade" placeholder="Ex.: Capela do Alto" value={form.cidade} onChange={(event) => setForm({ ...form, cidade: event.target.value })} />
                <InputField id="onboarding-neighborhood" type="text" label="Bairro" placeholder="Ex.: Centro" value={form.bairro} onChange={(event) => setForm({ ...form, bairro: event.target.value })} />
                <div className="sm:col-span-2">
                  <InputField id="onboarding-state" type="text" label="Estado" placeholder="Ex.: SP" value={form.estado} maxLength={2} onChange={(event) => setForm({ ...form, estado: event.target.value.toUpperCase() })} />
                </div>
              </div>
            </section>
          )}
          {step === 3 && (
            <section>
              <StepHeading title="Conte sobre o seu trabalho" description="Escolha sua principal atividade e explique de forma simples o que você faz." />
              <div className="mt-6 space-y-4">
                <label className="flex flex-col">
                  <span className="mb-1 ml-4 text-xs font-medium text-gray-600">Qual serviço você oferece?</span>
                  <select value={form.categoriaId} onChange={(event) => setForm({ ...form, categoriaId: event.target.value })} className="rounded-full bg-[#dadada] px-5 py-3 outline-none focus:ring-2 focus:ring-blue-depth">
                    <option value="">Escolha uma opção</option>
                    {categories.map((category) => <option key={category.id} value={category.id}>{category.nome}</option>)}
                  </select>
                </label>
                <label>
                  <span className="mb-1 ml-4 block text-xs font-medium text-gray-600">Fale sobre sua experiência</span>
                  <textarea
                    value={form.bio}
                    onChange={(event) => setForm({ ...form, bio: event.target.value })}
                    rows={5}
                    placeholder="Ex.: Trabalho há 8 anos com reformas, pintura e pequenos reparos. Atendo com pontualidade e cuidado."
                    className="w-full resize-none rounded-3xl bg-[#dadada] px-5 py-4 outline-none focus:ring-2 focus:ring-blue-depth"
                  />
                </label>
              </div>
            </section>
          )}
          {step === 4 && (
            <section>
              <StepHeading title="Agora, adicione uma foto" description="Use uma foto nítida do seu rosto. Isso transmite confiança e ajuda os clientes a reconhecer você." />
              <div className="mt-6 flex flex-col items-center">
                <div className="grid h-36 w-36 place-items-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg">
                  {form.avatarUrl ? <img src={form.avatarUrl} alt="Sua foto de perfil" className="h-full w-full object-cover" /> : <UserRound size={62} className="text-blue-depth/40" />}
                </div>
                <AvatarCropInput
                  className="mt-4 cursor-pointer rounded-full border-2 border-blue-depth px-5 py-3 text-sm font-bold text-blue-depth hover:bg-blue-50"
                  disabled={uploading || saving}
                  onCroppedFile={(file) => selectAvatar(file)}
                >
                  <span className="flex items-center gap-2"><Camera size={19} /> {uploading ? "Enviando foto..." : form.avatarUrl ? "Trocar minha foto" : "Escolher minha foto"}</span>
                </AvatarCropInput>
              </div>
              <div className="mt-6 rounded-2xl bg-green-50 p-4 text-green-900">
                <p className="flex items-start gap-2 font-bold"><CheckCircle2 className="mt-0.5 shrink-0 text-green-sprout" size={21} /> Depois de concluir, seu perfil ficará visível para outras pessoas.</p>
                <p className="mt-2 text-sm leading-relaxed">
                  Clientes poderão encontrar seu serviço, conhecer sua experiência, ver seus trabalhos e entrar em contato. Um perfil completo ajuda você a conquistar novas oportunidades e dar mais visibilidade à sua carreira.
                </p>
              </div>
            </section>
          )}

          {(stepError || error) && (
            <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {stepError || error}
            </p>
          )}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {step > 0 ? (
              <button type="button" onClick={() => { setStepError(""); setStep((current) => current - 1); }} className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-bold text-blue-depth">
                <ArrowLeft size={19} /> Voltar
              </button>
            ) : <span />}
            {step < steps.length - 1 ? (
              <button type="button" onClick={nextStep} className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-depth to-green-sprout px-6 py-3 font-bold text-white">
                {step === 0 ? "Começar meu cadastro" : "Continuar"} <ArrowRight size={19} />
              </button>
            ) : (
              <button disabled={saving || uploading} className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-depth to-green-sprout px-6 py-3 font-bold text-white disabled:opacity-60">
                <Save size={19} /> {saving ? "Publicando..." : "Concluir e publicar meu perfil"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

function WelcomeStep({ name }: { name: string }) {
  return (
    <section className="py-2 text-center">
      <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-50 text-green-sprout"><Rocket size={40} /></span>
      <h3 className="mt-5 text-2xl font-extrabold text-text-title">Olá, {name || "profissional"}!</h3>
      <p className="mx-auto mt-3 max-w-lg leading-relaxed text-text-secondary">
        Vamos criar seu perfil profissional passo a passo. É rápido: você informa seus dados, onde trabalha, qual serviço oferece e escolhe uma foto.
      </p>
      <p className="mx-auto mt-4 max-w-lg rounded-2xl bg-blue-50 p-4 text-sm font-semibold leading-relaxed text-blue-depth">
        Quando terminar, pessoas que precisam do seu serviço poderão encontrar você no Oportuniza.
      </p>
    </section>
  );
}

function StepHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-xl font-extrabold text-text-title sm:text-2xl">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
    </div>
  );
}
