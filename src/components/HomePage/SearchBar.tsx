import { MapPin, Search } from "lucide-react";
import { useState } from "react";

const categories = [
  "Todos",
  "Pedreiro",
  "Faxineira",
  "Encanador",
  "Eletricista",
  "Pintor",
];
export type SearchFilters = { category: string; location: string };

export function SearchBar({
  onSearch,
}: {
  onSearch: (filters: SearchFilters) => void;
}) {
  const [category, setCategory] = useState("Todos");
  const [location, setLocation] = useState("");
  function submit(event: React.FormEvent) {
    event.preventDefault();
    onSearch({ category, location: location.trim() });
    document
      .querySelector("#profissionais")
      ?.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <section className="relative z-20 mx-auto -mt-14 max-w-6xl px-5 sm:px-8">
      <form
        onSubmit={submit}
        className="rounded-3xl border border-white bg-white p-4 shadow-[0_20px_55px_rgba(24,70,113,.14)] sm:p-6"
      >
        <p className="mb-4 text-sm font-bold text-text-title">
          Qual serviço você procura?
        </p>
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <label className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue-depth"
              size={19}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-14 w-full appearance-none rounded-xl border border-[#DCE5EB] bg-surface-bg pl-12 pr-4 text-sm font-semibold text-text-title outline-none transition focus:border-brand-blue-depth"
            >
              <option disabled>Escolha uma categoria</option>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="relative">
            <MapPin
              className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue-depth"
              size={19}
            />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Digite sua cidade"
              className="h-14 w-full rounded-xl border border-[#DCE5EB] bg-surface-bg pl-12 pr-4 text-sm font-semibold text-text-title outline-none placeholder:font-medium placeholder:text-text-secondary/70 focus:border-brand-blue-depth"
            />
          </label>
          <button className="h-14 rounded-xl bg-brand-blue-depth px-8 text-sm font-bold text-white transition hover:bg-[#163f64]">
            Buscar
          </button>
        </div>
      </form>
    </section>
  );
}
