import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, MessageCircle, Quote } from "lucide-react";
import {
  getPerfilPublico,
  submitProviderReview,
} from "../../service/PerfilPublicoService";
import { Stars } from "../PrestadorPage/Stars";
import { useAuth } from "../../contexts/AuthContext";
import { ReviewModal } from "./ReviewModal";
import { PortfolioLightbox, type LightboxImage } from "../PortfolioLightbox";
import { BackButton } from "../BackButton";

export function Perfil() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [dados, setDados] =
    useState<Awaited<ReturnType<typeof getPerfilPublico>>>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedPortfolio, setSelectedPortfolio] =
    useState<LightboxImage | null>(null);

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
  }, [id, reloadKey]);

  if (loading) {
    return (
      <main className="grid min-h-[60vh] place-items-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-depth/20 border-t-blue-depth" />
          <p className="mt-4 font-medium text-text-secondary">
            Carregando perfil...
          </p>
        </div>
      </main>
    );
  }

  if (erro || !dados) {
    return (
      <main className="grid min-h-[60vh] place-items-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-text-title">
            Perfil indisponível
          </h1>
          <p className="mt-2 text-text-secondary">
            {erro || "Prestador não encontrado."}
          </p>
          <Link
            to="/prestadores"
            className="mt-6 inline-block rounded-lg bg-blue-depth px-6 py-3 font-bold text-white"
          >
            Voltar aos prestadores
          </Link>
        </div>
      </main>
    );
  }

  const especialidades = [
    ...new Set(dados.servicos.map((servico) => servico.specialty)),
  ];
  const descricaoServicos = dados.servicos
    .map((servico) => servico.description)
    .filter(Boolean)
    .join(" ");
  const descricao = dados.perfil.bio || descricaoServicos;
  const whatsapp = dados.perfil.whatsapp?.replace(/\D/g, "");
  const whatsappComPais = whatsapp
    ? whatsapp.startsWith("55")
      ? whatsapp
      : `55${whatsapp}`
    : null;
  const mensagemWhatsapp = encodeURIComponent(
    `Olá, ${dados.perfil.nome}! Encontrei seu perfil no Oportuniza.`,
  );
  const endereco = [
    dados.perfil.bairro,
    dados.perfil.cidade,
    dados.perfil.estado,
  ]
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

  async function handleReview(event: FormEvent) {
    event.preventDefault();
    if (!id || reviewRating === 0) {
      setReviewError("Escolha uma nota de 1 a 5 estrelas.");
      return;
    }

    setReviewSaving(true);
    setReviewError("");
    try {
      const { error } = await submitProviderReview(
        id,
        reviewRating,
        reviewComment,
      );
      if (error) {
        setReviewError(error.message);
        return;
      }
      setReviewOpen(false);
      setReviewRating(0);
      setReviewComment("");
      setReloadKey((current) => current + 1);
    } catch (cause) {
      setReviewError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível validar o comentário.",
      );
    } finally {
      setReviewSaving(false);
    }
  }

  return (
    <main className="pb-8">
      <section className="relative bg-linear-to-r from-blue-depth via-[#27737c] to-green-sprout text-white md:mt-14">
        <div className="absolute left-4 top-4 z-10 md:left-8">
          <BackButton fallback="/prestadores" label="Voltar" overlay />
        </div>
        <div className="mx-auto min-h-24 max-w-7xl px-6 sm:px-10 md:flex md:min-h-64 md:items-center md:pl-80 lg:pl-96">
          <div className="hidden md:block">
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              {dados.perfil.nome}
            </h1>
            <p className="mt-1 text-xl font-medium sm:text-3xl">
              {especialidades.join(" • ")}
            </p>
          </div>
        </div>
        <img
          src={dados.perfil.avatar_url || "/assets/oportuniza.png"}
          alt={dados.perfil.nome}
          className="absolute left-1/2 top-full lg:top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white object-cover shadow-xl md:left-[7%] md:h-60 md:w-60 md:translate-x-0 lg:h-68 lg:w-68"
        />
      </section>

      <div className="mx-auto max-w-7xl px-3 pt-28 sm:px-6 md:px-10 md:pt-16">
        <div className="mb-6 text-center md:hidden">
          <h1 className="mx-auto max-w-sm text-3xl font-extrabold leading-tight text-text-title min-[380px]:text-4xl">
            {dados.perfil.nome}
          </h1>
          <p className="mt-1 text-xl text-blue-depth min-[380px]:text-2xl">
            {especialidades.join(" • ")}
          </p>
        </div>
        <section className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-7">
            <div>
              <h2 className="text-2xl font-extrabold text-text-title md:text-3xl">
                Avaliação
              </h2>
              <div className="mt-2 flex w-fit flex-wrap items-center gap-3 rounded-full border border-gray-300 bg-white px-4 py-2 shadow-md">
                <Stars
                  value={dados.perfil.rating ?? 0}
                  size={25}
                  color="#141414"
                  borderColor="#141414"
                />
                <strong className="text-sm md:text-base">
                  {quantidadeAvaliacoes}{" "}
                  {quantidadeAvaliacoes === 1 ? "avaliação" : "avaliações"}
                </strong>
              </div>
              {user && user.id !== dados.perfil.prestador_id ? (
                <button
                  type="button"
                  onClick={() => setReviewOpen(true)}
                  className="mt-4 rounded-full bg-blue-depth px-5 py-2 font-bold text-white transition hover:bg-green-sprout"
                >
                  Avaliar profissional
                </button>
              ) : !user ? (
                <Link
                  to="/entrar"
                  className="mt-4 inline-block rounded-full border border-blue-depth px-5 py-2 font-bold text-blue-depth"
                >
                  Entre para avaliar
                </Link>
              ) : null}
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-text-title md:text-3xl">
                Endereço
              </h2>
              <div className="mt-2 flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-3 font-semibold shadow-md">
                <MapPin className="shrink-0 text-green-sprout" size={20} />
                <span>{endereco || "Localização não informada"}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-text-title md:text-3xl">
              Sobre mim
            </h2>
            <div className="mt-2 min-h-36 rounded-3xl border border-gray-300 bg-white p-5 text-sm leading-relaxed text-text-body shadow-md md:text-base">
              {descricao ||
                "Este profissional ainda não adicionou uma descrição."}
            </div>
          </div>
        </section>

        {whatsappComPais ? (
          <a
            href={`https://wa.me/${whatsappComPais}?text=${mensagemWhatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="mt-9 flex w-full items-center justify-center gap-3 rounded-lg bg-green-sprout px-6 py-4 text-xl font-extrabold text-white transition hover:brightness-105 md:text-3xl"
          >
            <MessageCircle size={32} />
            Enviar mensagem
          </a>
        ) : (
          <button
            type="button"
            disabled
            title="Este prestador ainda não informou o WhatsApp"
            className="mt-9 flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-lg bg-green-sprout px-6 py-4 text-xl font-extrabold text-white opacity-70 md:text-3xl"
          >
            <MessageCircle size={32} />
            Enviar mensagem
          </button>
        )}

        <section className="mt-12">
          <h2 className="text-2xl font-extrabold text-text-title md:text-3xl">
            Portfólio de trabalhos
          </h2>
          {dados.portfolio.length ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {dados.portfolio.map((item) => (
                <figure
                  key={item.id}
                  className="group overflow-hidden rounded-xl bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedPortfolio(item)}
                    className="block w-full cursor-zoom-in overflow-hidden"
                    aria-label={`Ampliar foto: ${item.titulo}`}
                  >
                    <img
                      src={item.imagem_url}
                      alt={item.titulo}
                      className="h-52 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-72 md:h-80"
                    />
                  </button>
                  <figcaption className="p-4">
                    <h3 className="font-bold text-text-title">{item.titulo}</h3>
                    {item.descricao && (
                      <p className="mt-1 text-sm text-text-secondary">
                        {item.descricao}
                      </p>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-2xl bg-white p-6 text-text-secondary shadow-sm">
              Nenhum trabalho publicado ainda.
            </p>
          )}
        </section>

        <PortfolioLightbox
          image={selectedPortfolio}
          onClose={() => setSelectedPortfolio(null)}
        />

        <section className="mt-12">
          <h2 className="text-2xl font-extrabold text-text-title md:text-3xl">
            Depoimentos dos clientes
          </h2>
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
                          <p className="font-bold text-text-title">
                            Cliente Oportuniza
                          </p>
                          <Stars value={review.nota} size={18} />
                        </div>
                        <time className="text-xs text-text-secondary">
                          {formatarData(review.created_at)}
                        </time>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-text-title md:text-base">
                        “
                        {review.comentario ||
                          "Serviço avaliado sem comentário."}
                        ”
                      </p>
                    </article>

                    {resposta && (
                      <div className="ml-6 flex gap-3 md:ml-16">
                        <Quote
                          className="mt-4 shrink-0 text-green-sprout"
                          size={30}
                        />
                        <article className="flex-1 rounded-3xl border border-green-sprout/30 bg-green-sprout/15 p-5 shadow-md">
                          <p className="font-bold text-text-title">
                            {dados.perfil.nome}
                          </p>
                          <p className="mt-2 text-sm text-text-title md:text-base">
                            “{resposta.resposta_texto}”
                          </p>
                          <time className="mt-3 block text-right text-xs text-text-secondary">
                            {formatarData(resposta.created_at)}
                          </time>
                        </article>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-5 rounded-2xl bg-white p-6 text-text-secondary shadow-sm">
              Este profissional ainda não recebeu avaliações.
            </p>
          )}
        </section>
      </div>

      <ReviewModal
        open={reviewOpen}
        professionalName={dados.perfil.nome}
        rating={reviewRating}
        comment={reviewComment}
        error={reviewError}
        saving={reviewSaving}
        onClose={() => setReviewOpen(false)}
        onRatingChange={setReviewRating}
        onCommentChange={setReviewComment}
        onSubmit={handleReview}
      />
    </main>
  );
}
