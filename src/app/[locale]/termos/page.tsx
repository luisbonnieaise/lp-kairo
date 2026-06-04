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
    locale === routing.defaultLocale ? "/termos" : `/${locale}/termos`;

  return {
    title: { absolute: "Termos de Uso · Kairo" },
    description:
      "Termos de Uso do Kairo — assinatura, teste grátis, uso aceitável e isenções de responsabilidade.",
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      url: canonical,
      title: "Termos de Uso · Kairo",
      description:
        "Termos de Uso do Kairo — assinatura, teste grátis, uso aceitável e isenções de responsabilidade.",
      siteName: "Kairo",
      locale: "pt_BR",
    },
  };
}

export default async function TermosPage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalPage
      title="Termos de Uso"
      updated={UPDATED}
      related={{ href: "/privacidade", label: "Ler a Política de Privacidade" }}
      intro={
        <>
          <p>
            Bem-vindo ao <strong>Kairo</strong>. Estes Termos regem o uso do app.
            Ao criar uma conta ou assinar, você concorda com eles. Se não
            concordar, não use o Kairo.
          </p>
          <p>
            <strong>Responsável:</strong> Kairo, CNPJ 24.811.306/0001-96.
          </p>
          <p>
            <strong>Contato:</strong> <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </p>
        </>
      }
    >
      <h2>1. O que é o Kairo</h2>
      <p>
        O Kairo é um app de evolução pessoal: um Mentor com IA, um Dôjo de
        práticas, um Jardim de reflexões e cartas semanais. O conteúdo tem fim{" "}
        <strong>reflexivo e de autoconhecimento</strong>.
      </p>

      <h2>2. Conta e elegibilidade</h2>
      <p>
        Você precisa ter <strong>18 anos</strong> ou mais e fornecer dados
        verídicos. Você é responsável por manter sua senha em segurança e por toda
        atividade na sua conta.
      </p>

      <h2>3. Assinatura, teste grátis e cobrança</h2>
      <p>
        O Kairo é um serviço por <strong>assinatura</strong>, com{" "}
        <strong>7 (sete) dias de teste grátis</strong> para novos assinantes.
      </p>
      <ul>
        <li>
          A compra é feita <strong>dentro do app</strong>, via{" "}
          <strong>Apple App Store</strong> ou <strong>Google Play</strong> (ou via
          Stripe, na web). O pagamento usa o método cadastrado na sua conta da
          loja.
        </li>
        <li>
          <strong>Renovação automática:</strong> ao fim do teste, a assinatura é
          cobrada e <strong>renova automaticamente</strong> pelo período
          contratado (mensal ou anual), até você cancelar.
        </li>
        <li>
          <strong>Cancelamento:</strong> você pode cancelar a qualquer momento nas
          configurações de assinatura da <strong>Apple/Google</strong> (ou no
          portal da Stripe, na web). O acesso permanece até o fim do período já
          pago. Cancele ao menos 24h antes do fim do teste para não ser cobrado.
        </li>
        <li>
          <strong>Preços:</strong> exibidos no app na sua moeda local, antes da
          confirmação. Podemos alterar preços mediante aviso prévio; mudanças não
          afetam o ciclo já pago.
        </li>
        <li>
          <strong>Reembolsos:</strong> seguem as políticas da{" "}
          <strong>Apple</strong>, <strong>Google</strong> ou{" "}
          <strong>Stripe</strong>, conforme o canal da compra.
        </li>
      </ul>

      <h2>4. Uso aceitável</h2>
      <p>
        Você concorda em <strong>não</strong>: usar o app para fins ilegais;
        tentar burlar limites, segurança ou os mecanismos de assinatura; fazer
        engenharia reversa; sobrecarregar ou abusar da infraestrutura; ou enviar
        conteúdo ilícito.
      </p>

      <h2>5. Seu conteúdo</h2>
      <p>
        O conteúdo que você cria (reflexões, mensagens) é <strong>seu</strong>.
        Você nos concede uma licença limitada para processá-lo e armazená-lo
        apenas para operar o serviço (ver a{" "}
        <Link href="/privacidade">Política de Privacidade</Link>). Você é
        responsável pelo que escreve.
      </p>

      <h2>6. Inteligência Artificial — isenção importante</h2>
      <p>
        O Mentor e as cartas são gerados por <strong>IA</strong> e têm caráter{" "}
        <strong>reflexivo e motivacional</strong>.{" "}
        <strong>
          O Kairo não presta aconselhamento médico, psicológico, terapêutico,
          jurídico ou financeiro
        </strong>
        , e <strong>não substitui</strong> profissionais qualificados. A IA pode
        cometer erros; use seu próprio julgamento.
      </p>
      <blockquote>
        <p>
          <strong>
            Se você estiver em sofrimento emocional grave ou risco
          </strong>
          , procure ajuda profissional imediatamente. No Brasil, o{" "}
          <strong>CVV</strong> atende em <strong>188</strong> (24h). Em
          emergência, ligue <strong>192</strong> (SAMU) ou <strong>190</strong>.
        </p>
      </blockquote>

      <h2>7. Propriedade intelectual</h2>
      <p>
        O app, a marca &ldquo;Kairo&rdquo;, o design e o conteúdo original são
        nossos ou licenciados. Estes Termos não transferem nenhum direito sobre
        eles a você.
      </p>

      <h2>8. Isenção de garantias e limitação de responsabilidade</h2>
      <p>
        O Kairo é fornecido <strong>&ldquo;como está&rdquo;</strong>, sem
        garantias de disponibilidade ininterrupta ou de resultados. Na máxima
        extensão permitida em lei, não nos responsabilizamos por danos indiretos,
        incidentais ou consequentes decorrentes do uso (ou da impossibilidade de
        uso) do app.
      </p>

      <h2>9. Rescisão</h2>
      <p>
        Você pode encerrar sua conta a qualquer momento. Podemos suspender ou
        encerrar contas que violem estes Termos. Assinaturas ativas seguem as
        regras de cancelamento da seção 3.
      </p>

      <h2>10. Lei aplicável e foro</h2>
      <p>
        Estes Termos são regidos pelas leis do <strong>Brasil</strong>. Fica
        eleito o foro de <strong>Divinópolis/MG</strong>, salvo direito do
        consumidor de demandar em seu domicílio.
      </p>

      <h2>11. Lojas de aplicativos (Apple e Google)</h2>
      <p>
        Quando você baixa o Kairo pela <strong>App Store</strong> ou{" "}
        <strong>Google Play</strong>, também concorda com os termos da respectiva
        loja. Especificamente:
      </p>
      <ul>
        <li>
          Estes Termos são entre <strong>você e o Kairo</strong>,{" "}
          <strong>não</strong> com a Apple/Google.
        </li>
        <li>
          A <strong>Apple/Google não têm</strong> obrigação de prestar suporte ou
          manutenção do app.
        </li>
        <li>
          Em caso de falha do app em cumprir garantia aplicável, você pode
          notificar a Apple para reembolso do preço (quando houver); no limite da
          lei, a Apple não tem outra obrigação de garantia.
        </li>
        <li>
          <strong>Apple e Google são terceiros beneficiários</strong> destes
          Termos e podem fazê-los cumprir contra você.
        </li>
        <li>
          Você declara não estar em país sob embargo nem em lista de partes
          proibidas.
        </li>
      </ul>

      <h2>12. Alterações</h2>
      <p>
        Podemos atualizar estes Termos. Mudanças relevantes serão comunicadas no
        app ou por e-mail; o uso continuado após a vigência significa aceite. A
        data no topo indica a última revisão.
      </p>

      <h2>13. Contato</h2>
      <p>
        Dúvidas:{" "}
        <strong>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </strong>
        .
      </p>
    </LegalPage>
  );
}
