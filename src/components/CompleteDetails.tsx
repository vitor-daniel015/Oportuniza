
import React from "react";
import { InputField } from "../components/InputField";

    export function  CompleteDetails(){
        return(<section className="mx-auto w-full max-w-3xl px-6 pb-20 pt-16 text-center lg:pt-24 ">
                <h1  className="text-3xl font-extrabold text-text-title md:text-5xl">  
                    Para completar seu cadastro precisamos de algumas informações.
                </h1> 

                <div className="mt-8" >

                <InputField id="name" type="text"  placeholder="Insira aqui seu CPF." />
                </div>
            </section>)
}