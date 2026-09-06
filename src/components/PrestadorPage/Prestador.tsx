import React, { useEffect, useState } from "react";
import { MenuPrestador } from "./MenuPrestador";
import { Stars } from "./Stars";
import {
  PrestadorPublico,
  getPrestadoresPublicos,
} from "../../service/PrestadoresPublicosService";

export function Prestador() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [prestadores, setPrestadores] = useState<PrestadorPublico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);
        const dados = await getPrestadoresPublicos();
        setPrestadores(dados);
      } catch (err) {
        console.error("Erro ao buscar prestadores:", err);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  const profissionaisFiltrados = selectedCategory
    ? prestadores.filter((item: any) => item.specialty === selectedCategory)
    : prestadores;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg font-medium text-slate-600">
          Carregando profissionais...
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <MenuPrestador
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <main className="max-w-7xl mx-auto px-4 pt-8 sm:pt-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-text-title">
            {selectedCategory
              ? `Profissionais em: ${selectedCategory}`
              : "Todos os Profissionais"}
          </h1>
          {selectedCategory ? (
            <a
              onClick={() => setSelectedCategory(null)}
              className="text-green-herbal hover:text-green-sprout transition-all"
            >
              Ver Todos
            </a>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {profissionaisFiltrados.length === 0 ? (
            <p className="text-secondary col-span-full text-center py-10">
              Nenhum profissional encontrado nesta categoria.
            </p>
          ) : (
            profissionaisFiltrados.map((profissional) => (
              <a
                key={profissional.service_id}
                href={`/prestador/${profissional.prestador_id}`}
                className="block group"
              >
                <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100 flex flex-col justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-22 w-22 rounded-full overflow-hidden shrink-0 sm:h-32 sm:w-32 lg:h-40 lg:w-40">
                      <img
                        src={profissional.avatar_url}
                        alt={profissional.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Coluna da Direita: Textos */}
                    <div className="flex flex-col text-left">
                      <h3 className="text-xl font-bold leading-tight text-text-title sm:text-2xl lg:text-3xl">
                        {profissional.nome}
                      </h3>
                      <p className="text-sm text-text-description font-semibold mb-1">
                        {profissional.specialty}
                      </p>
                      {profissional.rating === null ? (
                        <p className="text-sm text-text-secondary">
                          Sem avaliações
                        </p>
                      ) : (
                        <Stars value={profissional.rating} />
                      )}
                      <p className="mt-1 text-xs text-text-secondary">
                        {profissional.bairro}, {profissional.cidade} -{" "}
                        {profissional.estado}
                      </p>
                      <p className="mt-2 text-sm text-text-title font-semibold opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        Clique para ver mais detalhes →
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
