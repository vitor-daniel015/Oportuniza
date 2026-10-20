import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { MenuPrestador } from "./MenuPrestador";
import { Stars } from "./Stars";
import {
  PrestadorPublico,
  getPrestadoresPublicos,
} from "../../service/PrestadoresPublicosService";
import { BackButton } from "../BackButton";
import { recordProfessionalSearch } from "../../service/MetricsService";

export function Prestador() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [prestadores, setPrestadores] = useState<PrestadorPublico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchDraft, setSearchDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [minimumRating, setMinimumRating] = useState(0);
  const [sortBy, setSortBy] = useState<"relevance" | "rating" | "name">(
    "relevance",
  );

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

  const locations = useMemo(
    () =>
      [...new Set(prestadores.map((item) => `${item.cidade} - ${item.estado}`))]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, "pt-BR")),
    [prestadores],
  );

  const profissionaisFiltrados = useMemo(() => {
    const term = normalize(searchQuery);
    const results = prestadores.filter((item) => {
      const searchable = normalize(
        [
          item.nome,
          item.specialty,
          item.description,
          item.bio,
          item.bairro,
          item.cidade,
          item.estado,
        ]
          .filter(Boolean)
          .join(" "),
      );
      return (
        (!selectedCategory || item.specialty === selectedCategory) &&
        (!selectedLocation ||
          `${item.cidade} - ${item.estado}` === selectedLocation) &&
        (item.rating ?? 0) >= minimumRating &&
        (!term || searchable.includes(term))
      );
    });

    return results.sort((a, b) => {
      if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sortBy === "name") return a.nome.localeCompare(b.nome, "pt-BR");
      if (!term) return 0;
      const aStarts = normalize(a.nome).startsWith(term) ? 1 : 0;
      const bStarts = normalize(b.nome).startsWith(term) ? 1 : 0;
      return bStarts - aStarts;
    });
  }, [minimumRating, prestadores, searchQuery, selectedCategory, selectedLocation, sortBy]);

  const hasFilters = Boolean(
    searchQuery || selectedCategory || selectedLocation || minimumRating,
  );

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    const query = searchDraft.trim();
    setSearchQuery(query);
    const matchingSpecialty = prestadores.find(
      (item) => normalize(item.specialty) === normalize(query),
    )?.specialty;
    if (matchingSpecialty) void recordProfessionalSearch(matchingSpecialty);
  }

  function clearFilters() {
    setSearchDraft("");
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedLocation("");
    setMinimumRating(0);
    setSortBy("relevance");
  }

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
      <BackButton label="Voltar" />
      <MenuPrestador
        selectedCategory={selectedCategory}
        setSelectedCategory={(category) => {
          setSelectedCategory(category);
          if (category) void recordProfessionalSearch(category);
        }}
      />

      <main className="max-w-7xl mx-auto px-4 pt-6 sm:px-6 sm:pt-10">
        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2 text-text-title">
            <SlidersHorizontal size={21} />
            <h1 className="text-xl font-extrabold">Encontre o profissional certo</h1>
          </div>
          <form onSubmit={submitSearch} className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Pesquisar profissionais</span>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
              <input
                type="search"
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                placeholder="Ex.: pedreiro, reforma, João ou Centro"
                className="min-h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-base text-text-title outline-none focus:border-blue-depth focus:ring-2 focus:ring-blue-depth/20"
              />
            </label>
            <button type="submit" className="min-h-12 rounded-xl bg-blue-depth px-7 font-bold text-white transition hover:bg-green-sprout">
              Pesquisar
            </button>
          </form>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <label>
              <span className="mb-1 block text-xs font-bold text-text-secondary">Localização</span>
              <select value={selectedLocation} onChange={(event) => setSelectedLocation(event.target.value)} className="min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-text-title">
                <option value="">Todas as cidades</option>
                {locations.map((location) => <option key={location}>{location}</option>)}
              </select>
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold text-text-secondary">Avaliação mínima</span>
              <select value={minimumRating} onChange={(event) => setMinimumRating(Number(event.target.value))} className="min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-text-title">
                <option value={0}>Qualquer avaliação</option>
                <option value={3}>3 estrelas ou mais</option>
                <option value={4}>4 estrelas ou mais</option>
                <option value={5}>Somente 5 estrelas</option>
              </select>
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold text-text-secondary">Ordenar resultados</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)} className="min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-text-title">
                <option value="relevance">Mais relevantes</option>
                <option value="rating">Melhor avaliados</option>
                <option value="name">Nome de A a Z</option>
              </select>
            </label>
          </div>
        </section>

        <div className="mb-7 mt-8 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-text-title">
            {profissionaisFiltrados.length} {profissionaisFiltrados.length === 1 ? "profissional encontrado" : "profissionais encontrados"}
          </h1>
          {hasFilters && <button type="button" onClick={clearFilters} className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-blue-depth hover:bg-blue-50"><X size={17} /> Limpar filtros</button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {profissionaisFiltrados.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
              <Search className="mx-auto text-text-secondary" size={36} />
              <h2 className="mt-3 text-xl font-bold text-text-title">Nenhum profissional encontrado</h2>
              <p className="mt-2 text-text-secondary">Tente outro termo, cidade ou uma avaliação mínima menor.</p>
              <button type="button" onClick={clearFilters} className="mt-5 rounded-xl bg-blue-depth px-5 py-3 font-bold text-white">Mostrar todos</button>
            </div>
          ) : (
            profissionaisFiltrados.map((profissional) => (
              <Link
                key={profissional.service_id}
                to={`/prestador/${profissional.prestador_id}`}
                className="block group"
              >
                <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100 flex flex-col justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-22 w-22 rounded-full overflow-hidden shrink-0 sm:h-32 sm:w-32 lg:h-40 lg:w-40">
                      <img
                        src={profissional.avatar_url}
                        alt={profissional.nome}
                        loading="lazy"
                        decoding="async"
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
                      <p className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
                        <MapPin size={14} /> {profissional.bairro ? `${profissional.bairro}, ` : ""}{profissional.cidade} - {profissional.estado}
                      </p>
                      <p className="mt-2 text-sm text-text-title font-semibold opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        Clique para ver mais detalhes →
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
