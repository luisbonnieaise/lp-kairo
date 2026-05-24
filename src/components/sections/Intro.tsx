import { useTranslations } from "next-intl";
import { Section, Kicker } from "../Section";
import { Reveal } from "../Reveal";

export function Intro() {
  const t = useTranslations("intro");
  return (
    <Section className="border-t border-[var(--color-line)] py-24 sm:py-32">
      <div className="grid items-start gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <Reveal>
            <Kicker>{t("kicker")}</Kicker>
          </Reveal>
        </div>
        <div className="md:col-span-9">
          <Reveal delay={0.05}>
            <h2 className="font-serif text-balance text-3xl leading-[1.15] tracking-[-0.01em] sm:text-4xl md:text-5xl">
              {t("title")}
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-[60ch] text-pretty text-lg leading-[1.7] text-[var(--color-fg-soft)] sm:text-xl">
              {t("body")}
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
