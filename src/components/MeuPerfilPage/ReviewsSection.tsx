import { Pencil } from "lucide-react";
import type { MinhaAvaliacao } from "../../service/MeuPerfilService";
import { Stars } from "../PrestadorPage/Stars";

export function ReviewsSection({
  reviews,
  replyingTo,
  reply,
  saving,
  onStart,
  onReply,
  onSubmit,
}: {
  reviews: MinhaAvaliacao[];
  replyingTo: string | null;
  reply: string;
  saving: boolean;
  onStart: (id: string, text: string) => void;
  onReply: (text: string) => void;
  onSubmit: (id: string) => void;
}) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-extrabold text-text-title md:text-3xl">
        Depoimentos dos clientes
      </h2>
      <div className="mt-7 space-y-5">
        {reviews.length ? (
          reviews.map((review) => {
            const response = Array.isArray(review.review_replies)
              ? review.review_replies[0]
              : review.review_replies;
            return (
              <article
                key={review.id}
                className="rounded-3xl border bg-white p-4 shadow-md sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-text-title">
                      Cliente Oportuniza
                    </p>
                    <Stars value={review.nota} size={18} />
                  </div>
                  <button
                    onClick={() =>
                      onStart(review.id, response?.resposta_texto ?? "")
                    }
                    className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold text-green-sprout sm:px-5 sm:text-base"
                  >
                    <Pencil size={16} />{" "}
                    {response ? "Editar resposta" : "Responder"}
                  </button>
                </div>
                <p className="mt-4 wrap-break-word">
                  “{review.comentario || "Serviço avaliado sem comentário."}”
                </p>
                {response && (
                  <div className="mt-4 rounded-2xl bg-green-sprout/15 p-4">
                    <strong>Sua resposta</strong>
                    <p className="wrap-break-word">{response.resposta_texto}</p>
                  </div>
                )}
                {replyingTo === review.id && (
                  <div className="mt-4">
                    <textarea
                      value={reply}
                      onChange={(e) => onReply(e.target.value)}
                      rows={3}
                      className="w-full resize-none rounded-2xl bg-[#dadada] px-5 py-3"
                      placeholder="Escreva sua resposta"
                    />
                    <button
                      onClick={() => onSubmit(review.id)}
                      disabled={saving}
                      className="mt-2 rounded-lg bg-green-sprout px-5 py-2 font-bold text-white"
                    >
                      Salvar resposta
                    </button>
                  </div>
                )}
              </article>
            );
          })
        ) : (
          <p className="rounded-2xl bg-white p-6 text-text-secondary shadow-sm">
            Você ainda não recebeu avaliações.
          </p>
        )}
      </div>
    </section>
  );
}
