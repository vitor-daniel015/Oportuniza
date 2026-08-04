import React from 'react';
import { Shield, Map as MapIcon, MessageSquare, Search, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const Features: React.FC = () => {
  const trustCards = [
    { title: 'Painel de Avaliações', desc: 'Com perfis, estrelas e comentários verificados.' },
    { title: 'Mapa de Geolocalização', desc: 'Com pinos da Oportuniza mostrando profissionais próximos.' },
    { title: 'Contatar via WhatsApp', desc: 'Uma conversa limpa e segura entre Cliente e Profissional.' }
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background with skew effect as seen in design */}
      <div className="absolute inset-0 bg-brand-blue-depth -skew-y-3 origin-center scale-110"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center md:text-left mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Segurança e Confiança <br/>Integradas</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Special Large Card for first item if needed, but following layout */}
            <div className="bg-[#153a5c] rounded-3xl p-10 border border-white/10 flex flex-col justify-center min-h-75">
                <h4 className="text-3xl font-bold text-brand-green-herbal mb-4 leading-tight">{trustCards[0].title}</h4>
                <p className="text-gray-300 leading-relaxed">{trustCards[0].desc}</p>
            </div>

            <div className="flex flex-col gap-8">
                {trustCards.slice(1).map((card) => (
                    <div key={card.title} className="bg-[#153a5c] rounded-3xl p-8 border border-white/10 hover:bg-white/5 transition-all">
                        <h4 className="text-2xl font-bold text-brand-green-herbal mb-3 leading-tight">{card.title}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export const HowItWorks: React.FC = () => {
  const steps = [
    { 
      id: 1, 
      title: 'Encontre Profissionais', 
      desc: 'Pesquise por serviço e localize profissionais próximos a você.',
      icon: Search 
    },
    { 
      id: 2, 
      title: 'Matching Inteligente', 
      desc: 'Nosso algoritmo recomenda os melhores perfis com base na localização e reputação.',
      icon: Zap 
    },
    { 
      id: 3, 
      title: 'Avaliação Bilateral', 
      desc: 'Após a conclusão, ambos avaliam, garantindo transparência e segurança.',
      icon: CheckCircle 
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-title mb-4">Como Funciona</h2>
          <p className="text-brand-blue-depth font-semibold text-lg">Conexão Simplificada em 3 Passos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
          
          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white border-4 border-brand-green-herbal rounded-full flex items-center justify-center text-brand-green-herbal shadow-xl mb-6">
                <step.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-text-title mb-3">
                <span className="text-brand-green-sprout mr-2">{step.id} -</span>
                {step.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
