"use client";

// CTA de assinatura — checkout-first (doc 07, revisão 2026-06): clica e cai
// direto no Stripe Checkout, SEM login. O e-mail é coletado pelo próprio
// Stripe; o stripe-webhook vincula a assinatura à conta por esse e-mail e a
// página /sucesso instrui a usar o mesmo e-mail no app. (O antigo gate de
// login por OTP foi removido — não havia mais nada a autenticar aqui.)
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Button } from "./Button";
import { cn, type BillingPeriod } from "@/lib/utils";

export function CheckoutButton({
  period,
  className,
  children,
}: {
  period: BillingPeriod;
  className?: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("auth");
  const locale = useLocale();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period, locale }),
      });
      if (!res.ok) throw new Error("checkout_erro");
      const { url } = (await res.json()) as { url: string };
      // Mantém o spinner até a navegação para o Stripe.
      window.location.assign(url);
    } catch {
      setError(t("errorCheckout"));
      setBusy(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        size="lg"
        className={cn("w-full", className)}
        disabled={busy}
        onClick={onClick}
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </Button>
      {error && (
        <p role="alert" className="mt-3 text-center text-xs text-red-400">
          {error}
        </p>
      )}
    </>
  );
}
