// Contato.tsx
import { MapPin, Phone, User, LucideIcon } from "lucide-react";
import { ContactForm } from "./ContactForm";
import { ContactInfoCard } from "./ContactInfoCard";

// Definindo o formato dos dados
type ContactInfo = {
    id: string;
    title: string;
    description?: string;
    icon: LucideIcon;
};

const CONTACT_INFOS: ContactInfo[] = [
    { id: "sobre", title: "Sobre Nós", icon: User },
    { id: "telefone", title: "Telefone", description: "(15) 99999-9999", icon: Phone },
    { id: "localizacao", title: "Localização", description: "Rua das Flores, 123 - Capela do Alto", icon: MapPin },
];

export function Contact() {
    return (
        <main className="flex min-h-screen flex-col bg-[#f5f6f8]">

            <section className="mx-auto w-full max-w-3xl px-6 pb-20 pt-16 text-center lg:pt-24">
                <h1 className="text-3xl font-extrabold text-brand-blue-depth md:text-5xl">
                    Contate-nos
                </h1>
                <p className="mt-4 text-sm text-gray-700 md:text-base">
                    Alguma pergunta ou observação? Basta<br className="hidden md:block" /> nos escrever uma mensagem
                </p>

                <ContactForm />
            </section>

            <section className="mt-16 bg-gradient-to-r from-[#64849a] to-[#71a382] pb-32 lg:pb-64 sm:mt-20 -mb-48 lg:-mb-56">
                <div className="mx-auto grid max-w-5xl grid-cols-3 gap-2 px-2 text-center text-white sm:-mt-16 sm:gap-4 md:px-6">
                    {CONTACT_INFOS.map((info) => (
                        <ContactInfoCard
                            icon={info.icon}
                            title={info.title}
                            description={info.description}
                        />
                    ))}
                </div>
            </section>

        </main>
    );
}