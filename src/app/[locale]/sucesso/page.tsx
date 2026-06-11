// Página de retorno do Stripe Checkout (success_url da rota /api/checkout).
// Confirma a assinatura e aponta para o download do app — o desbloqueio do
// premium acontece via stripe-webhook, não aqui. noindex: só faz sentido
// para quem acabou de pagar.
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import { AppStoreButtons } from "@/components/AppStoreButtons";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sucesso" });
  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

export default async function SucessoPage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "sucesso" });

  return (
    <section className="relative flex min-h-[80vh] items-center pt-32 pb-24 sm:pt-40 sm:pb-32">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
            {t("kicker")}
          </p>
          <h1 className="mt-5 font-serif text-4xl leading-[1.1] tracking-[-0.01em] sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-6 text-[17px] leading-[1.7] text-[var(--color-fg-soft)]">
            {t("body")}
          </p>
          <AppStoreButtons className="mt-10 justify-center" />
          <p className="mt-10 text-sm">
            <Link
              href="/"
              className="text-[var(--color-fg-soft)] underline-offset-4 transition-colors duration-300 hover:text-[var(--color-fg)] hover:underline"
            >
              {t("back")}
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
