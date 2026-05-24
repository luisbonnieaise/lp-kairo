import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url:
      locale === routing.defaultLocale
        ? siteConfig.url
        : `${siteConfig.url}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? 1.0 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale
            ? siteConfig.url
            : `${siteConfig.url}/${l}`,
        ]),
      ),
    },
  }));
}
