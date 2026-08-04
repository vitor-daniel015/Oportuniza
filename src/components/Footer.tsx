import {
    Facebook,
    Github,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Send,
    Twitter,
    Youtube,
} from "lucide-react";
const socials = [Facebook, Github, Send, Instagram, Youtube, Twitter];
export function Footer() {
    return (
        <footer
            id="contato"
            className="relative mt-8 bg-brand-blue-depth pt-28 text-white [clip-path:polygon(0_8%,100%_18%,100%_100%,0_100%)]"
        >
            <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 lg:px-10">
                <img
                    src="/assets/oportuniza-completo-branco.png"
                    alt="Logo"
                    className="h-24 w-auto" />
                <div className="mt-4 grid gap-10 lg:grid-cols-[45px_1.4fr_.8fr_1fr] lg:items-center">
                    <div className="flex gap-4 lg:flex-col">
                        {socials.map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="text-white/80 hover:text-brand-green-herbal"
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                    <img
                        src="/assets/footer-art.png"
                        alt="Arte institucional Oportuniza"
                        className="mx-auto w-full max-w-110"
                    />
                    <div>
                        <h3 className="text-xl font-bold">Links Rápidos</h3>
                        <div className="mt-6 space-y-3 text-sm text-white/80">
                            <a className="block" href="/#sobre">
                                Sobre Nós
                            </a>
                            <a className="block" href="/profissionais">
                                Funcionalidades
                            </a>
                            <a className="block" href="/auth">
                                Suporte
                            </a>
                            <a className="block" href="#">
                                Termos de Uso
                            </a>
                            <a className="block" href="#">
                                Políticas de Privacidade
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Informações</h3>
                        <div className="mt-6 space-y-4 text-sm text-white/80">
                            <p className="flex gap-3">
                                <MapPin size={19} />
                                Rua das Flores, 123 - Capela do Alto
                            </p>
                            <p className="flex gap-3">
                                <Mail size={19} />
                                oportuniza.tcc@gmail.com
                            </p>
                            <p className="flex gap-3">
                                <Phone size={19} />
                                (15) 99999-9999
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-white/70 pt-4 text-center text-[10px] text-white/70">
                    © 2026 Oportuniza. Todos os direitos reservados.
                </div>
            </div>
        </footer>
    );
}
