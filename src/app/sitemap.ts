import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/utils";

function localeBase(locale: string): string {
  return locale === routing.defaultLocale
    ? siteConfig.url
    : `${siteConfig.url}/${locale}`;
}

const PAGES: { path: string; priority: number }[] = [
  { path: "", priority: 1.0 },
  { path: "/termos", priority: 0.4 },
  { path: "/privacidade", priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ path, priority }) =>
    routing.locales.map((locale) => ({
      url: `${localeBase(locale)}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: locale === routing.defaultLocale ? priority : priority * 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${localeBase(l)}${path}`]),
        ),
      },
    })),
  );
}
