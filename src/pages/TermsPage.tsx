import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

const sections = [
  [
    "1. Aceitação",
    "Ao criar uma conta ou usar o Oportuniza, você concorda com estes Termos e com a Política de Privacidade. Se não concordar, não utilize a plataforma.",
  ],
  [
    "2. Tipos de conta",
    "Contratante é quem procura um profissional. Prestador é quem oferece e divulga serviços. Cada pessoa deve fornecer informações verdadeiras, manter sua conta segura e usar somente sua própria identidade e conteúdo.",
  ],
  [
    "3. Cadastro profissional",
    "O perfil do prestador só fica visível após o preenchimento das informações obrigatórias. O CPF tem os dígitos validados e ajuda a evitar cadastros duplicados, mas isso não representa verificação oficial de identidade, antecedentes, habilitação ou qualidade profissional.",
  ],
  [
    "4. WhatsApp e dados públicos",
    "O prestador escolhe separadamente se autoriza a exibição pública do WhatsApp. Essa autorização pode ser retirada ao editar o perfil. Nome, foto, profissão, região, biografia, portfólio e avaliações podem ficar públicos quando o cadastro estiver completo.",
  ],
  [
    "5. Serviços e pagamentos",
    "O Oportuniza aproxima usuários, mas não executa, supervisiona ou garante os serviços negociados entre eles. Preço, prazo, pagamento, segurança e execução são combinados diretamente entre contratante e prestador.",
  ],
  [
    "6. Portfólios e avaliações",
    "Envie apenas fotos e textos próprios ou que você tenha autorização para usar. Avaliações devem relatar experiências reais, com respeito e boa-fé. Conteúdo ilegal, ofensivo, sexual, discriminatório, enganoso ou que viole direitos de terceiros pode ser removido.",
  ],
  [
    "7. Suspensão e responsabilidade",
    "Contas podem ser limitadas ou removidas por fraude, abuso, violação destes Termos ou risco a outras pessoas. O Oportuniza buscará manter o serviço disponível e seguro, mas uma aplicação acadêmica pode sofrer interrupções e não garante resultados comerciais.",
  ],
  [
    "8. Exclusão",
    "O titular pode excluir sua conta na tela Meu perfil. A exclusão remove o perfil e os dados associados, observadas obrigações legais e o período técnico de cópias de segurança.",
  ],
  [
    "9. Contato e alterações",
    "Dúvidas podem ser enviadas para oportuniza.tcc@gmail.com. Estes Termos poderão ser atualizados; mudanças relevantes serão comunicadas antes de produzirem efeitos quando necessário.",
  ],
];
export function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        <h1 className="text-3xl font-extrabold text-text-title sm:text-5xl">
          Termos de Uso
        </h1>
        <p className="mt-2 text-text-secondary">
          Última atualização: 6 de setembro de 2026
        </p>
        <div className="mt-10 space-y-8">
          {sections.map(([title, text]) => (
            <section key={title}>
              <h2 className="text-xl font-extrabold text-text-title">
                {title}
              </h2>
              <p className="mt-2 leading-7 text-text-secondary">{text}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
