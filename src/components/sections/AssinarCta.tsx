"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../Button";
import { criarSupabaseBrowser } from "@/lib/supabase/client";

type Period = "monthly" | "yearly";

// CTA de assinatura com gate de login Supabase (Fase 07):
//   • sem sessão → abre login leve (magic link / Google) no estilo da LP;
//   • com sessão → POST /api/checkout e redireciona ao Stripe Checkout.
// A identidade é a MESMA do app Flutter (mesmos providers no Supabase).
export function AssinarCta({ period, label }: { period: Period; label: string }) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [aberto, setAberto] = useState(false);
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function redirectTo() {
    const destino =
      typeof window !== "undefined"
        ? window.location.pathname + "#pricing"
        : "/#pricing";
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(destino)}`;
  }

  async function irParaCheckout() {
    setCarregando(true);
    setErro(null);
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period, locale }),
      });
      if (r.status === 401) {
        // Sessão expirou entre o gate e o POST — reabre o login.
        setAberto(true);
        setCarregando(false);
        return;
      }
      const data = (await r.json()) as { url?: string; error?: string };
      if (!r.ok || !data.url) throw new Error(data.error ?? "checkout_erro");
      window.location.href = data.url;
    } catch {
      setErro(t("erroCheckout"));
      setCarregando(false);
    }
  }

  async function aoClicar() {
    const supabase = criarSupabaseBrowser();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setAberto(true);
      return;
    }
    await irParaCheckout();
  }

  async function enviarMagicLink() {
    if (!email) return;
    setCarregando(true);
    setErro(null);
    const supabase = criarSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo() },
    });
    setCarregando(false);
    if (error) {
      setErro(t("erroLogin"));
      return;
    }
    setEnviado(true);
  }

  async function loginGoogle() {
    const supabase = criarSupabaseBrowser();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo() },
    });
  }

  return (
    <>
      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={carregando}
        onClick={aoClicar}
      >
        {label}
      </Button>

      <AnimatePresence>
        {aberto && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAberto(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              className="w-full max-w-sm rounded-3xl border border-[var(--color-line)] bg-[var(--color-card)] p-8"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-2xl">{t("entrar")}</h3>
              <p className="mt-2 text-sm text-[var(--color-fg-soft)]">
                {t("explicacao")}
              </p>

              {enviado ? (
                <p className="mt-6 text-[15px] text-[var(--color-accent)]">
                  {t("linkEnviado")}
                </p>
              ) : (
                <div className="mt-6 flex flex-col gap-3">
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={t("emailLabel")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] px-4 text-[15px] outline-none focus:border-[var(--color-accent)]"
                  />
                  <Button
                    type="button"
                    size="md"
                    disabled={carregando || !email}
                    onClick={enviarMagicLink}
                  >
                    {t("enviarLink")}
                  </Button>
                  <div className="flex items-center gap-3 text-xs text-[var(--color-fg-soft)]">
                    <span className="h-px flex-1 bg-[var(--color-line)]" />
                    {t("ou")}
                    <span className="h-px flex-1 bg-[var(--color-line)]" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={loginGoogle}
                  >
                    {t("google")}
                  </Button>
                </div>
              )}

              {erro && (
                <p className="mt-4 text-sm text-red-400">{erro}</p>
              )}

              <button
                type="button"
                onClick={() => setAberto(false)}
                className="mt-6 w-full text-center text-xs text-[var(--color-fg-soft)] hover:text-[var(--color-fg)]"
              >
                {t("fechar")}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
