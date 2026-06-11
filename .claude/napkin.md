# Napkin — lp-kairo

## Contexto do projeto
- Landing page + funil de vendas do app Kairo (app Flutter vive em `~/Documentos/Projetos/kairos`).
- Next.js 15 App Router, Tailwind v4, next-intl (pt default sem prefixo, en/es/de), deploy alvo: Vercel.
- Funil de venda (PROMPTs 7.2/7.3 do doc 07, implementados em jun/2026): CTA do Pricing → `CheckoutButton` (gate de login OTP Supabase) → `POST /api/checkout` (cria Checkout Session com trial 7d, `customer.metadata.supabase_user_id`) → Stripe → `/sucesso`. Premium desbloqueia via `stripe-webhook` no repo `kairos`.
- Envs Stripe são SERVER-SIDE: `STRIPE_SECRET_KEY` + 6 `STRIPE_PRICE_{BRL,USD,EUR}_{MONTHLY,YEARLY}` (nunca NEXT_PUBLIC). Supabase: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Identidade: mesmo `auth.users` do app Flutter (app usa e-mail+senha; LP usa OTP do mesmo provider `email`). O template Magic Link no Supabase precisa de `{{ .Token }}` para o código de 6 dígitos funcionar.
- Setup operacional dos consoles (produto, 6 prices, webhook, secrets): `kairos/docs/08-guia-consoles-luis.md`.

## Comandos
- `npm run typecheck` funciona; `npm run lint` está quebrado (next lint deprecado, sem eslint.config) — não usar.
- `npm run build` é o gate de validação (gera 17 páginas estáticas).

## Pegadinhas
- Métricas do Hero ("95%", "1.2M+", "48k+") estão hardcoded em `src/components/sections/Hero.tsx`, não nos messages.
- Páginas legais (/termos, /privacidade) têm conteúdo só em PT, mas são servidas em todos os locales.
- Mesma contagem de chaves nos 4 `src/messages/*.json` — manter sincronizados ao editar.
