import { NextResponse } from "next/server";
import Stripe from "stripe";
import { criarSupabaseServer } from "@/lib/supabase/server";
import { localeCurrency, type BillingPeriod, type Currency } from "@/lib/utils";

// Rota de checkout server-side (Fase 07). Substitui os Payment Links estáticos:
// cria uma Checkout Session amarrada à IDENTIDADE Supabase do usuário (a mesma
// do app Flutter), com trial de 7 dias e moeda pelo locale. Segredos (secret
// key e price ids) ficam SÓ no servidor — nunca com prefixo NEXT_PUBLIC.

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-05-27.dahlia",
});

// Resolve o price id por (moeda, período) a partir de envs server-side.
function precoId(currency: Currency, period: BillingPeriod): string | undefined {
  const chave = `STRIPE_PRICE_${currency}_${period.toUpperCase()}`;
  return process.env[chave];
}

// locale do app → locale aceito pelo Stripe Checkout.
const stripeLocale: Record<string, Stripe.Checkout.SessionCreateParams.Locale> = {
  pt: "pt-BR",
  en: "en",
  es: "es",
  de: "de",
};

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY ausente");
      return NextResponse.json({ error: "checkout_erro" }, { status: 500 });
    }

    const supabase = await criarSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "nao_autorizado" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as {
      period?: BillingPeriod;
      locale?: string;
    };
    const period: BillingPeriod = body.period === "yearly" ? "yearly" : "monthly";
    const locale = body.locale && stripeLocale[body.locale] ? body.locale : "pt";
    const currency = localeCurrency[locale] ?? "USD";

    const price = precoId(currency, period);
    if (!price) {
      console.error(`Price id ausente p/ ${currency} ${period}`);
      return NextResponse.json({ error: "checkout_erro" }, { status: 500 });
    }

    // ── Customer idempotente por supabase_user_id (sem service role) ────────
    let customerId: string | undefined;
    const busca = await stripe.customers.search({
      query: `metadata['supabase_user_id']:'${user.id}'`,
      limit: 1,
    });
    if (busca.data.length > 0) {
      customerId = busca.data[0].id;
    } else {
      const novo = await stripe.customers.create(
        {
          email: user.email ?? undefined,
          metadata: { supabase_user_id: user.id },
        },
        { idempotencyKey: `customer:${user.id}` },
      );
      customerId = novo.id;
    }

    // ── Checkout Session ────────────────────────────────────────────────────
    const origem = new URL(request.url).origin;
    const base = locale === "pt" ? "" : `/${locale}`;
    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        customer: customerId,
        line_items: [{ price, quantity: 1 }],
        client_reference_id: user.id,
        subscription_data: {
          trial_period_days: 7,
          metadata: { supabase_user_id: user.id },
        },
        allow_promotion_codes: true,
        locale: stripeLocale[locale],
        success_url: `${origem}${base}?checkout=sucesso`,
        cancel_url: `${origem}${base}?checkout=cancelado#pricing`,
      },
      // Anti duplo-clique: mesma combinação user+price devolve a mesma session.
      { idempotencyKey: `checkout:${user.id}:${price}` },
    );

    if (!session.url) {
      console.error("Session sem url:", session.id);
      return NextResponse.json({ error: "checkout_erro" }, { status: 502 });
    }
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("/api/checkout erro:", (e as Error).message);
    return NextResponse.json({ error: "checkout_erro" }, { status: 502 });
  }
}
