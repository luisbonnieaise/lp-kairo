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
