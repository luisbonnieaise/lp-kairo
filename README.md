# lp-kairo

Landing page do **Kairo** — sistema pessoal de evolução. Funil de vendas de produção, pronto para deploy na Vercel.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router, RSC, Turbopack em dev) |
| Estilos | Tailwind CSS v4 com `@theme` tokens |
| Animação | Framer Motion (scroll reveal, stagger, layout) |
| Smooth scroll | Lenis |
| i18n | next-intl (pt / en / es / de) |
| Fontes | Lora (serif), Inter (sans), Noto Serif JP (kanji) — via `next/font` |
| Auth | Supabase (`@supabase/ssr`) — gate de login pré-checkout, OTP por e-mail |
| Checkout | Stripe Checkout Session via rota server-side `/api/checkout` |
| Analytics | `@vercel/analytics` + `@vercel/speed-insights` |
| Deploy | Vercel |

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev      # http://localhost:3000
```

## Scripts

```bash
npm run dev        # dev server (turbopack)
npm run build      # build de produção
npm run start      # serve o build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Estrutura

```
src/
├─ app/
│  ├─ layout.tsx              # html root + fontes + analytics
│  ├─ globals.css             # design tokens Kairo (washi / sumi)
│  ├─ sitemap.ts              # sitemap multi-locale
│  ├─ robots.ts
│  ├─ opengraph-image.tsx     # OG dinâmica em edge runtime
│  ├─ api/checkout/route.ts   # cria a Stripe Checkout Session (server-side)
│  └─ [locale]/
│     ├─ layout.tsx           # provider next-intl + JSON-LD
│     ├─ page.tsx             # composição das seções
│     ├─ sucesso/             # retorno do checkout (noindex)
│     ├─ termos/ · privacidade/
│     └─ not-found.tsx
├─ components/
│  ├─ Header.tsx              # nav sticky com blur, menu mobile
│  ├─ Footer.tsx              # 4 colunas + lang switcher
│  ├─ LangSwitcher.tsx
│  ├─ SmoothScroll.tsx        # Lenis
│  ├─ Reveal.tsx              # wrappers Framer Motion
│  ├─ Button.tsx
│  ├─ Logo.tsx                # KAIRO + kanji 回路
│  ├─ Enso.tsx                # círculo ensō animado
│  ├─ PhoneFrame.tsx          # mockup de iPhone
│  ├─ PhonePreviews.tsx       # mini-réplicas das telas do app
│  ├─ CheckoutButton.tsx      # CTA "Assinar" + modal de login OTP
│  ├─ AppStoreButtons.tsx
│  └─ sections/
│     ├─ Hero.tsx             # 回路 + wordmark + dual CTA + métricas
│     ├─ Intro.tsx
│     ├─ Pilares.tsx          # Mentor / Dôjo / Jardim / Carta
│     ├─ Silencio.tsx         # 4 modos de pausa
│     ├─ Como.tsx             # 4 passos
│     ├─ Depoimentos.tsx      # marquee infinito
│     ├─ Comparar.tsx         # tabela Free × Premium
│     ├─ Pricing.tsx          # toggle mensal/anual com layoutId
│     ├─ Faq.tsx              # accordion com altura animada
│     └─ CtaFinal.tsx
├─ i18n/
│  ├─ routing.ts              # locales: pt (default), en, es, de
│  ├─ navigation.ts
│  └─ request.ts
├─ messages/
│  ├─ pt.json
│  ├─ en.json
│  ├─ es.json
│  └─ de.json
├─ middleware.ts              # next-intl middleware
└─ lib/
   ├─ utils.ts                # cn, siteConfig, localeCurrency
   └─ supabase/               # clients @supabase/ssr (browser + server)
```

## Design system

Espelha o `KC` / `KT` do app Flutter (`C:\dev\kairo\lib\core\kairo_tema.dart`).

