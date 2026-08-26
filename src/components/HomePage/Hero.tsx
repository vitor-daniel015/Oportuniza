import { BadgeCheck, ChartNoAxesCombined } from "lucide-react";
import { ButtonOportuniza } from "../Button";

export function Hero() {
  return (
    <section id="inicio" className="mx-auto max-w-280 px-6 pb-16 pt-24 sm:px-10 lg:pb-24 lg:pt-28">
      <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_.7fr]">
        <div>
          <h1 className="max-w-172.5 text-[42px] font-extrabold leading-[.98] tracking-[-.045em] text-text-title sm:text-[56px] lg:text-[62px]">
            Transforme Sua
            <br />
            Carreira com
            <br />
            Oportunidades Reais
          </h1>
          <p className="mt-5 mb-7 max-w-162.5 text-sm leading-[1.35] text-text-secondary">
            Conectando profissionais autônomos operacionais e domésticos a
            clientes de forma rápida, segura e confiável. Reduza a informalidade
            e alcance novos patamares profissionais.
          </p>
          <ButtonOportuniza
            title="Saiba Mais"
            link="#ComoFunciona"
            color="#9ace5f"
            colorHover="#4da25a">
          </ButtonOportuniza>
        </div>
        <div className="mx-auto h-77.5 w-77.5 overflow-hidden sm:h-92.5 sm:w-92.5">
          <img
            src="/assets/oportuniza.png"
            alt="Símbolo Oportuniza"
            className="h-auto w-full object-top"
          />
        </div>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="min-h-65 rounded-[7px] bg-white p-7 shadow-[0_12px_30px_rgba(24,70,113,.16)]">
          <div className="flex items-start gap-4">
            <BadgeCheck
              className="mt-1 shrink-0 text-green-sprout"
              size={48}
            />
            <h2 className="text-2xl font-extrabold leading-tight text-text-title">
              Encontre
              <br />
              Oportunidades
            </h2>
          </div>
          <p className="mt-5 max-w-[320px] text-sm leading-snug text-text-secondary">
            Acesse demandas essenciais e use nosso matching inteligente para
            recomendações com base na localização e reputação.
          </p>
        </div>
        <div className="min-h-65 rounded-[7px] bg-white p-7 shadow-[0_12px_30px_rgba(24,70,113,.16)]">
          <div className="flex items-start gap-4">
            <ChartNoAxesCombined
              className="mt-1 shrink-0 text-green-sprout"
              size={48}
            />
            <h2 className="text-2xl font-extrabold leading-tight text-text-title">
              Cresça
              <br />
              Profissionalmente
            </h2>
          </div>
          <p className="mt-5 max-w-82.5 text-sm leading-snug text-text-secondary">
            Aumente sua visibilidade, construa uma reputação verificada e
            impulsione seu sucesso financeiro.
          </p>
        </div>
      </div>
    </section>
  );
}
