import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import {
  getTranslations,
  setRequestLocale,
  getMessages,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig, ogLocale, htmlLang } from "@/lib/utils";
import "../globals.css";

function isValidLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1c1e20" },
    { media: "(prefers-color-scheme: light)", color: "#f7f4eb" },
  ],
  width: "device-width",
  initialScale: 1,
};

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

  const canonical = locale === routing.defaultLocale ? "/" : `/${locale}`;

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    ),
    title: { default: t("title"), template: "%s · Kairo" },
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
      locale: ogLocale(locale),
      images: [
        {
          url: `/og?l=${locale}`,
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
      images: [`/og?l=${locale}`],
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
  const t = await getTranslations({ locale, namespace: "meta" });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Kairo",
    operatingSystem: "iOS, Android",
    applicationCategory: "LifestyleApplication",
    url: siteConfig.url,
    inLanguage: locale,
    description: t("description"),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <html
      lang={htmlLang(locale)}
      className={`${inter.variable} ${lora.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Noto Serif JP é carregada via <link> direto (não via next/font) porque
          next/font/google força `subsets` e filtra os @font-face por
          unicode-range — com `subsets: ['latin']` os glifos CJK (回路) ficam
          de fora e renderizam como tofu. Carregando aqui, o Google serve
          todos os 100+ blocos de unicode-range, cobrindo os kanji.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;600&display=swap"
        />
      </head>
      <body>
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
