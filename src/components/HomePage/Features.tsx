const trustCards = [
  {
    title: "Painel de Avaliações",
    description: "com perfis, estrelas e comentários verificados.",
  },
  {
    title: "Contatar via WhatsApp",
    description: "Uma conversa limpa e segura entre Cliente e Profissional.",
  },
  {
    title: "Mapa de Geolocalização",
    description: "com pinos da Oportuniza mostrando profissionais próximos.",
  },
];

export function Features() {
  return (
    <section
      id="servicos"
      className="relative overflow-hidden bg-blue-depth px-7 py-16 [clip-path:polygon(0_0,100%_8%,100%_92%,0_100%)] sm:px-10 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-5 text-left text-[23px] font-extrabold leading-[0.95] text-green-herbal sm:mb-8 sm:text-4xl lg:text-5xl">
          Segurança e Confiança
          <br />
          Integradas
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          <article className="col-span-2 flex min-h-44 flex-col items-center justify-center rounded-lg bg-[#173B54] px-4 py-6 text-center sm:min-h-64 sm:rounded-xl sm:p-8 lg:col-span-1 lg:row-span-2 lg:min-h-90">
            <h3 className="text-lg font-extrabold leading-tight text-green-herbal sm:text-3xl">
              Painel de
              <br />
              Avaliações
            </h3>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-green-sprout sm:mt-5 sm:text-sm">
              {trustCards[0].description}
            </p>
          </article>

          <div className="col-span-2 grid grid-cols-2 gap-3 sm:gap-5 lg:col-span-1 lg:grid-cols-1">
            {trustCards.slice(1).map((card) => (
              <article
                key={card.title}
                className="flex min-h-28 flex-col items-center justify-center rounded-lg bg-[#173B54] px-2 py-4 text-center sm:min-h-42 sm:rounded-xl sm:p-6"
              >
                <h3 className="text-xs font-extrabold leading-tight text-green-herbal min-[380px]:text-sm sm:text-2xl">
                  {card.title}
                </h3>
                <p className="mt-2 max-w-36 text-[10px] leading-relaxed text-green-sprout sm:mt-4 sm:max-w-xs sm:text-xs">
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
