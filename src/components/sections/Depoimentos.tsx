"use client";

import { useTranslations } from "next-intl";
import { Section, Kicker, H2 } from "../Section";
import { Reveal } from "../Reveal";

export function Depoimentos() {
  const t = useTranslations("depoimentos");
  const items = t.raw("items") as {
    quote: string;
    author: string;
    role: string;
  }[];

  // Duplica para marquee infinito
  const loop = [...items, ...items];

  return (
    <section className="relative scroll-mt-32 border-t border-[var(--color-line)] py-24 sm:py-32 md:py-40">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Kicker>{t("kicker")}</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <H2 className="mt-5">{t("title")}</H2>
          </Reveal>
        </div>
      </div>

      <div className="mt-12 overflow-hidden sm:mt-16">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--color-bg)] to-transparent sm:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--color-bg)] to-transparent sm:w-32" />
          <div className="flex w-max marquee gap-4 pr-4 sm:gap-6 sm:pr-6">
            {loop.map((q, i) => (
              <figure
                key={i}
                className="w-[280px] shrink-0 rounded-2xl border border-[var(--color-line)] bg-[var(--color-card)]/40 p-5 backdrop-blur-sm sm:w-[420px] sm:p-7"
              >
                <span aria-hidden className="font-serif text-3xl text-[var(--color-accent)]/40">
                  "
                </span>
                <blockquote className="mt-2 font-serif text-base leading-[1.5] italic sm:text-lg sm:leading-[1.45]">
                  {q.quote}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 sm:mt-6">
                  <span
                    aria-hidden
                    className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-card)] font-serif text-sm text-[var(--color-accent)]"
                  >
                    {q.author[0]}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{q.author}</span>
                    <span className="text-xs text-[var(--color-fg-soft)]">
                      {q.role}
                    </span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
