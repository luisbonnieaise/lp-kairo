"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Section, Kicker, H2 } from "../Section";
import { Reveal } from "../Reveal";
import { cn } from "@/lib/utils";

export function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as { q: string; a: string }[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" className="scroll-mt-32 border-t border-[var(--color-line)]">
      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <Reveal>
              <Kicker>{t("kicker")}</Kicker>
            </Reveal>
            <Reveal delay={0.05}>
              <H2 className="mt-4">{t("title")}</H2>
            </Reveal>
          </div>
        </div>

        <div className="md:col-span-8">
          <div className="flex flex-col">
            {items.map((it, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={i} delay={i * 0.03}>
                  <div
                    className={cn(
                      "border-b border-[var(--color-line)]",
                      i === 0 && "border-t",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-start justify-between gap-6 py-6 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-serif text-lg leading-[1.35] sm:text-xl">
                        {it.q}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-accent)]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-[58ch] pb-7 pr-12 text-[15px] leading-[1.7] text-[var(--color-fg-soft)]">
                            {it.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
