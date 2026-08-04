import { CheckCircle, Search, Zap } from "lucide-react";

const trustCards = [
  {
    title: "Painel de Avaliações",
    description: "com perfis, estrelas e comentários verificados.",
  },
  {
    title: "Mapa de Geolocalização",
    description: "com pinos da Oportuniza mostrando profissionais próximos.",
  },
  {
    title: "Contatar via WhatsApp",
    description: "Uma conversa limpa e segura entre Cliente e Profissional.",
  },
];

export function Features() {
  return (
    <section
      id="servicos"
      className="relative overflow-hidden bg-brand-blue-depth px-7 py-16 [clip-path:polygon(0_0,100%_8%,100%_92%,0_100%)] sm:px-10 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-5 text-left text-[23px] font-extrabold leading-[0.95] text-brand-green-herbal sm:mb-8 sm:text-4xl lg:text-5xl">
          Segurança e Confiança
          <br />
          Integradas
        </h2>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-5">
          <article className="flex min-h-45 flex-col items-center justify-center rounded-[5px] bg-[#173B54] px-3 py-5 text-center sm:min-h-90 sm:rounded-xl sm:p-8">
            <h3 className="text-[15px] font-extrabold leading-tight text-brand-green-herbal sm:text-3xl">
              Painel de
              <br />
              Avaliações
            </h3>
            <p className="mt-3 text-[5px] leading-tight text-brand-green-sprout sm:mt-5 sm:text-xs">
              {trustCards[0].description}
            </p>
          </article>

          <div className="grid gap-2.5 sm:gap-5">
            {trustCards.slice(1).map((card) => (
              <article
                key={card.title}
                className="flex min-h-21 flex-col items-center justify-center rounded-[5px] bg-[#173B54] px-2 py-3 text-center sm:min-h-42 sm:rounded-xl sm:p-6"
              >
                <h3 className="text-[13px] font-extrabold leading-tight text-brand-green-herbal sm:text-2xl">
                  {card.title}
                </h3>
                <p className="mt-2 max-w-30 text-[5px] leading-tight text-brand-green-sprout sm:mt-4 sm:max-w-xs sm:text-xs">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    id: 1,
    title: "Encontre Profissionais",
    description: "Pesquise por serviço e localize profissionais próximos a você.",
    icon: Search,
  },
  {
    id: 2,
    title: "Matching Inteligente",
    description:
      "Nosso algoritmo recomenda os melhores perfis com base na localização e reputação.",
    icon: Zap,
  },
  {
    id: 3,
    title: "Avaliação Bilateral",
    description:
      "Após a conclusão, ambos avaliam, garantindo transparência e segurança.",
    icon: CheckCircle,
  },
];

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-text-title md:text-4xl">
            Como Funciona
          </h2>
          <p className="text-lg font-semibold text-brand-blue-depth">
            Conexão Simplificada em 3 Passos
          </p>
        </header>

        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.id}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-brand-green-herbal bg-white text-brand-green-herbal shadow-xl">
                  <Icon size={32} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-text-title">
                  <span className="mr-2 text-brand-green-sprout">
                    {step.id} -
                  </span>
                  {step.title}
                </h3>
                <p className="max-w-xs text-sm leading-relaxed text-text-secondary">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
