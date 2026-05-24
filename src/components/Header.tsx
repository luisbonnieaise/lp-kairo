"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { LangSwitcher } from "./LangSwitcher";
import { cn, siteConfig } from "@/lib/utils";

const ANCHORS = [
  { key: "mentor", href: "#mentor" },
  { key: "dojo", href: "#dojo" },
  { key: "jardim", href: "#jardim" },
  { key: "carta", href: "#carta" },
  { key: "premium", href: "#pricing" },
  { key: "faq", href: "#faq" },
] as const;

export function Header({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-[var(--ease-out-zen)]",
          scrolled ? "pt-3" : "pt-5",
        )}
        data-locale={locale}
      >
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
          <div
            className={cn(
              "flex items-center justify-between rounded-full border border-transparent px-4 py-2.5 transition-all duration-500 ease-[var(--ease-out-zen)] md:px-6",
              scrolled
                ? "border-[var(--color-line)] bg-[var(--color-bg)]/70 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] backdrop-blur-xl"
                : "bg-transparent",
            )}
          >
            <Link href="/" className="flex items-center" aria-label="Kairo home">
              <Logo />
            </Link>

            <nav className="hidden items-center gap-8 lg:flex">
              {ANCHORS.map((a) => (
                <a
                  key={a.key}
                  href={a.href}
                  className="group relative text-[13px] font-medium text-[var(--color-fg-soft)] transition-colors duration-300 hover:text-[var(--color-fg)]"
                >
                  {t(a.key)}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--color-accent)] transition-all duration-300 ease-[var(--ease-out-zen)] group-hover:w-full" />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden md:block">
                <LangSwitcher />
              </div>
              <a
                href={siteConfig.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden h-9 items-center rounded-full bg-[var(--color-fg)] px-4 text-[13px] font-medium text-[var(--color-bg)] transition-all duration-300 hover:bg-[var(--color-accent)] sm:inline-flex"
              >
                {t("download")}
              </a>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] lg:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-[var(--color-bg)]/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-dvh flex-col">
              <div className="flex items-center justify-between px-6 py-5">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)]"
                  aria-label="Fechar menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
                {ANCHORS.map((a, i) => (
                  <motion.a
                    key={a.key}
                    href={a.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.05 + i * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="border-b border-[var(--color-line)] py-5 font-serif text-3xl leading-none"
                  >
                    {t(a.key)}
                  </motion.a>
                ))}
              </nav>

              <div className="flex items-center justify-between px-8 pb-10">
                <LangSwitcher />
                <a
                  href={siteConfig.appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center rounded-full bg-[var(--color-fg)] px-6 text-sm font-medium text-[var(--color-bg)]"
                >
                  {t("download")}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
