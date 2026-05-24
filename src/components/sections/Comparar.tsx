"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Section, Kicker, H2, Lead } from "../Section";
import { Reveal } from "../Reveal";

export function Comparar() {
  const t = useTranslations("comparar");
  const linhas = t.raw("linhas") as {
    label: string;
    free: string;
    premium: string;
  }[];

  return (
    <Section className="border-t border-[var(--color-line)]">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Kicker>{t("kicker")}</Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <H2 className="mt-5">{t("title")}</H2>
        </Reveal>
        <Reveal delay={0.15}>
          <Lead className="mx-auto mt-6 max-w-xl">{t("subtitle")}</Lead>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="mt-16 overflow-hidden rounded-3xl border border-[var(--color-line)]">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] bg-[var(--color-card)]/40 px-6 py-5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-fg-soft)] sm:px-8">
            <div></div>
            <div className="text-center">Gratuito</div>
            <div className="text-center text-[var(--color-accent)]">Premium</div>
          </div>
          {linhas.map((l, i) => (
            <div
              key={i}
              className="grid grid-cols-[1.4fr_1fr_1fr] items-center border-t border-[var(--color-line)] px-6 py-5 text-sm sm:px-8 sm:text-[15px]"
            >
              <div className="font-medium">{l.label}</div>
              <div className="text-center text-[var(--color-fg-soft)]">
                {l.free}
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[var(--color-fg)]">
                <Check className="h-4 w-4 text-[var(--color-accent)]" />
                {l.premium}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
