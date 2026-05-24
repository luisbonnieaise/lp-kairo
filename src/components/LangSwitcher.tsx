"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LANGS: Record<Locale, { label: string; native: string }> = {
  pt: { label: "PT", native: "Português" },
  en: { label: "EN", native: "English" },
  es: { label: "ES", native: "Español" },
  de: { label: "DE", native: "Deutsch" },
};

export function LangSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function change(next: Locale) {
    setOpen(false);
    router.replace(pathname, { locale: next });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] transition-colors duration-300 hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)]",
          compact ? "h-8" : "h-9",
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span aria-hidden className="text-[var(--color-accent)]">◯</span>
        {LANGS[locale].label}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[160px] overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-card)]/95 p-1 shadow-xl backdrop-blur-xl">
          {routing.locales.map((l) => (
            <button
              key={l}
              onClick={() => change(l)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors duration-200",
                l === locale
                  ? "bg-[var(--color-bg)]/40 text-[var(--color-accent)]"
                  : "hover:bg-[var(--color-bg)]/40",
              )}
            >
              <span>{LANGS[l].native}</span>
              <span className="text-xs uppercase tracking-[0.12em] text-[var(--color-fg-soft)]">
                {LANGS[l].label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
