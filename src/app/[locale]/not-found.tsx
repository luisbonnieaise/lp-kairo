"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="grid min-h-dvh place-items-center px-6 text-center">
      <div className="max-w-md">
        <p className="font-jp text-6xl text-[var(--color-accent)]">空</p>
        <h1 className="mt-6 font-serif text-3xl">{t("title")}</h1>
        <p className="mt-3 text-[var(--color-fg-soft)]">{t("body")}</p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-full border border-[var(--color-line)] px-6 text-sm hover:bg-[var(--color-card)]"
        >
          {t("back")}
        </Link>
      </div>
    </div>
  );
}
