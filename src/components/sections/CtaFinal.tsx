"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Enso } from "../Enso";
import { AppStoreButtons } from "../AppStoreButtons";
import { Container } from "../Container";

export function CtaFinal() {
  const t = useTranslations("ctaFinal");

  return (
    <section className="relative isolate overflow-hidden border-t border-[var(--color-line)] py-32 sm:py-40 md:py-48">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-40"
      >
        <Enso size={520} duration={24} />
      </div>

      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="font-jp text-6xl text-[var(--color-accent)] sm:text-7xl"
            aria-hidden
          >
            {t("kicker")}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 font-serif text-4xl leading-[1.05] tracking-[-0.015em] sm:text-5xl md:text-6xl"
          >
            {t("title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-md text-pretty text-base leading-[1.7] text-[var(--color-fg-soft)] sm:text-lg"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12"
          >
            <AppStoreButtons />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
