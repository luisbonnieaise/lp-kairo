// POST /api/checkout — cria a Stripe Checkout Session (assinatura, trial 7d).
//
// Checkout-first: SEM login. O visitante clica e cai direto no Stripe Checkout;
// o e-mail é coletado pelo próprio Stripe. É por esse e-mail que o
// stripe-webhook vincula a assinatura à conta: concede na hora se a conta já
// existe, senão guarda pendente e o trigger de signup reconcilia (ver
// kairos/scripts/13_checkout_first_email.sql). A página /sucesso instrui a
// usar o MESMO e-mail no app.
//
// Price ids e secret key são envs SERVER-SIDE (sem NEXT_PUBLIC) — nunca
// chegam ao bundle do client.
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { routing } from "@/i18n/routing";
import {
  localeCurrency,
  siteConfig,
  type BillingPeriod,
  type Currency,
} from "@/lib/utils";

// Versão pinada pelo SDK stripe@17.7 (o stripe-webhook no Supabase pina a
// dele; a Stripe entrega eventos na versão configurada no endpoint).
const STRIPE_API_VERSION = "2025-02-24.acacia";

// price id por (moeda, período), resolvido só no server.
const priceIds: Record<Currency, Record<BillingPeriod, string | undefined>> = {
  BRL: {
    monthly: process.env.STRIPE_PRICE_BRL_MONTHLY,
    yearly: process.env.STRIPE_PRICE_BRL_YEARLY,
  },
  USD: {
    monthly: process.env.STRIPE_PRICE_USD_MONTHLY,
    yearly: process.env.STRIPE_PRICE_USD_YEARLY,
  },
  EUR: {
    monthly: process.env.STRIPE_PRICE_EUR_MONTHLY,
    yearly: process.env.STRIPE_PRICE_EUR_YEARLY,
  },
};

// Locale do Checkout hospedado da Stripe (pt vira pt-BR).
const stripeLocale: Record<string, Stripe.Checkout.SessionCreateParams.Locale> =
  { pt: "pt-BR", en: "en", es: "es", de: "de" };

function erro(status: number, code: string) {
  return NextResponse.json({ error: code }, { status });
}

export async function POST(req: Request) {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      console.error("checkout: STRIPE_SECRET_KEY ausente");
      return erro(500, "checkout_erro");
    }

    // ── 1. Corpo: período + locale (moeda vem do locale, como no Pricing) ──
    let body: { period?: string; locale?: string };
    try {
      body = await req.json();
    } catch {
      return erro(400, "corpo_invalido");
    }

    const period: BillingPeriod | null =
      body.period === "monthly" || body.period === "yearly"
        ? body.period
        : null;
    if (!period) return erro(400, "periodo_invalido");

    const locale = (routing.locales as readonly string[]).includes(
      body.locale ?? "",
    )
      ? (body.locale as string)
      : routing.defaultLocale;

    const currency = localeCurrency[locale] ?? "USD";
    const priceId = priceIds[currency][period];
    if (!priceId) {
      console.error(`checkout: STRIPE_PRICE_${currency}_${period} ausente`);
      return erro(500, "checkout_erro");
    }

    const stripe = new Stripe(stripeSecret, {
      apiVersion: STRIPE_API_VERSION,
    });

    // ── 2. Checkout Session ────────────────────────────────────────────────
    // URLs de retorno na própria LP (pt sem prefixo, demais com /{locale}).
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    const successUrl = `${siteConfig.url}${prefix}/sucesso?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${siteConfig.url}${prefix}/#pricing`;

    // Sem customer prévio: em mode:'subscription' a Stripe cria o Customer com
    // o e-mail digitado no Checkout — é o elo que o webhook usa pra achar a
    // conta. trial 7d = período de teste com cobrança agendada.
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { trial_period_days: 7 },
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
      locale: stripeLocale[locale] ?? "auto",
    });

    if (!session.url) {
      console.error("checkout: session criada sem url", session.id);
      return erro(500, "checkout_erro");
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    // Nunca devolver detalhe de erro ao client (pode conter ids/segredos).
    console.error("checkout: erro interno:", (e as Error).message);
    return erro(500, "checkout_erro");
  }
}
