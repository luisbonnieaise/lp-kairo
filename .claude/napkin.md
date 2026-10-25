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
- `npm run build` é o gate de validação (gera 26 páginas estáticas: 4 locales × {home, termos, privacidade, sucesso, suporte} + robots/sitemap/og/api).
- QA visual sem instalar nada no repo: há Chromium headless do Playwright em `~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell`; `npm i playwright-core` no scratchpad e passe `executablePath`. `next start` só serve arquivos de `public/` que existiam no build — para testar um arquivo novo, use `next dev`.

## Pegadinhas
- Mesma contagem de chaves nos 4 `src/messages/*.json` — manter sincronizados ao editar (228 chaves-folha cada desde out/2026, contando arrays como 1).
- **[2026-10-25] Não reserializar os messages com `json.dumps`/`JSON.stringify`**: os blocos de `legal`/`suporte` ficam inline (`{ "type": "p", "text": … }`), e a reserialização reescreve o arquivo inteiro. Do instead: inserir/editar o trecho textualmente e validar com `json.load` + comparação de estrutura entre os 4 idiomas.
- **[2026-10-25] `/suporte` espelha o comportamento real do app `kairos`** (namespace `suporte`, mesmo renderer `LegalBlocks`, agora com `ol`). Do instead: ao mudar o app, revisar o guia; não renomear as âncoras `#video` e `#excluir-conta` (usadas no Play Console); o vídeo vai em `public/videos/kairo-demo.mp4` (a página checa `existsSync` no build).
- **[2026-10-25] Grid + `.prose-legal` com URL longa estoura a coluna no celular** e o `overflow-hidden` do layout esconde (o `scrollWidth` não acusa). Do instead: `min-w-0 break-words` no item do grid; para checar, comparar `getBoundingClientRect().right` dos textos com `innerWidth`.
- Âncoras do Header/Footer são absolutas para a home (`/#mentor`, `/en#mentor`) para funcionarem em termos/privacidade/suporte; na home viram só salto de âncora.
- Páginas legais (/termos, /privacidade) são 100% i18n: o conteúdo vive no namespace `legal` dos messages como blocos estruturados (`h2/p/ul/blockquote/table` + markup inline `**bold**` / `[label](href)`), renderizados por `src/components/legal/LegalBlocks.tsx`. Editar texto legal = editar os JSON, não o TSX. Traduções não-PT trazem a cláusula "versão em português prevalece" (intro tem 1 bloco `p` a mais que o PT).
- NÃO reintroduzir métricas/prova social fabricadas (métricas do hero e aggregateRating do JSON-LD removidos em jul/2026 após rejeição da Apple — o site é a URL de marketing da App Store e o reviewer visita). Depoimentos em `messages` ainda são placeholder — trocar por reais com consentimento antes de dar destaque.
- A política de privacidade deve espelhar exatamente o comportamento do app Flutter (repo `kairos`): IA = Anthropic (chat/carta, recebe perfil do onboarding + reflexões + estatísticas de práticas) e Groq (voz), consentimento prévio in-app, exclusão de conta in-app (Perfil → Excluir conta). Controlador: Pedro Luiz Chagas 11221073664, CNPJ 24.811.306/0001-96.
- NÃO existe `src/app/layout.tsx`. O `<html lang>` (pt-BR/en/es/de via `htmlLang()` em utils), fontes e Analytics vivem em `src/app/[locale]/layout.tsx`, que é o root layout de fato. Um root pass-through quebra em runtime (500: `pages/_document` MODULE_NOT_FOUND) — não recriar.
- OG/Twitter card é localizado por route handler em `src/app/og/route.tsx` servido como `/og?l=<locale>` (fora do matcher do middleware, igual a /api). Não é mais o `opengraph-image.tsx` de convenção.
