import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { LegalPage } from "@/components/legal/LegalPage";

const EMAIL = "contact@thekairo.app";
const UPDATED = "04 de junho de 2026";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical =
    locale === routing.defaultLocale
      ? "/privacidade"
      : `/${locale}/privacidade`;

  return {
    title: { absolute: "Política de Privacidade · Kairo" },
    description:
      "Como o Kairo coleta, usa e protege seus dados pessoais — em conformidade com a LGPD e o GDPR.",
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      url: canonical,
      title: "Política de Privacidade · Kairo",
      description:
        "Como o Kairo coleta, usa e protege seus dados pessoais — em conformidade com a LGPD e o GDPR.",
      siteName: "Kairo",
      locale: "pt_BR",
    },
  };
}

export default async function PrivacidadePage({
  params,
}: {
  params: Params;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalPage
      title="Política de Privacidade"
      updated={UPDATED}
      related={{ href: "/termos", label: "Ler os Termos de Uso" }}
      intro={
        <>
          <p>
            Esta Política descreve como o <strong>Kairo</strong> (&ldquo;app&rdquo;,
            &ldquo;nós&rdquo;) trata seus dados pessoais. Ao usar o Kairo, você
            concorda com as práticas aqui descritas.
          </p>
          <p>
            <strong>Controlador dos dados:</strong> Kairo, CNPJ
            24.811.306/0001-96, Divinópolis/MG, Brasil.
          </p>
          <p>
            <strong>Contato (encarregado/DPO):</strong>{" "}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </p>
        </>
      }
    >
      <h2>1. Dados que coletamos</h2>
      <p>Coletamos apenas o necessário para o app funcionar:</p>

      <p>
        <strong>Você fornece:</strong>
      </p>
      <ul>
        <li>
          <strong>Conta:</strong> e-mail e senha (autenticação), nome e idioma de
          preferência.
        </li>
        <li>
          <strong>Perfil:</strong> foto de perfil (avatar), se você enviar.
        </li>
        <li>
          <strong>Conteúdo que você cria:</strong> reflexões do Jardim, registros
          de práticas, mensagens trocadas com o Mentor e as cartas semanais
          geradas a partir delas.
        </li>
      </ul>

      <p>
        <strong>Gerados pelo uso:</strong>
      </p>
      <ul>
        <li>
          <strong>Dados de uso da IA:</strong> registros de quantas interações com
          a IA você fez (para aplicar limites de uso).
        </li>
        <li>
          <strong>Notificações:</strong> preferências de lembrete (processadas no
          seu dispositivo).
        </li>
        <li>
          <strong>Dados técnicos:</strong> logs de erro e diagnóstico,
          identificadores de dispositivo necessários para entrega de
          notificações.
        </li>
      </ul>

      <p>
        <strong>Não coletamos</strong> dados de cartão de crédito: pagamentos são
        processados pela <strong>Apple</strong>, <strong>Google</strong> ou{" "}
        <strong>Stripe</strong> (na web) — nós recebemos apenas o{" "}
        <strong>status da sua assinatura</strong>, nunca os dados do cartão.
      </p>

      <h2>2. Como usamos seus dados</h2>
      <ul>
        <li>Fornecer e personalizar o app (Mentor, Dôjo, Jardim, cartas semanais);</li>
        <li>Processar suas mensagens com a IA para gerar respostas e reflexões;</li>
        <li>Gerenciar sua conta e sua assinatura (incluindo o período de teste);</li>
        <li>Enviar lembretes e notificações que você configurar;</li>
        <li>Garantir segurança, prevenir abuso e aplicar limites de uso;</li>
        <li>Cumprir obrigações legais.</li>
      </ul>

      <h2>3. Base legal (LGPD / GDPR)</h2>
      <p>
        Tratamos seus dados com base em: <strong>execução do contrato</strong>{" "}
        (prestar o serviço que você assina), <strong>consentimento</strong> (ex.:
        notificações, envio de foto), <strong>legítimo interesse</strong>{" "}
        (segurança, prevenção de fraude) e{" "}
        <strong>cumprimento de obrigação legal</strong>.
      </p>

      <h2>4. Compartilhamento com terceiros (subprocessadores)</h2>
      <p>
        Não vendemos seus dados. Compartilhamos com prestadores estritamente
        necessários:
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Prestador</th>
              <th>Finalidade</th>
              <th>Dados</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Supabase</strong>
              </td>
              <td>
                Hospedagem, banco de dados, autenticação e armazenamento
              </td>
              <td>Conta, perfil, conteúdo</td>
            </tr>
            <tr>
              <td>
                <strong>Anthropic (Claude)</strong>
              </td>
              <td>Processar as mensagens do Mentor e gerar as cartas</td>
              <td>Texto das suas mensagens/reflexões</td>
            </tr>
            <tr>
              <td>
                <strong>Apple / Google</strong>
              </td>
              <td>Distribuição do app e processamento de pagamentos</td>
              <td>Status de compra/assinatura</td>
            </tr>
            <tr>
              <td>
                <strong>Stripe</strong>
              </td>
              <td>
                Pagamento de assinatura <strong>na web</strong>
              </td>
              <td>Status de pagamento (cartão fica na Stripe)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Cada prestador trata os dados conforme suas próprias políticas e contratos
        de processamento de dados.
      </p>

      <h2>5. Inteligência Artificial</h2>
      <p>
        O Mentor e as cartas semanais usam modelos da{" "}
        <strong>Anthropic (Claude)</strong>. O texto que você envia é processado
        para gerar as respostas. <strong>Não</strong> usamos seu conteúdo pessoal
        para treinar modelos de terceiros. As respostas da IA são geradas
        automaticamente e têm caráter reflexivo — veja a isenção nos{" "}
        <Link href="/termos">Termos de Uso</Link>.
      </p>

      <h2>6. Transferência internacional</h2>
      <p>
        Alguns prestadores (Supabase, Anthropic, Apple, Google, Stripe) processam
        dados <strong>fora do Brasil</strong>, inclusive nos Estados Unidos. Ao
        usar o Kairo, você concorda com essa transferência, realizada com
        salvaguardas contratuais adequadas.
      </p>

      <h2>7. Retenção e exclusão</h2>
      <p>
        Mantemos seus dados enquanto sua conta existir. Você pode{" "}
        <strong>excluir sua conta</strong> a qualquer momento (pelo app ou
        solicitando em <a href={`mailto:${EMAIL}`}>{EMAIL}</a>); ao fazê-lo,
        removemos seus dados pessoais, salvo o que a lei exigir reter.
      </p>

      <h2>8. Seus direitos</h2>
      <p>
        Conforme a LGPD (e o GDPR, se aplicável), você pode: confirmar o
        tratamento, acessar, corrigir, anonimizar, portar ou{" "}
        <strong>excluir</strong> seus dados, revogar consentimento e se opor a
        tratamentos. Para exercer, escreva para{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>

      <h2>9. Segurança</h2>
      <p>
        Adotamos medidas técnicas e organizacionais: criptografia em trânsito,
        controle de acesso por linha (RLS) no banco, e segregação de credenciais.
        Nenhum sistema é 100% seguro, mas trabalhamos para proteger seus dados.
      </p>

      <h2>10. Crianças</h2>
      <p>
        O Kairo <strong>não se destina a menores de 18 anos</strong>. Não
        coletamos intencionalmente dados de menores; se identificarmos, removemos.
      </p>

      <h2>11. Alterações</h2>
      <p>
        Podemos atualizar esta Política. Mudanças relevantes serão comunicadas no
        app ou por e-mail. A data no topo indica a última revisão.
      </p>

      <h2>12. Contato</h2>
      <p>
        Dúvidas ou solicitações sobre privacidade:{" "}
        <strong>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </strong>
        .
      </p>
    </LegalPage>
  );
}
