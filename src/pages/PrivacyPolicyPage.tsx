import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

const sections = [
  [
    "1. Quem cuida dos seus dados",
    "O Oportuniza é uma plataforma acadêmica de TCC que aproxima pessoasque procuram serviços de profissionais. Para dúvidas ou pedidos sobreseus dados, escreva para oportuniza.tcc@gmail.com.",
  ],
  [
    "2. Dados que tratamos",
    "Podemos tratar nome, e-mail, tipo de conta, CPF, WhatsApp, cidade, bairro, estado, foto, descrição profissional, portfólio, avaliações, respostas e dados técnicos de autenticação. A senha é administrada pelo serviço de autenticação do Supabase e não é acessível pelo Oportuniza.",
  ],
  [
    "3. Para que usamos",
    "Usamos os dados para criar e proteger a conta, organizar perfis profissionais, permitir contato, portfólios e avaliações, prevenir duplicidades e abuso, prestar suporte e cumprir obrigações legais. A validação dos dígitos do CPF não equivale a uma confirmação oficial de identidade.",
  ],
  [
    "4. CPF e segurança",
    "O CPF não é publicado nem enviado de volta ao navegador após o cadastro. Ele é protegido no banco por criptografia e por uma impressão criptográfica usada para impedir duplicidade. O acesso é limitado às rotinas internas necessárias.",
  ],
  [
    "5. O que fica público",
    "Somente prestadores com cadastro completo podem ter nome, foto, profissão, região, biografia, portfólio e avaliações publicados. O WhatsApp só é exibido quando o próprio profissional marca uma autorização específica, que pode ser retirada ao editar o perfil.",
  ],
  [
    "6. Bases legais e compartilhamento",
    "Conforme a finalidade, o tratamento pode se apoiar em procedimentos para prestação do serviço, cumprimento legal, legítimo interesse de segurança e consentimento. Dados são processados por fornecedores de infraestrutura e autenticação, como Supabase e, quando escolhido, Google. Não vendemos dados pessoais.",
  ],
  [
    "7. Conservação e exclusão",
    "Mantemos os dados enquanto a conta estiver ativa e pelo tempo necessário para segurança ou obrigação legal. A opção “Excluir minha conta” remove a conta, o perfil e os arquivos associados, ressalvados dados cuja guarda seja legalmente obrigatória e cópias temporárias de segurança.",
  ],
  [
    "8. Seus direitos",
    "Você pode solicitar confirmação, acesso, correção, informação, portabilidade quando aplicável, anonimização, bloqueio, eliminação, oposição e revogação de consentimento. Também pode procurar a Autoridade Nacional de Proteção de Dados.",
  ],
  [
    "9. Crianças e alterações",
    "O serviço não é destinado a menores de 18 anos. Esta política poderá mudar; alterações relevantes serão informadas e a data acima será atualizada.",
  ],
];
export function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        <h1 className="text-3xl font-extrabold text-text-title sm:text-5xl">
          Política de Privacidade
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