| Token | Valor (dark) | Valor (light) |
|---|---|---|
| `--color-bg` | `#1c1e20` sumi | `#f7f4eb` washi |
| `--color-fg` | `#e5e3dc` | `#1e1e1e` |
| `--color-fg-soft` | `#8a8e93` | `#766e65` |
| `--color-accent` | `#d4a373` cobre iluminado | `#c28b63` cobre |
| `--color-card` | `#24272a` | `#efebe0` |
| `--color-line` | `#2a2a2a` | `#e5e1d6` |

O tema default é **dark** (sumi). Para alternar para light, adicione `data-theme="light"` ao `<html>`.

## i18n

Locales: `pt` (default, sem prefixo de URL), `en`, `es`, `de`. Strings ficam em `src/messages/{locale}.json`. URLs canônicas:

- `/` → pt-BR
- `/en`, `/es`, `/de` → demais idiomas

Hreflang/alternates configurados em `[locale]/layout.tsx > generateMetadata`.

## Checkout & Auth (doc 07 do kairos)

Fluxo: CTA "Assinar" → sem sessão Supabase, abre login por **código OTP no
e-mail** → `POST /api/checkout` cria a Checkout Session (trial de 7 dias,
moeda do locale) → Stripe → `/sucesso`. O desbloqueio do premium acontece no
Edge Function `stripe-webhook` (repo `kairos`), que resolve o usuário via
`customer.metadata.supabase_user_id` gravado aqui no checkout.

**Identidade**: quem assina na web é o **mesmo `auth.users`** do app Flutter
(provider `email`). O app usa e-mail+senha; a LP usa OTP do mesmo provider —
a conta é uma só. Requisitos no Supabase Dashboard:

- **Auth → Email** habilitado (já é, por causa do app).
- **Email Templates → Magic Link**: incluir `{{ .Token }}` no corpo para o
  e-mail trazer o código de 6 dígitos que `verifyOtp(type: 'email')` espera.

Price IDs e `STRIPE_SECRET_KEY` são **server-side** (sem `NEXT_PUBLIC`),
resolvidos em `src/app/api/checkout/route.ts`. Setup completo dos consoles
(produto, 6 prices, webhook): `kairos/docs/08-guia-consoles-luis.md`.

## Deploy (Vercel)

1. `vercel link` (ou conecte o repo no dashboard)
2. Defina em **Environment Variables** (ver `.env.example`):
   - `NEXT_PUBLIC_SITE_URL=https://kairoapp.com`
   - `NEXT_PUBLIC_APP_STORE_URL=...` (link real quando publicado)
   - `NEXT_PUBLIC_PLAY_STORE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `STRIPE_SECRET_KEY` + 6 × `STRIPE_PRICE_<MOEDA>_<PERÍODO>`
3. `vercel --prod` — ou push no branch principal.

OG image é gerada em edge runtime (`/opengraph-image`); analytics e speed insights ligam automaticamente.

## TODO antes do go-live

- [ ] Substituir `siteConfig.appStoreUrl` / `playStoreUrl` em `src/lib/utils.ts` ou via env
- [ ] Definir `NEXT_PUBLIC_SITE_URL` em produção
- [ ] Criar produto + 6 prices no Stripe e preencher `STRIPE_*` na Vercel
- [ ] Setar `NEXT_PUBLIC_SUPABASE_ANON_KEY` na Vercel e `{{ .Token }}` no template Magic Link
- [ ] Trocar `metricUsers / metricPractices / metricLetters` por números reais (hoje hardcoded em `Hero.tsx`)
- [ ] Trocar depoimentos placeholder por reais (com consentimento)
- [ ] Revisar preços em USD/EUR nos arquivos de mensagens (BRL definido: 37,90/299)
- [x] Conectar Stripe — checkout server-side com identidade Supabase (PROMPTs 7.2/7.3)
- [x] Páginas de Termos / Privacidade no ar (`/termos`, `/privacidade`)
