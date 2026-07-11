import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LegalPage } from "@/components/legal/LegalPage";
import { LegalBlocks, type LegalBlock } from "@/components/legal/LegalBlocks";
import { htmlLang, ogLocale } from "@/lib/utils";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  const canonical =
    locale === routing.defaultLocale
      ? "/privacidade"
      : `/${locale}/privacidade`;

  return {
    title: { absolute: t("privacidade.metaTitle") },
    description: t("privacidade.metaDescription"),
    alternates: {
      canonical,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale
            ? "/privacidade"
            : `/${l}/privacidade`,
        ]),
      ),
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      url: canonical,
      title: t("privacidade.metaTitle"),
      description: t("privacidade.metaDescription"),
      siteName: "Kairo",
      locale: ogLocale(locale),
    },
  };
}

export default async function PrivacidadePage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });

  return (
    <LegalPage
      lang={htmlLang(locale)}
      kicker={t("kicker")}
      title={t("privacidade.title")}
      updatedLabel={t("updatedLabel")}
      updated={t("privacidade.updated")}
      backHome={t("backHome")}
      related={{ href: "/termos", label: t("privacidade.relatedLabel") }}
      intro={
        <LegalBlocks blocks={t.raw("privacidade.intro") as LegalBlock[]} />
      }
    >
      <LegalBlocks blocks={t.raw("privacidade.body") as LegalBlock[]} />
    </LegalPage>
  );
}
