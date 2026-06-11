"use client";

// CTA de assinatura com gate de login (PROMPTs 7.2/7.3 do doc 07).
// Clicou em "Assinar": se já há sessão Supabase, POST /api/checkout e
// redireciona ao Stripe Checkout; se não há (401), abre o login por código
// OTP no e-mail — a MESMA identidade auth.users do app Flutter, que é o que
// permite ao stripe-webhook desbloquear o premium na conta certa.
import { useState, useEffect, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { Button } from "./Button";
import { cn, type BillingPeriod } from "@/lib/utils";

// supabase-js pesa ~65 kB no bundle; só é preciso quando o visitante clica em
// "Assinar" sem sessão. Import dinâmico mantém a landing leve.
async function getSupabase() {
  const { createSupabaseBrowserClient } = await import("@/lib/supabase/client");
  return createSupabaseBrowserClient();
}

type Step = "email" | "code";

const inputClass =
  "h-12 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] px-4 text-[15px] text-[var(--color-fg)] placeholder:text-[var(--color-fg-soft)]/60 transition-colors duration-300 focus:border-[var(--color-accent)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30";

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
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Esc fecha o modal (quando não há requisição em voo).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy]);

  // Tenta criar a Checkout Session; 401 = precisa logar primeiro.
  async function irParaCheckout() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ period, locale }),
    });
    if (res.status === 401) return false;
    if (!res.ok) throw new Error("checkout_erro");
    const { url } = (await res.json()) as { url: string };
    window.location.assign(url);
    return true;
  }

  async function onCtaClick() {
    setBusy(true);
    setError(null);
    try {
      const foi = await irParaCheckout();
      if (!foi) {
        setStep("email");
        setCode("");
        setOpen(true);
      }
    } catch {
      setError(t("errorCheckout"));
    } finally {
      setBusy(false);
    }
  }

  async function enviarCodigo(e?: FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = await getSupabase();
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setBusy(false);
    if (err) {
      setError(t("errorSend"));
      return;
    }
    setStep("code");
  }

  async function confirmarCodigo(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = await getSupabase();
    const { error: err } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: "email",
    });
    if (err) {
      setBusy(false);
      setError(t("errorVerify"));
      return;
    }
    // Logado: segue direto ao checkout sem novo clique.
    try {
      const foi = await irParaCheckout();
      if (foi) return; // redirecionando — mantém o spinner até a navegação
      setError(t("errorCheckout"));
    } catch {
      setError(t("errorCheckout"));
    }
    setBusy(false);
  }

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => !busy && setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("title")}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md rounded-3xl border border-[var(--color-line)] bg-[var(--color-card)] p-8 shadow-2xl sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label={t("close")}
              disabled={busy}
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 rounded-full p-1 text-[var(--color-fg-soft)] transition-colors duration-300 hover:text-[var(--color-fg)] disabled:opacity-40"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {t("kicker")}
            </p>
            <h3 className="mt-3 font-serif text-2xl leading-snug">
              {t("title")}
            </h3>

            {step === "email" ? (
              <>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-soft)]">
                  {t("subtitle")}
                </p>
                <form onSubmit={enviarCodigo} className="mt-6 flex flex-col gap-4">
                  <input
                    type="email"
                    required
                    autoFocus
                    autoComplete="email"
                    placeholder={t("emailPlaceholder")}
                    aria-label={t("emailLabel")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                  <Button type="submit" size="md" disabled={busy || !email}>
                    {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                    {t("sendCode")}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-soft)]">
                  {t("codeSent", { email })}
                </p>
                <form
                  onSubmit={confirmarCodigo}
                  className="mt-6 flex flex-col gap-4"
                >
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    required
                    autoFocus
                    autoComplete="one-time-code"
                    placeholder="······"
                    aria-label={t("codeLabel")}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={cn(
                      inputClass,
                      "text-center font-serif text-xl tracking-[0.5em]",
                    )}
                  />
                  <Button
                    type="submit"
                    size="md"
                    disabled={busy || code.trim().length < 6}
                  >
                    {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                    {t("verify")}
                  </Button>
                </form>
                <div className="mt-4 flex items-center justify-between text-xs text-[var(--color-fg-soft)]">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setStep("email");
                      setCode("");
                      setError(null);
                    }}
                    className="underline-offset-4 transition-colors duration-300 hover:text-[var(--color-fg)] hover:underline disabled:opacity-40"
                  >
                    {t("back")}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => enviarCodigo()}
                    className="underline-offset-4 transition-colors duration-300 hover:text-[var(--color-fg)] hover:underline disabled:opacity-40"
                  >
                    {t("resend")}
                  </button>
                </div>
              </>
            )}

            {error && (
              <p role="alert" className="mt-4 text-sm text-red-400">
                {error}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <Button
        type="button"
        size="lg"
        className={cn("w-full", className)}
        disabled={busy && !open}
        onClick={onCtaClick}
      >
        {busy && !open && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </Button>
      {/* Erro fora do modal (ex.: checkout falhou com sessão já ativa) */}
      {error && !open && (
        <p role="alert" className="mt-3 text-center text-xs text-red-400">
          {error}
        </p>
      )}
      {typeof document !== "undefined" && createPortal(modal, document.body)}
    </>
  );
}
