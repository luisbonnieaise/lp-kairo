// Central de suporte: vídeo de demonstração, guia completo do app, exclusão
// de conta, problemas comuns e contato. É a URL de suporte das lojas — o
// Google Play aponta para cá o vídeo do serviço em primeiro plano (#video) e o
// pedido de exclusão de conta pela web (#excluir-conta), então essas âncoras
// não podem mudar. Todo o texto vive no namespace `suporte` dos messages.
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowUpRight,
  BookOpen,
  CirclePlay,
  LifeBuoy,
  Mail,
  Plus,
} from "lucide-react";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import { Kicker, H2, Lead } from "@/components/Section";
import { ButtonLink } from "@/components/Button";
import { LegalBlocks, type LegalBlock } from "@/components/legal/LegalBlocks";
import { cn, htmlLang, ogLocale } from "@/lib/utils";

type Params = Promise<{ locale: string }>;

type Secao = {
  id: string;
  tag: string;
  title: string;
  lead: string;
  blocks: LegalBlock[];
};
type Problema = { q: string; a: LegalBlock[] };

const EMAIL = "contact@thekairo.app";

// Para publicar o vídeo basta colocar o arquivo em public/videos/ e fazer o
// deploy: a página é estática e confere no build se ele existe (sem o arquivo,
// mostra um aviso no lugar do player). O poster é opcional.
const VIDEO = "/videos/kairo-demo.mp4";
const POSTER = "/videos/kairo-demo.jpg";

function existeEmPublic(caminho: string) {
  return existsSync(join(process.cwd(), "public", caminho));
}

const ATALHOS = [
  { id: "video", Icon: CirclePlay },
  { id: "guia", Icon: BookOpen },
  { id: "problemas", Icon: LifeBuoy },
  { id: "contato", Icon: Mail },
] as const;

const doisDigitos = (n: number) => String(n).padStart(2, "0");

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "suporte" });
  const canonical =
    locale === routing.defaultLocale ? "/suporte" : `/${locale}/suporte`;

  return {
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
    alternates: {
      canonical,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale ? "/suporte" : `/${l}/suporte`,
        ]),
      ),
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: canonical,
      title: t("metaTitle"),
      description: t("metaDescription"),
      siteName: "Kairo",
      locale: ogLocale(locale),
      images: [{ url: `/og?l=${locale}`, width: 1200, height: 630 }],
    },
  };
}

