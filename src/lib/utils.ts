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

export const localeCurrency: Record<string, Currency> = {
  pt: "BRL",
  en: "USD",
  es: "EUR",
  de: "EUR",
};

const checkoutLinks: Record<Currency, Record<BillingPeriod, string | undefined>> = {
  BRL: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_LINK_BRL_MONTHLY,
    yearly: process.env.NEXT_PUBLIC_STRIPE_LINK_BRL_YEARLY,
  },
  USD: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_LINK_USD_MONTHLY,
    yearly: process.env.NEXT_PUBLIC_STRIPE_LINK_USD_YEARLY,
  },
  EUR: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_LINK_EUR_MONTHLY,
    yearly: process.env.NEXT_PUBLIC_STRIPE_LINK_EUR_YEARLY,
  },
};

export function getCheckoutUrl(locale: string, period: BillingPeriod): string {
  const currency = localeCurrency[locale] ?? "USD";
  return checkoutLinks[currency][period] ?? "#";
}
