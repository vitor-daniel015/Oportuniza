import { CheckCircle, Search, Zap } from "lucide-react";

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
          <h2 className="mb-4 text-3xl font-bold text-text-title md:text-4xl" id="ComoFunciona">
            Como Funciona
          </h2>
          <p className="text-lg font-semibold text-text-title">
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
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-green-herbal bg-white text-green-herbal shadow-xl">
                  <Icon size={32} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-text-title">
                  <span className="mr-2 text-green-sprout">
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
