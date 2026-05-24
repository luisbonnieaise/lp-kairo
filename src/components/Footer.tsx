import { useTranslations } from "next-intl";
import { Logo } from "./Logo";
import { LangSwitcher } from "./LangSwitcher";
import { AppStoreButtons } from "./AppStoreButtons";
import { Container } from "./Container";

const COLS = [
  {
    head: "product",
    items: [
      { key: "mentor", href: "#mentor" },
      { key: "dojo", href: "#dojo" },
      { key: "jardim", href: "#jardim" },
      { key: "carta", href: "#carta" },
      { key: "silencio", href: "#silencio" },
      { key: "premium", href: "#pricing" },
    ],
  },
  {
    head: "company",
    items: [
      { key: "sobre", href: "#" },
      { key: "blog", href: "#" },
      { key: "contato", href: "mailto:ola@kairoapp.com" },
    ],
  },
  {
    head: "legal",
    items: [
      { key: "termos", href: "#" },
      { key: "privacidade", href: "#" },
      { key: "cookies", href: "#" },
    ],
  },
] as const;

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative border-t border-[var(--color-line)] py-14 sm:py-20"
      data-locale={locale}
    >
      <Container>
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <Logo size="lg" />
            <p className="mt-5 max-w-sm font-serif text-base italic leading-[1.5] text-[var(--color-fg-soft)] sm:mt-6 sm:text-lg">
              {t("tagline")}
            </p>
            <div className="mt-6 sm:mt-8">
              <AppStoreButtons size="sm" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 md:col-span-6 md:grid-cols-3 md:gap-8">
            {COLS.map((col) => (
              <div key={col.head}>
                <h4 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  {t(col.head)}
                </h4>
                <ul className="mt-4 space-y-3">
                  {col.items.map((item) => (
                    <li key={item.key}>
                      <a
                        href={item.href}
                        className="text-[13px] text-[var(--color-fg-soft)] transition-colors duration-300 hover:text-[var(--color-fg)] sm:text-sm"
                      >
                        {t(`links.${item.key}`)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="md:col-span-1 md:justify-self-end">
            <h4 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {t("language")}
            </h4>
            <div className="mt-4">
              <LangSwitcher compact direction="up" align="start" />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[var(--color-line)] pt-6 sm:mt-16 sm:pt-8 md:flex-row md:items-center">
          <p className="text-xs text-[var(--color-fg-soft)]">
            © {year} Kairo. {t("rights")}
          </p>
          <p className="font-jp text-sm text-[var(--color-fg-soft)]">
            <span aria-hidden>回路</span>
            <span className="ml-3 font-sans text-[11px] uppercase tracking-[0.18em] sm:text-xs">
              {t("crafted")}
            </span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
