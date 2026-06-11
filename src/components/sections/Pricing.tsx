"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Section, Kicker, H2 } from "../Section";
import { Reveal } from "../Reveal";
import { CheckoutButton } from "../CheckoutButton";
import { cn } from "@/lib/utils";

export function Pricing() {
  const t = useTranslations("pricing");
  const [yearly, setYearly] = useState(false);

  const plan = {
    name: t("name"),
    price: yearly ? t("priceYearly") : t("priceMonthly"),
    period: yearly ? t("periodYearly") : t("periodMonthly"),
    description: t("description"),
    features: t.raw("features") as string[],
    cta: t("cta"),
    ctaNote: t("ctaNote"),
    trialBadge: t("trialBadge"),
    saving: t("yearlySaving"),
  };

  return (
    <Section id="pricing" className="scroll-mt-32 border-t border-[var(--color-line)]">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Kicker>{t("kicker")}</Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <H2 className="mt-5">{t("title")}</H2>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 inline-flex items-center rounded-full border border-[var(--color-line)] bg-[var(--color-card)]/40 p-1">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={cn(
                "relative h-9 rounded-full px-5 text-sm font-medium transition-colors duration-300",
                !yearly
                  ? "text-[var(--color-bg)]"
                  : "text-[var(--color-fg-soft)] hover:text-[var(--color-fg)]",
              )}
            >
              {!yearly && (
                <motion.span
                  layoutId="pricing-toggle"
                  className="absolute inset-0 rounded-full bg-[var(--color-fg)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{t("monthly")}</span>
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={cn(
                "relative h-9 rounded-full px-5 text-sm font-medium transition-colors duration-300",
                yearly
                  ? "text-[var(--color-bg)]"
                  : "text-[var(--color-fg-soft)] hover:text-[var(--color-fg)]",
              )}
            >
              {yearly && (
                <motion.span
                  layoutId="pricing-toggle"
                  className="absolute inset-0 rounded-full bg-[var(--color-fg)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {t("yearly")}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider transition-colors",
                    yearly
                      ? "bg-[var(--color-accent)] text-[var(--color-bg)]"
                      : "bg-[var(--color-accent)]/15 text-[var(--color-accent)]",
                  )}
                >
                  {t("yearlyHint")}
                </span>
              </span>
            </button>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto mt-16 max-w-lg">
        <Reveal>
          <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--color-accent)]/40 bg-gradient-to-b from-[var(--color-card)] to-[var(--color-bg)] p-8 backdrop-blur-sm sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 30%, transparent), transparent 70%)",
              }}
            />
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl">{plan.name}</h3>
              <span className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-bg)]">
                {plan.trialBadge}
              </span>
            </div>
            <div className="mt-6 flex items-baseline gap-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={plan.price}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="font-serif text-5xl tracking-tight text-copper-gradient"
                >
                  {plan.price}
                </motion.span>
              </AnimatePresence>
              <span className="text-sm text-[var(--color-fg-soft)]">
                {plan.period}
              </span>
            </div>
            {yearly && (
              <p className="mt-2 text-xs text-[var(--color-accent)]">
                · {plan.saving}
              </p>
            )}
            <p className="mt-5 text-[15px] leading-[1.6] text-[var(--color-fg-soft)]">
              {plan.description}
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-10">
              <CheckoutButton period={yearly ? "yearly" : "monthly"}>
                {plan.cta}
              </CheckoutButton>
              <p className="mt-3 text-center text-xs text-[var(--color-fg-soft)]">
                {plan.ctaNote}
              </p>
            </div>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
