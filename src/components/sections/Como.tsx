"use client";

import { useTranslations } from "next-intl";
import { Section, Kicker, H2 } from "../Section";
import { Reveal, Stagger, StaggerItem } from "../Reveal";

export function Como() {
  const t = useTranslations("como");
  const passos = t.raw("passos") as {
    n: string;
    title: string;
    body: string;
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
      </div>

      <Stagger className="mt-20 grid gap-px overflow-hidden rounded-3xl border border-[var(--color-line)] bg-[var(--color-line)] md:grid-cols-2 lg:grid-cols-4">
        {passos.map((p) => (
          <StaggerItem key={p.n} className="bg-[var(--color-bg)]">
            <div className="flex h-full flex-col gap-6 p-8 sm:p-10">
              <div className="flex items-center gap-3">
                <span className="font-serif text-4xl italic text-[var(--color-accent)]/40">
                  {p.n}
                </span>
                <span className="block h-px flex-1 bg-[var(--color-line)]" />
              </div>
              <h3 className="font-serif text-xl leading-[1.2] sm:text-2xl">
                {p.title}
              </h3>
              <p className="text-sm leading-[1.65] text-[var(--color-fg-soft)]">
                {p.body}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
