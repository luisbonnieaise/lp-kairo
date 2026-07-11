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
    locale === routing.defaultLocale ? "/termos" : `/${locale}/termos`;

  return {
    title: { absolute: t("termos.metaTitle") },
    description: t("termos.metaDescription"),
    alternates: {
      canonical,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale ? "/termos" : `/${l}/termos`,
        ]),
      ),
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      url: canonical,
      title: t("termos.metaTitle"),
      description: t("termos.metaDescription"),
      siteName: "Kairo",
      locale: ogLocale(locale),
    },
  };
}

export default async function TermosPage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });

  return (
    <LegalPage
      lang={htmlLang(locale)}
      kicker={t("kicker")}
      title={t("termos.title")}
      updatedLabel={t("updatedLabel")}
      updated={t("termos.updated")}
      backHome={t("backHome")}
      related={{ href: "/privacidade", label: t("termos.relatedLabel") }}
      intro={<LegalBlocks blocks={t.raw("termos.intro") as LegalBlock[]} />}
    >
      <LegalBlocks blocks={t.raw("termos.body") as LegalBlock[]} />
    </LegalPage>
  );
}
