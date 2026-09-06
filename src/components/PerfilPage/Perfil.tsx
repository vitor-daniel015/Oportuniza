import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, MessageCircle, Quote } from "lucide-react";
import { getPerfilPublico } from "../../service/PerfilPublicoService";
import { Stars } from "../PrestadorPage/Stars";

export function Perfil() {
  const { id } = useParams<{ id: string }>();
  const [dados, setDados] = useState<Awaited<
    ReturnType<typeof getPerfilPublico>
  >>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarPerfil() {
      if (!id) {
        setErro("Prestador inválido.");
        setLoading(false);
        return;
      }

      try {
        const resultado = await getPerfilPublico(id);

        if (!resultado) {
          setErro("Prestador não encontrado.");
          return;
        }

        setDados(resultado);
      } catch {
        setErro("Não foi possível carregar o prestador.");
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, [id]);

  if (loading) {
    return (
      <main className="grid min-h-[60vh] place-items-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-depth/20 border-t-blue-depth" />
          <p className="mt-4 font-medium text-text-secondary">Carregando perfil...</p>
        </div>
      </main>
    );
  }

  if (erro || !dados) {
    return (
      <main className="grid min-h-[60vh] place-items-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-text-title">Perfil indisponível</h1>
          <p className="mt-2 text-text-secondary">{erro || "Prestador não encontrado."}</p>
          <Link to="/prestadores" className="mt-6 inline-block rounded-lg bg-blue-depth px-6 py-3 font-bold text-white">
            Voltar aos prestadores
          </Link>
        </div>
      </main>
    );
  }

  const especialidades = [...new Set(dados.servicos.map((servico) => servico.specialty))];
  const descricao = dados.servicos
    .map((servico) => servico.description)
    .filter(Boolean)
    .join(" ");
  const endereco = [dados.perfil.bairro, dados.perfil.cidade, dados.perfil.estado]
    .filter(Boolean)
    .join(", ");
  const quantidadeAvaliacoes = dados.reviews.length;

  function formatarData(data: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(data));
  }

  return (
    <main className="pb-8">
      <section className="relative mt-12 bg-linear-to-r from-blue-depth via-[#27737c] to-green-sprout text-white md:mt-14">
        <div className="mx-auto flex min-h-56 max-w-7xl items-end px-6 pb-8 pt-24 sm:px-10 md:min-h-64 md:items-center md:pb-0 md:pl-80 md:pt-0 lg:pl-96">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">{dados.perfil.nome}</h1>
            <p className="mt-1 text-xl font-medium sm:text-3xl">{especialidades.join(" • ")}</p>
          </div>
        </div>
        <img
          src={dados.perfil.avatar_url || "/assets/oportuniza.png"}
          alt={dados.perfil.nome}
          className="absolute left-6 top-0 h-36 w-36 -translate-y-8 rounded-full border-4 border-white object-cover shadow-xl sm:left-10 md:left-[7%] md:top-1/2 md:h-60 md:w-60 md:-translate-y-1/2 lg:h-68 lg:w-68"
        />
      </section>

      <div className="mx-auto max-w-7xl px-6 pt-12 sm:px-10 md:pt-16">
        <section className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-7">
            <div>
              <h2 className="text-2xl font-extrabold text-text-title md:text-3xl">Avaliação</h2>
              <div className="mt-2 flex w-fit flex-wrap items-center gap-3 rounded-full border border-gray-300 bg-white px-4 py-2 shadow-md">
                <Stars value={dados.perfil.rating ?? 0} size={25} color="#141414" borderColor="#141414" />
                <strong className="text-sm md:text-base">
                  {quantidadeAvaliacoes} {quantidadeAvaliacoes === 1 ? "avaliação" : "avaliações"}
                </strong>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-text-title md:text-3xl">Endereço</h2>
              <div className="mt-2 flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-3 font-semibold shadow-md">
                <MapPin className="shrink-0 text-green-sprout" size={20} />
                <span>{endereco || "Localização não informada"}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-text-title md:text-3xl">Sobre mim</h2>
            <div className="mt-2 min-h-36 rounded-3xl border border-gray-300 bg-white p-5 text-sm leading-relaxed text-text-body shadow-md md:text-base">
              {descricao || "Este profissional ainda não adicionou uma descrição."}
            </div>
          </div>
        </section>

        <button
          type="button"
          disabled
          title="O contato público ainda não foi disponibilizado"
          className="mt-9 flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-lg bg-green-sprout px-6 py-4 text-xl font-extrabold text-white opacity-70 md:text-3xl"
        >
          <MessageCircle size={32} />
          Enviar mensagem
        </button>

        <section className="mt-12">
          <h2 className="text-2xl font-extrabold text-text-title md:text-3xl">Portfólio de trabalhos</h2>
          {dados.portfolio.length ? (
            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {dados.portfolio.map((item) => (
                <figure key={item.id} className="group overflow-hidden rounded-xl bg-white shadow-sm">
                  <img src={item.imagem_url} alt={item.titulo} className="h-72 w-full object-cover transition duration-300 group-hover:scale-105 md:h-80" />
                  <figcaption className="p-4">
                    <h3 className="font-bold text-text-title">{item.titulo}</h3>
                    {item.descricao && <p className="mt-1 text-sm text-text-secondary">{item.descricao}</p>}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-2xl bg-white p-6 text-text-secondary shadow-sm">Nenhum trabalho publicado ainda.</p>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-extrabold text-text-title md:text-3xl">Depoimentos dos clientes</h2>
          {dados.reviews.length ? (
            <div className="mt-7 space-y-5">
              {dados.reviews.map((review) => {
                const resposta = Array.isArray(review.review_replies)
                  ? review.review_replies[0]
                  : review.review_replies;

                return (
                  <div key={review.id} className="space-y-3">
                    <article className="rounded-3xl border border-gray-300 bg-white p-6 shadow-md">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-text-title">Cliente Oportuniza</p>
                          <Stars value={review.nota} size={18} />
                        </div>
                        <time className="text-xs text-text-secondary">{formatarData(review.created_at)}</time>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-text-title md:text-base">“{review.comentario || "Serviço avaliado sem comentário."}”</p>
                    </article>

                    {resposta && (
                      <div className="ml-6 flex gap-3 md:ml-16">
                        <Quote className="mt-4 shrink-0 text-green-sprout" size={30} />
                        <article className="flex-1 rounded-3xl border border-green-sprout/30 bg-green-sprout/15 p-5 shadow-md">
                          <p className="font-bold text-text-title">{dados.perfil.nome}</p>
                          <p className="mt-2 text-sm text-text-title md:text-base">“{resposta.resposta_texto}”</p>
                          <time className="mt-3 block text-right text-xs text-text-secondary">{formatarData(resposta.created_at)}</time>
                        </article>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-5 rounded-2xl bg-white p-6 text-text-secondary shadow-sm">Este profissional ainda não recebeu avaliações.</p>
          )}
        </section>
      </div>
    </main>
  );
}
