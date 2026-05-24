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

      <div className="mt-28 flex flex-col gap-28 sm:mt-36 sm:gap-36">
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
          "grid items-center gap-12 md:grid-cols-2 md:gap-20",
          reversed && "md:[&>*:first-child]:order-2",
        )}
      >
        <Reveal className={cn("flex justify-center", reversed ? "md:justify-start" : "md:justify-end")}>
          <div className="relative">
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

        <div className={cn(reversed ? "md:pl-0" : "md:pl-0")}>
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="font-serif text-5xl italic text-[var(--color-accent)]/40 sm:text-6xl">
                {t("n")}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--color-accent)]">
                {t("tag")}
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h3 className="mt-5 font-serif text-3xl leading-[1.1] tracking-[-0.01em] sm:text-4xl md:text-5xl">
              {t("title")}
            </h3>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[52ch] text-pretty text-base leading-[1.7] text-[var(--color-fg-soft)] sm:text-lg">
              {t("body")}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-6 inline-flex items-start gap-3 border-l border-[var(--color-accent)]/40 pl-4 font-serif text-[15px] italic leading-[1.55] text-[var(--color-fg)]">
              {t("highlight")}
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
