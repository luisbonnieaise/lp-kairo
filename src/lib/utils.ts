import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const siteConfig = {
  name: "Kairo",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000",
  appStoreUrl:
    process.env.NEXT_PUBLIC_APP_STORE_URL ??
    "https://apps.apple.com/app/kairo",
  playStoreUrl:
    process.env.NEXT_PUBLIC_PLAY_STORE_URL ??
    "https://play.google.com/store/apps/details?id=app.kairo",
};

// Mapeia o locale do next-intl ("pt"|"en"|"es"|"de") para a tag BCP 47 usada
// no atributo `lang` do HTML — pt → pt-BR (variante brasileira do produto).
export function htmlLang(locale: string): string {
  return locale === "pt" ? "pt-BR" : locale;
}

// og:locale espera o formato language_TERRITORY.
export function ogLocale(locale: string): string {
  const map: Record<string, string> = {
    pt: "pt_BR",
    en: "en_US",
    es: "es_ES",
    de: "de_DE",
  };
  return map[locale] ?? locale;
}

export type Currency = "BRL" | "USD" | "EUR";
export type BillingPeriod = "monthly" | "yearly";

// Moeda por locale — usada pela rota /api/checkout pra resolver o price id.
// O checkout em si é server-side (ver src/app/api/checkout/route.ts); os
// Payment Links estáticos foram removidos (doc 07, PROMPT 7.3).
export const localeCurrency: Record<string, Currency> = {
  pt: "BRL",
  en: "USD",
  es: "EUR",
  de: "EUR",
};
