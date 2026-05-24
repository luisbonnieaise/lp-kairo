import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import {
  getTranslations,
  setRequestLocale,
  getMessages,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";

function isValidLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}
import { SmoothScroll } from "@/components/SmoothScroll";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/lib/utils";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const t = await getTranslations({ locale, namespace: "meta" });

  const canonical =
    locale === routing.defaultLocale ? "/" : `/${locale}`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale ? "/" : `/${l}`,
        ]),
      ),
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: t("title"),
      description: t("description"),
      siteName: "Kairo",
      locale: locale === "pt" ? "pt_BR" : locale,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: t("ogAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/opengraph-image"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  setRequestLocale(locale);

  const messages = await getMessages();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Kairo",
    operatingSystem: "iOS, Android",
    applicationCategory: "LifestyleApplication",
    url: siteConfig.url,
    description:
      "Personal evolution system with Mentor (Claude AI), Dojo of practices, Garden of reflections, and weekly Letter.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "120",
    },
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SmoothScroll />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="relative min-h-dvh overflow-hidden bg-noise">
        <Header locale={locale} />
        <main className="relative">{children}</main>
        <Footer locale={locale} />
      </div>
    </NextIntlClientProvider>
  );
}
