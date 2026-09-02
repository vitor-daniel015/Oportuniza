import React, { useState } from "react";
import { MenuPrestador } from "./MenuPrestador"; // Certifique-se de importar o caminho correto
import { mockProfessionals } from "../../lib/data";

export function Prestador() {
    // 1. O estado agora vive no pai (Dashboard)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // 2. Os dados são filtrados aqui no Dashboard
    const profissionaisFiltrados = mockProfessionals.filter(
        professional => !selectedCategory || professional.specialty.includes(selectedCategory)
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 3. Passamos o estado e a função de alterar o estado como Props para a Navbar */}
            <MenuPrestador 
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory} 
            />

            {/* 4. Aqui você renderiza a sua grade de Cards */}
            <main className="max-w-7xl mx-auto px-4 pt-32 pb-12">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    {selectedCategory ? `Profissionais em: ${selectedCategory}` : "Todos os Profissionais"}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profissionaisFiltrados.length === 0 ? (
                        <p className="text-gray-500 col-span-full text-center py-10">
                            Nenhum profissional encontrado nesta categoria.
                        </p>
                    ) : (
                        profissionaisFiltrados.map((professional: any) => (
                            <div key={professional.id} className="bg-white p-6 rounded-xl shadow-xs border border-gray-100 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{professional.name}</h3>
                                    <p className="text-sm text-blue-600 font-semibold mb-2">{professional.specialty}</p>
                                    {/* Caso queira testar a exibição da LGPD anterior, se tiver esses campos no seu mock: */}
                                    <p className="text-xs text-gray-500">{professional.bairro} - {professional.cidade}</p>
                                </div>
                                
                                <a 
                                    href={`/prestador/${professional.id}`} 
                                    className="mt-4 block text-center bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Ver Perfil
                                </a>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
