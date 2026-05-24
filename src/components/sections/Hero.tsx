"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Enso } from "../Enso";
import { AppStoreButtons } from "../AppStoreButtons";
import { Container } from "../Container";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative isolate overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-44 md:pb-32 md:pt-52">
      {/* Ambient ensō glow behind kanji */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
        <Enso size={760} className="opacity-30" />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-[28%] -z-10 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full orb-breath sm:h-[420px] sm:w-[420px]"
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
            className="text-balance font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--color-accent)] sm:text-[11px] sm:tracking-[0.32em]"
          >
            {t("eyebrow")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-jp text-[84px] font-medium leading-[0.9] tracking-[0.08em] text-[var(--color-accent)] sm:mt-8 sm:text-[160px]"
            aria-hidden
          >
            回路
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-[18ch] text-balance font-serif text-[34px] leading-[1.08] tracking-[-0.015em] sm:mt-10 sm:max-w-[14ch] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {t("title1")}
            <br />
            <span className="text-copper-gradient italic">{t("title2")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl text-pretty text-[15px] leading-[1.65] text-[var(--color-fg-soft)] sm:mt-7 sm:text-lg sm:leading-[1.7]"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col items-center gap-3 sm:mt-10"
          >
            <AppStoreButtons className="justify-center" />
            <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-soft)] sm:text-xs sm:tracking-[0.18em]">
              {t("available")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-line)] sm:mt-20 sm:grid-cols-3"
          >
            <Stat n="95%" label={t("metricUsers")} />
            <Stat n="1.2M+" label={t("metricPractices")} />
            <Stat n="48k+" label={t("metricLetters")} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 1.4 }}
            className="mt-12 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[var(--color-fg-soft)] sm:mt-16 sm:text-[11px] sm:tracking-[0.32em]"
          >
            <span className="block h-px w-6 bg-[var(--color-fg-soft)]/40 sm:w-8" />
            {t("scrollHint")}
            <span className="block h-px w-6 bg-[var(--color-fg-soft)]/40 sm:w-8" />
          </motion.p>
        </div>
      </Container>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-[var(--color-bg)] px-6 py-6 sm:py-7">
      <div className="font-serif text-[28px] leading-none text-copper-gradient sm:text-4xl">
        {n}
      </div>
      <div className="text-pretty text-center text-[12px] leading-[1.5] text-[var(--color-fg-soft)] sm:text-[13px]">
        {label}
      </div>
    </div>
  );
}
