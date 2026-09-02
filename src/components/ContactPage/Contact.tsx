// Contato.tsx
import React from "react";
import { MapPin, Phone, User, LucideIcon } from "lucide-react";
import { InputField } from "../InputField";
import { TextAreaField } from "../TextAreaField";
import { ContactInfoCard } from "./ContactInfoCard";

type ContactInfo = {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
};

const contactInfos: ContactInfo[] = [
    { id: "sobre", title: "Sobre Nós", description: "Oportuniza®", icon: User },
    { id: "telefone", title: "Telefone", description: "(15) 99999-9999", icon: Phone },
    { id: "localizacao", title: "Localização", description: "Rua das Flores, 123 - Capela do Alto", icon: MapPin },
];

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aqui coloca os codigo
};

export function Contact() {
    return (
        <main className="flex min-h-screen flex-col bg-[#f5f6f8]">

            <section className="mx-auto w-full max-w-3xl px-6 pb-20 pt-16 text-center lg:pt-24">
                <h1 className="text-3xl font-extrabold text-text-title md:text-5xl">
                    Contate-nos
                </h1>
                <p className="mt-4 text-sm text-gray-700 md:text-base">
                    Alguma pergunta ou observação? Basta<br className="hidden md:block" /> nos escrever uma mensagem
                </p>

                <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5 text-left">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <InputField id="email" type="email" label="Email" placeholder="Insira aqui o email." />
                        <InputField id="name" type="text" label="Nome" placeholder="Insira aqui seu nome." />
                    </div>

                    <TextAreaField id="message" rows={6} placeholder="Insira aqui sua mensagem." />

                    <button
                        type="submit"
                        className="mt-2 w-full rounded-full bg-blue-depth py-3 font-bold text-white shadow-md transition-colors hover:bg-[#163e61]"
                    >
                        Enviar
                    </button>
                </form>
            </section>

            <section className="mt-16 bg-linear-to-r from-[#64849a] to-[#71a382] pb-32 lg:pb-64 sm:mt-20 -mb-48 lg:-mb-56">
                <div className="mx-auto grid max-w-5xl grid-cols-3 gap-2 px-2 text-center text-white sm:-mt-16 sm:gap-4 md:px-6">
                    {contactInfos.map((info) => (
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