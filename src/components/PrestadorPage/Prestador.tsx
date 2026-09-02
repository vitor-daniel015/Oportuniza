import React from "react";
import { MenuPrestador } from "./MenuPrestador";
import { Stars } from "./Stars";
import { mockProfessionals } from "../../lib/data";

export function Prestador() {
    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

    const profissionaisFiltrados = mockProfessionals.filter(
        profissional => !selectedCategory || profissional.specialty.includes(selectedCategory)
    );

    return (
        <div className="min-h-screen">
            <MenuPrestador
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            <main className="max-w-7xl mx-auto px-4 pt-16">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-text-title">
                        {selectedCategory ? `Profissionais em: ${selectedCategory}` : "Todos os Profissionais"}
                    </h1>
                    {selectedCategory ?
                        <a onClick={() => setSelectedCategory(null)} className="text-green-herbal hover:text-green-sprout transition-all">
                            Ver Todos
                        </a> : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                    {profissionaisFiltrados.length === 0 ? (
                        <p className="text-secondary col-span-full text-center py-10">
                            Nenhum profissional encontrado nesta categoria.
                        </p>
                    ) : (
                        profissionaisFiltrados.map((profissional: any) => (
                            <a key={profissional.id} href={`/prestador/${profissional.id}`} className="block group">
                                <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100 flex flex-col justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-40 h-40 rounded-full overflow-hidden shrink-0">
                                            <img
                                                src={profissional.photoProfile}
                                                alt={profissional.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Coluna da Direita: Textos */}
                                        <div className="flex flex-col text-left">
                                            <h3 className="text-3xl font-bold text-text-title">{profissional.name}</h3>
                                            <p className="text-sm text-text-description font-semibold mb-1">{profissional.specialty}</p>
                                            <Stars value={profissional.rating} />
                                            <p className="mt-1 text-xs text-text-secondary">{profissional.location}</p>
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