export default async function SuportePage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "suporte" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const tLegal = await getTranslations({ locale, namespace: "legal" });

  const capitulos = t.raw("video.capitulos") as string[];
  const secoes = t.raw("guia.secoes") as Secao[];
  const problemas = t.raw("problemas.itens") as Problema[];
  const inclua = t.raw("contato.inclua") as string[];
  const temVideo = existeEmPublic(VIDEO);
  const temPoster = existeEmPublic(POSTER);

  const mailto = (assunto: string, corpo?: string) =>
    `mailto:${EMAIL}?subject=${encodeURIComponent(assunto)}` +
    (corpo ? `&body=${encodeURIComponent(corpo)}` : "");

  return (
    <article lang={htmlLang(locale)} className="relative pt-32 pb-24 sm:pt-40 sm:pb-32">
      <Container>
        {/* ── Abertura ─────────────────────────────────────────────────── */}
        <header className="mx-auto max-w-2xl text-center">
          <Kicker>{t("kicker")}</Kicker>
          <h1 className="mt-5 text-balance font-serif text-4xl leading-[1.1] tracking-[-0.01em] sm:text-5xl">
            {t("title")}
          </h1>
          <Lead className="mx-auto mt-6 max-w-xl">{t("intro")}</Lead>
        </header>

        <nav
          aria-label={t("atalhosLabel")}
          className="mx-auto mt-12 grid max-w-5xl gap-3 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4"
        >
          {ATALHOS.map(({ id, Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className="group flex gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-card)]/40 p-5 transition-all duration-500 ease-[var(--ease-out-zen)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-card)] lg:flex-col lg:gap-3"
            >
              <Icon
                aria-hidden
                strokeWidth={1.5}
                className="h-5 w-5 shrink-0 text-[var(--color-accent)]"
              />
              <span>
                <span className="block font-serif text-lg leading-[1.3]">
                  {t(`atalhos.${id}.title`)}
                </span>
                <span className="mt-1 block text-sm leading-[1.55] text-[var(--color-fg-soft)]">
                  {t(`atalhos.${id}.body`)}
                </span>
              </span>
            </a>
          ))}
        </nav>

        {/* ── Vídeo de demonstração ────────────────────────────────────── */}
        <section
          id="video"
          className="mt-24 grid scroll-mt-28 items-center gap-12 border-t border-[var(--color-line)] pt-16 sm:mt-32 sm:pt-24 md:grid-cols-12 md:gap-16"
        >
          {/* No celular o vídeo vem logo depois do título (display: contents
              + order); no desktop o texto fica ao lado dele. */}
          <div className="contents md:col-span-7 md:block">
            <div className="order-1">
              <Kicker>{t("video.kicker")}</Kicker>
              <H2 className="mt-4">{t("video.title")}</H2>
              <Lead className="mt-6">{t("video.body")}</Lead>
            </div>
            <div className="order-3 md:mt-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-fg-soft)]">
                {t("video.capitulosLabel")}
              </p>
              <ol className="mt-4 space-y-3">
                {capitulos.map((c, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="font-serif text-sm italic leading-[1.75] text-[var(--color-accent)]/70 tabular-nums">
                      {doisDigitos(i + 1)}
                    </span>
                    <span className="text-[15px] leading-[1.65] text-[var(--color-fg-soft)]">
                      {c}
                    </span>
                  </li>
                ))}
              </ol>
              {temVideo && (
                <a
                  href={VIDEO}
                  target="_blank"
                  rel="noopener"
                  className="mt-8 inline-flex items-center gap-1.5 text-sm text-[var(--color-accent)] underline-offset-4 transition-colors duration-300 hover:text-[var(--color-fg)] hover:underline"
                >
                  {t("video.abrir")}
                  <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="order-2 flex justify-center md:col-span-5">
            <div className="relative w-full max-w-[300px]">
              <div
                aria-hidden
                className="absolute -inset-12 -z-10 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 70%)",
                }}
              />
              <div className="rounded-[40px] border border-[var(--color-line)] bg-[var(--color-bg)] p-2.5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
                {temVideo ? (
                  <video
                    className="block aspect-[9/19.5] w-full rounded-[30px] bg-black object-contain"
                    controls
                    playsInline
                    preload="metadata"
                    poster={temPoster ? POSTER : undefined}
                    aria-label={t("video.aria")}
                  >
                    {/* Sem poster, o #t força o Safari do iOS a mostrar o 1º quadro. */}
                    <source src={temPoster ? VIDEO : `${VIDEO}#t=0.1`} type="video/mp4" />
                    <a href={VIDEO}>{t("video.abrir")}</a>
                  </video>
                ) : (
                  <div className="flex aspect-[9/19.5] w-full flex-col items-center justify-center gap-5 rounded-[30px] bg-[var(--color-card)] p-8 text-center">
                    <CirclePlay
                      aria-hidden
                      strokeWidth={1}
                      className="h-12 w-12 text-[var(--color-accent)]/60"
                    />
                    <p className="text-sm leading-[1.6] text-[var(--color-fg-soft)]">
                      {t("video.emBreve")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Guia do app ──────────────────────────────────────────────── */}
        <section
          id="guia"
          className="mt-24 scroll-mt-28 border-t border-[var(--color-line)] pt-16 sm:mt-32 sm:pt-24"
        >
          <div className="max-w-2xl">
            <Kicker>{t("guia.kicker")}</Kicker>
            <H2 className="mt-4">{t("guia.title")}</H2>
            <Lead className="mt-6">{t("guia.intro")}</Lead>
          </div>

          <nav
            aria-label={t("guia.indice")}
            className="mt-10 rounded-2xl border border-[var(--color-line)] bg-[var(--color-card)]/40 p-5 sm:p-7"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {t("guia.indice")}
            </p>
            <ol className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {secoes.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex items-baseline gap-3 text-[15px] leading-[1.4] text-[var(--color-fg-soft)] transition-colors duration-300 hover:text-[var(--color-fg)]"
                  >
                    <span className="font-serif text-sm italic text-[var(--color-accent)]/70 tabular-nums">
                      {doisDigitos(i + 1)}
                    </span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-12 sm:mt-16">
            {secoes.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-titulo`}
                className="grid scroll-mt-28 gap-6 border-t border-[var(--color-line)] py-12 md:grid-cols-12 md:gap-12 md:py-16"
              >
                <div className="md:col-span-4">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-3xl italic leading-none text-[var(--color-accent)]/40 sm:text-4xl">
                      {doisDigitos(i + 1)}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--color-accent)] sm:text-[11px]">
                      {s.tag}
                    </span>
                  </div>
                  <h3
                    id={`${s.id}-titulo`}
                    className="mt-4 text-balance font-serif text-2xl leading-[1.15] tracking-[-0.01em] sm:text-3xl"
                  >
                    {s.title}
                  </h3>
                  <p className="mt-3 text-pretty text-[15px] leading-[1.65] text-[var(--color-fg-soft)]">
                    {s.lead}
                  </p>
                </div>
                {/* min-w-0 + break-words: URLs longas (links das lojas) não
                    podem alargar a coluna do grid além da tela no celular. */}
                <div className="prose-legal min-w-0 break-words md:col-span-8">
                  <LegalBlocks blocks={s.blocks} />
                </div>
              </section>
            ))}
          </div>
        </section>

        {/* ── Exclusão de conta (link exigido pelo Google Play) ────────── */}
        <section
          id="excluir-conta"
          className="mt-8 grid scroll-mt-28 gap-8 rounded-3xl border border-[var(--color-accent)]/30 bg-[var(--color-card)]/50 p-6 sm:p-10 md:grid-cols-12 md:gap-12"
        >
          <div className="md:col-span-4">
            <Kicker>{t("exclusao.kicker")}</Kicker>
            <h2 className="mt-4 text-balance font-serif text-3xl leading-[1.1] tracking-[-0.01em] sm:text-4xl">
              {t("exclusao.title")}
            </h2>
            <p className="mt-4 text-pretty text-[15px] leading-[1.65] text-[var(--color-fg-soft)]">
              {t("exclusao.lead")}
            </p>
            <ButtonLink
              href={mailto(t("exclusao.assunto"), t("exclusao.corpo"))}
              variant="outline"
              className="mt-6"
            >
              <Mail aria-hidden className="h-4 w-4" />
              {t("exclusao.cta")}
            </ButtonLink>
          </div>
          <div className="prose-legal min-w-0 break-words md:col-span-8">
            <LegalBlocks blocks={t.raw("exclusao.blocks") as LegalBlock[]} />
          </div>
        </section>

        {/* ── Problemas comuns ─────────────────────────────────────────── */}
        <section
          id="problemas"
          className="mt-24 grid scroll-mt-28 gap-10 border-t border-[var(--color-line)] pt-16 sm:mt-32 sm:pt-24 md:grid-cols-12 md:gap-16"
        >
          <div className="md:col-span-4">
            <Kicker>{t("problemas.kicker")}</Kicker>
            <H2 className="mt-4">{t("problemas.title")}</H2>
            <Lead className="mt-6">{t("problemas.lead")}</Lead>
          </div>

          {/* <details> nativo: sem JS, e o Ctrl+F do navegador acha (e abre) as respostas. */}
          <div className="min-w-0 break-words md:col-span-8">
            {problemas.map((p, i) => (
              <details
                key={i}
                className={cn(
                  "group border-b border-[var(--color-line)]",
                  i === 0 && "border-t",
                )}
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                  <span className="font-serif text-lg leading-[1.35] sm:text-xl">
                    {p.q}
                  </span>
                  <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-accent)] transition-transform duration-500 ease-[var(--ease-out-zen)] group-open:rotate-45">
                    <Plus aria-hidden className="h-3.5 w-3.5" />
                  </span>
                </summary>
                <div className="prose-legal max-w-[62ch] pb-7 text-[15px] sm:pr-12">
                  <LegalBlocks blocks={p.a} />
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── Contato ──────────────────────────────────────────────────── */}
        <section id="contato" className="mt-24 scroll-mt-28 sm:mt-32">
          <div className="relative isolate overflow-hidden rounded-3xl border border-[var(--color-line)] bg-[var(--color-card)]/40 px-6 py-14 text-center sm:px-12 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(ellipse 60% 60% at 50% 0%, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 70%)",
              }}
            />
            <Kicker>{t("contato.kicker")}</Kicker>
            <H2 className="mt-4">{t("contato.title")}</H2>
            <Lead className="mx-auto mt-6 max-w-xl">{t("contato.body")}</Lead>
            <ButtonLink
              href={mailto(t("contato.assunto"))}
              size="lg"
              className="mt-8"
            >
              <Mail aria-hidden className="h-4 w-4" />
              {EMAIL}
            </ButtonLink>
            <p className="mt-12 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-fg-soft)]">
              {t("contato.incluaLabel")}
            </p>
            <ul className="mx-auto mt-4 grid max-w-2xl gap-x-8 gap-y-2 text-left text-[15px] leading-[1.6] text-[var(--color-fg-soft)] sm:grid-cols-2">
              {inclua.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden className="text-[var(--color-accent)]">
                    —
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <nav className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link
              href="/"
              className="text-[var(--color-fg-soft)] underline-offset-4 transition-colors duration-300 hover:text-[var(--color-fg)] hover:underline"
            >
              {tLegal("backHome")}
            </Link>
            <Link
              href="/privacidade"
              className="text-[var(--color-accent)] underline-offset-4 transition-colors duration-300 hover:text-[var(--color-fg)] hover:underline"
            >
              {tFooter("links.privacidade")}
            </Link>
            <Link
              href="/termos"
              className="text-[var(--color-accent)] underline-offset-4 transition-colors duration-300 hover:text-[var(--color-fg)] hover:underline"
            >
              {tFooter("links.termos")}
            </Link>
          </nav>
        </section>
      </Container>
    </article>
  );
}
