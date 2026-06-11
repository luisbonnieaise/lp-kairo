// POST /api/checkout — cria a Stripe Checkout Session com a identidade do
// usuário logado (substitui os Payment Links estáticos; ver
// kairos/docs/07-billing-multiplataforma.md PROMPT 7.3).
//
// Ancoragem da assinatura: customer.metadata.supabase_user_id +
// subscription_data.metadata.supabase_user_id — é por aí que o Edge Function
// stripe-webhook resolve o usuário e desbloqueia o premium. Sem login, 401.
//
// Price ids e secret key são envs SERVER-SIDE (sem NEXT_PUBLIC) — nunca
// chegam ao bundle do client.
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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

    // ── 1. Sessão Supabase: sem usuário, 401 ───────────────────────────────
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return erro(401, "nao_autenticado");

    // ── 2. Corpo: período + locale (moeda vem do locale, como no Pricing) ──
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

    // ── 3. Customer idempotente, SEM service role ──────────────────────────
    // Busca por metadata.supabase_user_id; se não existe, cria com o e-mail e
    // o metadata que o stripe-webhook usa pra resolver o usuário. A search é
    // eventualmente consistente, então o create leva idempotencyKey derivada
    // do user.id — duplo-clique na janela de defasagem não duplica customer.
    let customerId: string;
    const found = await stripe.customers.search({
      query: `metadata['supabase_user_id']:'${user.id}'`,
      limit: 1,
    });
    if (found.data.length > 0) {
      customerId = found.data[0].id;
    } else {
      const created = await stripe.customers.create(
        {
          email: user.email ?? undefined,
          metadata: { supabase_user_id: user.id },
        },
        { idempotencyKey: `customer_create_${user.id}` },
      );
      customerId = created.id;
    }

    // ── 4. Checkout Session ────────────────────────────────────────────────
    // URLs de retorno na própria LP (pt sem prefixo, demais com /{locale}).
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    const successUrl = `${siteConfig.url}${prefix}/sucesso?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${siteConfig.url}${prefix}/#pricing`;

    // Anti duplo-clique: mesma key → Stripe devolve a MESMA session. O bucket
    // de 10 min evita reaproveitar uma session expirada dias depois (a Stripe
    // cacheia respostas por idempotencyKey por 24h).
    const bucket = Math.floor(Date.now() / 600_000);
    const idempotencyKey = `checkout_${user.id}_${priceId}_${bucket}`;

    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        client_reference_id: user.id,
        subscription_data: {
          metadata: { supabase_user_id: user.id },
          trial_period_days: 7,
        },
        allow_promotion_codes: true,
        success_url: successUrl,
        cancel_url: cancelUrl,
        locale: stripeLocale[locale] ?? "auto",
      },
      { idempotencyKey },
    );

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
