"use client";

import { useTranslations } from "next-intl";
import { Section, Kicker, H2, Lead } from "../Section";
import { Reveal } from "../Reveal";

export function Comparar() {
  const t = useTranslations("comparar");
  const linhas = t.raw("linhas") as {
    label: string;
    trial: string;
    paid: string;
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
        <div className="mt-12 overflow-hidden rounded-3xl border border-[var(--color-line)] sm:mt-16">
          <div className="grid grid-cols-[1.6fr_1fr_1fr] bg-[var(--color-card)]/40 px-4 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-fg-soft)] sm:grid-cols-[1.4fr_1fr_1fr] sm:px-8 sm:py-5 sm:text-[11px] sm:tracking-[0.18em]">
            <div></div>
            <div className="text-center">{t("trialHeader")}</div>
            <div className="text-center text-[var(--color-accent)]">{t("paidHeader")}</div>
          </div>
          {linhas.map((l, i) => (
            <div
              key={i}
              className="grid grid-cols-[1.6fr_1fr_1fr] items-center gap-2 border-t border-[var(--color-line)] px-4 py-4 text-[13px] sm:grid-cols-[1.4fr_1fr_1fr] sm:gap-0 sm:px-8 sm:py-5 sm:text-[15px]"
            >
              <div className="font-medium leading-tight">{l.label}</div>
              <div className="text-center text-[12px] leading-tight text-[var(--color-fg-soft)] sm:text-[15px]">
                {l.trial}
              </div>
              <div className="text-center text-[12px] leading-tight text-[var(--color-fg)] sm:text-[15px]">
                {l.paid}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
