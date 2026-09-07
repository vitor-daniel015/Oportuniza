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

const quickInfos = [
  { label: "Rua das Flores, 123 - Capela do Alto", icon: MapPin },
  { label: "oportuniza.tcc@gmail.com", icon: Mail },
  { label: "(15) 99999-9999", icon: Phone },
];

export function Footer({ overlap = false }: { overlap?: boolean }) {
  return (
    <footer
      className={`relative bg-blue-depth pt-24 text-white [clip-path:polygon(0_5%,100%_12%,100%_100%,0_100%)] lg:pt-28 lg:[clip-path:polygon(0_8%,100%_18%,100%_100%,0_100%)] ${overlap ? "-mt-24 sm:-mt-28 lg:-mt-40" : "mt-8"}`}
    >
      <div className="mx-auto max-w-7xl px-5 pb-7 pt-12 sm:px-12 lg:px-10 lg:pt-16">
        <img
          src="/assets/oportuniza-completo-branco.png"
          alt="Oportuniza"
          className="mx-auto h-auto w-68.5 lg:mx-0 lg:h-24 lg:w-auto"
        />

        <div className="mt-10 flex flex-col items-center gap-y-10 text-center lg:mt-4 lg:grid lg:grid-cols-[45px_1.4fr_.8fr_1fr] lg:items-center lg:gap-10 lg:text-left">
          <div className="order-4 flex w-full items-center justify-center gap-4 border-b border-white/75 pb-9 sm:gap-6 lg:order-1 lg:col-span-1 lg:w-auto lg:flex-col lg:items-start lg:justify-start lg:gap-5 lg:border-0 lg:p-0">
            {socialLinks.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-white/85 transition-colors hover:text-green-herbal"
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

          <section className="order-2 flex w-full flex-col items-center lg:order-3 lg:items-start lg:max-w-none">
            <h2 className="text-base font-bold sm:text-xl lg:text-xl">
              Links Rápidos
            </h2>
            <nav className="mt-4 flex w-fit flex-col items-start space-y-3 text-sm text-white/90 lg:mt-6 lg:text-white/80">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  className="block text-left transition-colors hover:text-green-herbal"
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </section>

          <section className="order-3 flex w-full flex-col items-center lg:order-4 lg:items-start lg:max-w-none">
            <h2 className="text-base font-bold sm:text-xl lg:text-xl">
              Informações
            </h2>
            <div className="mt-4 flex w-fit flex-col items-start space-y-4 text-sm text-white/90 lg:mt-6 lg:space-y-3 lg:text-white/80">
              {quickInfos.map(({ label, icon: Icon }) => (
                <p key={label} className="flex items-center gap-3 text-left">
                  <Icon
                    className="h-5 w-5 shrink-0 lg:h-6 lg:w-6"
                    strokeWidth={1.4}
                  />
                  <span>{label}</span>
                </p>
              ))}
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
