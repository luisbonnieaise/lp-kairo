"use client";

import { useTranslations } from "next-intl";
import { Section, Kicker, H2, Lead } from "../Section";
import { Reveal, Stagger, StaggerItem } from "../Reveal";
import { Container } from "../Container";

export function Silencio() {
  const t = useTranslations("silencio");
  const items = t.raw("items") as { title: string; body: string }[];

  return (
    <section
      id="silencio"
      className="relative isolate scroll-mt-32 overflow-hidden border-t border-[var(--color-line)] py-24 sm:py-32 md:py-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, color-mix(in srgb, var(--color-accent) 10%, transparent), transparent 60%)",
        }}
      />

      <Container>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <Kicker>{t("kicker")}</Kicker>
            </Reveal>
            <Reveal delay={0.05}>
              <H2 className="mt-4">{t("title")}</H2>
            </Reveal>
            <Reveal delay={0.15}>
              <Lead className="mt-6">{t("subtitle")}</Lead>
            </Reveal>
          </div>

          <Stagger className="grid gap-4 md:col-span-7 md:grid-cols-2">
            {items.map((it, i) => (
              <StaggerItem key={i}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-card)]/40 p-6 backdrop-blur-sm transition-all duration-500 ease-[var(--ease-out-zen)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-card)]">
                  <div className="font-serif text-2xl italic text-[var(--color-accent)]/30">
                    0{i + 1}
                  </div>
                  <h3 className="mt-4 font-serif text-xl">{it.title}</h3>
                  <p className="mt-2 text-sm leading-[1.6] text-[var(--color-fg-soft)]">
                    {it.body}
                  </p>
                  <div
                    aria-hidden
                    className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 30%, transparent), transparent 70%)",
                    }}
                  />
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
