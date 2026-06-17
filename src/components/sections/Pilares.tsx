"use client";

import { useTranslations } from "next-intl";
import { Section, Kicker, H2, Lead } from "../Section";
import { Reveal } from "../Reveal";
import { PhoneFrame } from "../PhoneFrame";
import {
  MentorPreview,
  DojoPreview,
  JardimPreview,
  CartaPreview,
} from "../PhonePreviews";
import { cn } from "@/lib/utils";

const KEYS = ["mentor", "dojo", "jardim", "carta"] as const;
const PREVIEW: Record<(typeof KEYS)[number], React.ReactNode> = {
  mentor: <MentorPreview />,
  dojo: <DojoPreview />,
  jardim: <JardimPreview />,
  carta: <CartaPreview />,
};

export function Pilares() {
  const t = useTranslations("pilares");

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

      <div className="mt-20 flex flex-col gap-24 sm:mt-28 sm:gap-28 md:mt-36 md:gap-36">
        {KEYS.map((key, i) => (
          <Pilar key={key} k={key} index={i} preview={PREVIEW[key]} />
        ))}
      </div>
    </Section>
  );
}

function Pilar({
  k,
  index,
  preview,
}: {
  k: (typeof KEYS)[number];
  index: number;
  preview: React.ReactNode;
}) {
  const t = useTranslations(`pilares.${k}`);
  const reversed = index % 2 === 1;

  return (
    <div id={k} className="scroll-mt-32">
      <div
        className={cn(
          "grid items-center gap-10 md:grid-cols-2 md:gap-20",
          reversed && "md:[&>*:first-child]:order-2",
        )}
      >
        <Reveal
          className={cn(
            "order-2 flex justify-center md:order-none",
            reversed ? "md:justify-start" : "md:justify-end",
          )}
        >
          <div className="relative w-full max-w-[300px]">
            <div
              aria-hidden
              className="absolute -inset-12 -z-10 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 70%)",
              }}
            />
            <PhoneFrame>{preview}</PhoneFrame>
          </div>
        </Reveal>

        <div className="order-1 md:order-none md:pl-0">
          <Reveal>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="font-serif text-4xl italic leading-none text-[var(--color-accent)]/40 sm:text-5xl md:text-6xl">
                {t("n")}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--color-accent)] sm:text-[11px] sm:tracking-[0.32em]">
                {t("tag")}
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h3 className="mt-4 font-serif text-[26px] leading-[1.12] tracking-[-0.01em] sm:mt-5 sm:text-3xl md:text-4xl lg:text-5xl">
              {t("title")}
            </h3>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-[52ch] text-pretty text-[15px] leading-[1.65] text-[var(--color-fg-soft)] sm:mt-6 sm:text-base sm:leading-[1.7] md:text-lg">
              {t("body")}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-5 inline-flex items-start gap-3 border-l border-[var(--color-accent)]/40 pl-4 font-serif text-[14px] italic leading-[1.55] text-[var(--color-fg)] sm:mt-6 sm:text-[15px]">
              {t("highlight")}
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
