import React from "react";
import { InputField } from "../InputField";
import { ButtonOportuniza } from "../Button";


export function Login() {
    return(
        <section className="mx-auto w-full max-w-3xl px-6 pb-20 pt-16 text-center lg:pt-24">
            <h1 className="text-3xl font-extrabold text-text-title md:text-5xl">
                    Entre na sua Conta.
                </h1>      

                <InputField id="name" type="text" placeholder="Digite seu nome." />
                <InputField id="name" type="text" placeholder="Digite seu email." />
                <InputField id="name" type="text" placeholder="Confirme sua senha." />

            <ButtonOportuniza
                title="Entar"
                link="/"
                color="#1e4f7a"
                colorHover="#163e61">
            </ButtonOportuniza>

        </section>
    )
}