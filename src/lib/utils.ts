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
