"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Enso } from "../Enso";
import { AppStoreButtons } from "../AppStoreButtons";
import { Container } from "../Container";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative isolate overflow-hidden pb-24 pt-36 sm:pt-44 md:pb-32 md:pt-52">
      {/* Ambient ensō glow behind kanji */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
        <Enso size={760} className="opacity-30" />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-[28%] -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full orb-breath"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 70%)",
        }}
      />

      <Container>
        <div className="flex flex-col items-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--color-accent)]"
          >
            {t("eyebrow")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 font-jp text-[110px] font-medium leading-[0.9] tracking-[0.08em] text-[var(--color-accent)] sm:text-[160px]"
            aria-hidden
          >
            回路
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 max-w-[14ch] text-balance font-serif text-4xl leading-[1.05] tracking-[-0.015em] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {t("title1")}
            <br />
            <span className="text-copper-gradient italic">{t("title2")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-2xl text-pretty text-base leading-[1.7] text-[var(--color-fg-soft)] sm:text-lg"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <AppStoreButtons />
            <p className="font-sans text-xs uppercase tracking-[0.18em] text-[var(--color-fg-soft)]">
              {t("available")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 grid w-full max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-3"
          >
            <Stat n="95%" label={t("metricUsers")} />
            <Stat n="1.2M+" label={t("metricPractices")} />
            <Stat n="48k+" label={t("metricLetters")} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 1.4 }}
            className="mt-16 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[var(--color-fg-soft)]"
          >
            <span className="block h-px w-8 bg-[var(--color-fg-soft)]/40" />
            {t("scrollHint")}
            <span className="block h-px w-8 bg-[var(--color-fg-soft)]/40" />
          </motion.p>
        </div>
      </Container>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-[var(--color-bg)] px-6 py-7">
      <div className="font-serif text-3xl text-copper-gradient sm:text-4xl">
        {n}
      </div>
      <div className="text-pretty text-center text-xs leading-[1.5] text-[var(--color-fg-soft)] sm:text-[13px]">
        {label}
      </div>
    </div>
  );
}
