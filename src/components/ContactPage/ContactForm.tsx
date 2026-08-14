// ContactForm.tsx
import React from "react";
import { InputField } from "./InputField";
import { TextAreaField } from "./TextAreaField";

export function ContactForm() {
  
  // Tipando o evento de envio do formulário
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica de envio de dados aqui
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5 text-left">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <InputField id="email" type="email" label="Email" />
        <InputField id="name" type="text" label="Nome" />
      </div>

      <TextAreaField id="message" rows={6} />

      <button
        type="submit"
        className="mt-2 w-full rounded-full bg-brand-blue-depth py-3 font-bold text-white shadow-md transition-colors hover:bg-[#163e61]"
      >
        Enviar
      </button>
    </form>
  );
}