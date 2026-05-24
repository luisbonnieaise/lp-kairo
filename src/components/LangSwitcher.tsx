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

type Direction = "down" | "up";
type Align = "start" | "end";

export function LangSwitcher({
  compact = false,
  direction = "down",
  align = "end",
}: {
  compact?: boolean;
  direction?: Direction;
  align?: Align;
}) {
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
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
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
          open && "border-[var(--color-accent)]/40 text-[var(--color-accent)]",
          compact ? "h-8" : "h-9",
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Idioma: ${LANGS[locale].native}`}
      >
        <span aria-hidden className="text-[var(--color-accent)]">◯</span>
        {LANGS[locale].label}
      </button>
      {open && (
        <div
          role="listbox"
          className={cn(
            "absolute z-50 min-w-[168px] overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-card)]/95 p-1 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)] backdrop-blur-xl",
            direction === "up" ? "bottom-full mb-2" : "top-full mt-2",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {routing.locales.map((l) => (
            <button
              key={l}
              role="option"
              aria-selected={l === locale}
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
