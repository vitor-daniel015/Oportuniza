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

const socialLinks = [
  { label: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { label: "GitHub", icon: Github, href: "https://github.com" },
  { label: "Telegram", icon: Send, href: "https://telegram.org" },
  { label: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { label: "YouTube", icon: Youtube, href: "https://youtube.com" },
  { label: "Twitter", icon: Twitter, href: "https://twitter.com" },
];

const quickLinks = [
  { label: "Sobre Nós", href: "/#sobre" },
  { label: "Funcionalidades", href: "/#servicos" },
  { label: "Contato", href: "/contato" },
  { label: "Termos de Uso", href: "/termos-de-uso" },
  { label: "Políticas de Privacidade", href: "/politica-de-privacidade" },
];

export function Footer() {
  return (
    <footer className="relative mt-8 bg-brand-blue-depth pt-24 text-white [clip-path:polygon(0_5%,100%_12%,100%_100%,0_100%)] lg:pt-28 lg:[clip-path:polygon(0_8%,100%_18%,100%_100%,0_100%)]">
      <div className="mx-auto max-w-7xl px-8 pb-7 pt-12 sm:px-12 lg:px-10 lg:pt-16">
        <img
          src="/assets/oportuniza-completo-branco.png"
          alt="Oportuniza"
          className="mx-auto h-auto w-68.5 lg:mx-0 lg:h-24 lg:w-auto"
        />

        <div className="mt-8 grid grid-cols-2 items-start gap-x-5 gap-y-10 lg:mt-4 lg:grid-cols-[45px_1.4fr_.8fr_1fr] lg:items-center lg:gap-10">
          <div className="order-4 col-span-2 flex items-center justify-between border-b border-white/75 px-1 pb-9 lg:order-1 lg:col-span-1 lg:flex-col lg:items-start lg:justify-start lg:gap-5 lg:border-0 lg:p-0">
            {socialLinks.map(({ label, icon: Icon, href: href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-white/85 transition-colors hover:text-brand-green-herbal"
              >
                <Icon size={24} strokeWidth={1.4} />
              </a>
            ))}
          </div>

          <img
            src="/assets/footer-art.png"
            alt="Arte institucional Oportuniza"
            className="order-2 mx-auto hidden w-full max-w-110 lg:block"
          />

          <section className="order-2 w-full lg:order-3 lg:max-w-none">
            <h2 className="text-base font-bold sm:text-xl lg:text-xl">
              Links Rápidos
            </h2>
            <nav className="mt-4 space-y-2 text-[10px] text-white/90 sm:text-sm lg:mt-6 lg:space-y-3 lg:text-sm lg:text-white/80">
              {quickLinks.map((link) => (
                <a key={link.label} className="block" href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </section>

          <section className="order-3 w-full lg:order-4 lg:max-w-none">
            <h2 className="text-base font-bold sm:text-xl lg:text-xl">
              Informações
            </h2>
            <div className="mt-4 space-y-2.5 text-[9px] text-white/90 sm:text-xs lg:mt-6 lg:space-y-4 lg:text-sm lg:text-white/80">
              <p className="flex items-center gap-2.5 lg:gap-3">
                <MapPin className="h-4 w-4 shrink-0 lg:h-6 lg:w-6" strokeWidth={1.4} />
                <span>Rua das Flores, 123 - Capela do Alto</span>
              </p>
              <p className="flex items-center gap-2.5 lg:gap-3">
                <Mail className="h-4 w-4 shrink-0 lg:h-6 lg:w-6" strokeWidth={1.4} />
                <span>oportuniza.tcc@gmail.com</span>
              </p>
              <p className="flex items-center gap-2.5 lg:gap-3">
                <Phone className="h-4 w-4 shrink-0 lg:h-6 lg:w-6" strokeWidth={1.4} />
                <span>(15) 99999-9999</span>
              </p>
            </div>
          </section>
        </div>

        <p className="mt-5 text-center text-[10px] text-white/75 lg:mt-8 lg:border-t lg:border-white/70 lg:pt-4">
          © 2026 Oportuniza. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
