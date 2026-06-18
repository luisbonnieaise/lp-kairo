"use client";

/**
 * Previews fiéis às telas reais do app Kairo (C:/dev/kairo/lib/telas/*).
 * Cada componente reconstrói em HTML/CSS o layout, tipografia e hierarquia
 * da tela equivalente em Flutter — sem screenshots, sem assets externos.
 *
 * Tokens espelhados de lib/core/kairo_tema.dart:
 *   sumi    #1C1E20   bone    #E5E3DC
 *   card    #24272A   bone-soft #8A8E93
 *   line    #2A2A2A   accent  #D4A373  (cobre iluminado)
 *
 * Os textos vêm de messages/<locale>.json → "previews", então o conteúdo
 * dentro do iPhone segue o idioma escolhido na landing.
 */

import { useTranslations } from "next-intl";
import { PhoneStatusBar } from "./PhoneFrame";
import { Enso } from "./Enso";

/* ────────────────────────────────────────────────────────────────────────────
   Primitivos compartilhados — replicam KT.tituloGradiente, KT.divisor,
   KairoEnso e a NavBar do home.dart.
   ────────────────────────────────────────────────────────────────────────── */

function GradientTitle({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-serif text-[20px] font-medium leading-[1.15]"
      style={{
        backgroundImage:
          "linear-gradient(135deg, #A06A3A 0%, #D4A373 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
        paddingBlockEnd: "0.06em",
      }}
    >
      {children}
    </span>
  );
}

function Divider() {
  return (
    <div className="flex flex-col">
      <div className="h-px w-full bg-[var(--color-sumi-line)]" />
      <div
        className="h-[6px] w-full"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.18), transparent)",
        }}
      />
    </div>
  );
}

/**
 * Wrapper local — mantém a API antiga (`size`, `opacity`) e delega ao
 * componente unificado `<Enso>`, garantindo que o mesmo traço calligráfico
 * do app apareça também dentro das previews do iPhone.
 */
function MiniEnso({
  size = 22,
  opacity = 0.85,
  duration = 8,
}: {
  size?: number;
  opacity?: number;
  duration?: number;
}) {
  return <Enso size={size} opacity={opacity} duration={duration} color="#D4A373" />;
}

/* ── Header padrão das telas (gradient title + caption + divisor) ─────────── */
function ScreenHeader({
  title,
  caption,
  withEnso = false,
}: {
  title: string;
  caption: string;
  withEnso?: boolean;
}) {
  return (
    <div className="px-5 pt-5">
      <div className="flex items-center gap-3">
        {/* mentor.dart: KairoEnso(36, alpha 0.75, 12s) — 26px na escala do preview */}
        {withEnso && <MiniEnso size={26} opacity={0.75} duration={12} />}
        <GradientTitle>{title}</GradientTitle>
      </div>
      <div className="mt-1 text-[9px] leading-[1.4] text-[var(--color-bone-soft)]">
        {caption}
      </div>
      <div className="mt-4">
        <Divider />
      </div>
    </div>
  );
}

/* ── Tab bar flutuante (idêntica ao _NavBar do home.dart) ─────────────────── */
type TabKey = "home" | "mentor" | "dojo" | "jardim" | "biblioteca";

function TabBar({
  active,
  notify = [],
}: {
  active: TabKey;
  notify?: TabKey[];
}) {
  const t = useTranslations("previews.tabs");
  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: t("home"), icon: <IconHome /> },
    { key: "mentor", label: t("mentor"), icon: <IconChat /> },
    { key: "dojo", label: t("dojo"), icon: <IconSelf /> },
    { key: "jardim", label: t("jardim"), icon: <IconLeaf /> },
    { key: "biblioteca", label: t("biblioteca"), icon: <IconBook /> },
  ];

  return (
    // px-2 pb-3 = margem interna que reproduz o gap da barra flutuante
    // sem usar position:absolute (evita overflow no iOS quando o conteúdo
    // expande além da altura do PhoneFrame). O padding lateral é enxuto de
    // propósito: em telas estreitas (iPhone em "Display Zoom", ~320px) o
    // PhoneFrame encolhe abaixo de 300px e cada folga conta para os 5 rótulos.
    <div className="shrink-0 px-2 pb-3 pt-2">
      <div
        className="rounded-[22px] border border-white/[0.06] px-1 py-1.5 backdrop-blur-xl"
        style={{
          background: "rgba(0,0,0,0.45)",
          boxShadow: "0 6px 24px rgba(0,0,0,0.30)",
        }}
      >
        <div className="flex items-center">
          {tabs.map((tab) => {
            const isActive = tab.key === active;
            const hasDot = notify.includes(tab.key);
            return (
              // min-w-0 é o que impede a barra de "sair para fora da tela":
              // sem ele cada coluna flex-1 herda min-width:auto e se recusa a
              // encolher abaixo da largura do rótulo (truncate força nowrap),
              // estourando a pill no iOS. Com min-w-0 as colunas dividem o
              // espaço por igual e o truncate vira rede de segurança.
              <div
                key={tab.key}
                className="flex min-w-0 flex-1 flex-col items-center gap-[3px] py-[3px]"
              >
                <div
                  className="h-[1.5px] rounded-full"
                  style={{
                    width: isActive ? 14 : 0,
                    background: "#D4A373",
                    transition: "width .25s",
                  }}
                />
                <div className="relative">
                  <div
                    style={{
                      color: isActive ? "#D4A373" : "rgba(138,142,147,0.7)",
                    }}
                  >
                    {tab.icon}
                  </div>
                  {hasDot && (
                    <span className="absolute -right-1 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#E53935]" />
                  )}
                </div>
                <div
                  className="max-w-full truncate text-[7px] font-medium leading-none tracking-[0.05em]"
                  style={{
                    color: isActive ? "#D4A373" : "rgba(138,142,147,0.7)",
                  }}
                >
                  {tab.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Ícones outlined (estilo Material) ───────────────────────────────────── */
function IconHome() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 11.2 12 5l8 6.2V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-8.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconChat() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4 3v-3H6a2 2 0 0 1-2-2V6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconSelf() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="5.5" r="1.7" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 21c0-4 3-7 7-7s7 3 7 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M5 12c2-1 4-1.5 7-1.5S17 11 19 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconLeaf() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 4c-9 0-15 5-15 12 0 1.6.4 3 1 4 0-6 5-10 12-11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconBook() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H5V4ZM19 4h-4a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h5V4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Wrapper comum: garante h-full, overflow-hidden e a coluna flex que
   mantém StatusBar / Header / Body / TabBar sempre dentro do PhoneFrame. */
function ScreenShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[var(--color-sumi)]">
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   1) MENTOR — tela de chat sem balões.
   Replica lib/telas/mentor.dart: mensagens do mentor em cobre à esquerda,
   do usuário em texto normal à direita, campo de entrada arredondado.
   ────────────────────────────────────────────────────────────────────────── */
export function MentorPreview() {
  const t = useTranslations("previews.mentor");

  return (
    <ScreenShell>
      <PhoneStatusBar time="21:04" />
      <ScreenHeader
        title={t("title")}
        caption={t("caption")}
        withEnso
      />

      <div className="min-h-0 flex-1 overflow-hidden px-5 pt-4">
        <p className="font-serif text-[11px] italic leading-[1.55] text-[#D4A373]">
          {t("greeting")}
        </p>

        <div className="mt-5 flex justify-end">
          <p className="max-w-[70%] text-right text-[10.5px] leading-[1.55] text-[var(--color-bone)]">
            {t("user")}
          </p>
        </div>

        <div className="mt-5">
          <p className="max-w-[78%] font-serif text-[11px] italic leading-[1.55] text-[#D4A373]">
            {t("reply")}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-1.5 opacity-80">
          <MiniEnso size={14} opacity={0.7} />
          <span className="flex gap-0.5">
            <span className="text-[12px] leading-none text-[#D4A373]">·</span>
            <span className="text-[12px] leading-none text-[#D4A373] opacity-60">·</span>
            <span className="text-[12px] leading-none text-[#D4A373] opacity-30">·</span>
          </span>
        </div>
      </div>

      <div className="shrink-0 px-5 pb-2">
        <div className="flex items-center justify-between rounded-full border border-[var(--color-sumi-line)] bg-[var(--color-sumi-card)] px-3.5 py-2">
          <span className="text-[10px] text-[var(--color-bone-soft)]">
            {t("input")}
          </span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 5v14M12 5l-5 5M12 5l5 5"
              stroke="#D4A373"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <TabBar active="mentor" notify={["jardim", "biblioteca"]} />
    </ScreenShell>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   2) DÔJO — práticas + sequência de 7 dias por linha (com pontos).
   Replica lib/telas/dojo.dart: categoria uppercase, nome, duração,
   row de 7 pontos com dia da semana, e card "Escolher prática" no fim.
   ────────────────────────────────────────────────────────────────────────── */
export function DojoPreview() {
  const tp = useTranslations("previews");
  const t = useTranslations("previews.dojo");
  const items = t.raw("items") as { cat: string; name: string; duration: string }[];
  const dias = tp.raw("weekDays") as string[];

  // Mostra as 3 práticas ativas (coerente com o caption "3 práticas ativas"
  // de cada idioma). Cabem com folga na altura do PhoneFrame e dão ao Dôjo a
  // mesma densidade arejada da Biblioteca e do Jardim.
  const visiveis = items.slice(0, 3);
  const padroes: boolean[][] = [
    [true, true, false, true, true, true, true],
    [false, true, true, false, true, true, true],
    [true, false, true, true, false, true, true],
  ];

  return (
    <ScreenShell>
      <PhoneStatusBar time="07:42" />

      <div className="px-5 pt-5">
        <GradientTitle>{t("title")}</GradientTitle>
        <div className="mt-1 text-[9px] text-[var(--color-bone-soft)]">
          {t("caption")}
        </div>
        <div className="mt-4">
          <Divider />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-5 pt-4">
        {visiveis.map((p, i) => (
          <div key={i}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[7.5px] font-medium tracking-[0.2em] text-[#D4A373]/85">
                  {p.cat}
                </div>
                <div className="mt-1 text-[11px] leading-[1.3] text-[var(--color-bone)]">
                  {p.name}
                </div>
                {p.duration && (
                  <div className="mt-1 text-[8.5px] text-[var(--color-bone-soft)]">
                    {p.duration}
                  </div>
                )}
              </div>
              <span
                className="mt-1 shrink-0 text-[var(--color-bone-soft)]/60"
                aria-hidden
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>

            {/* Linha de 7 dias — mais ampla e arejada que antes, com o dia
                de hoje em cobre e os anteriores em cinza suave. */}
            <div className="mt-4 flex items-end justify-between">
              {padroes[i].map((feito, j) => {
                const eHoje = j === 6;
                return (
                  <div key={j} className="flex flex-col items-center gap-1.5">
                    <span
                      className="text-[8px] font-medium leading-none tracking-[0.05em]"
                      style={{
                        color: eHoje
                          ? "#D4A373"
                          : "rgba(138,142,147,0.55)",
                      }}
                    >
                      {dias[j]}
                    </span>
                    <span
                      className="block h-[7px] w-[7px] rounded-full"
                      style={{
                        background: feito ? "#D4A373" : "transparent",
                        border: feito
                          ? "none"
                          : "1px solid rgba(138,142,147,0.35)",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {i < visiveis.length - 1 && (
              <div className="my-5">
                <Divider />
              </div>
            )}
          </div>
        ))}

        {/* Card "Escolher prática" — mesmo padrão do "Escrever" do Jardim
            (ícone circular cobre + label) para a família ficar coerente. */}
        <div className="mt-7 flex items-center gap-3 rounded-2xl border border-[var(--color-sumi-line)] bg-[var(--color-sumi-card)] px-3.5 py-3">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: "rgba(212,163,115,0.10)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="#D4A373"
                strokeOpacity="0.85"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-[10.5px] text-[var(--color-bone)]">
            {t("choose")}
          </span>
        </div>
      </div>

      <TabBar active="dojo" notify={["jardim", "biblioteca"]} />
    </ScreenShell>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   3) JARDIM — pergunta guiada do momento + card de escrita.
   Replica lib/telas/jardim.dart: label "TARDE", pergunta em serif,
   card com ícone de edit e CTA "Escrever".
   ────────────────────────────────────────────────────────────────────────── */
export function JardimPreview() {
  const t = useTranslations("previews.jardim");
  const reflexoes = t.raw("reflections") as {
    moment: string;
    date: string;
    q: string;
    a: string;
  }[];

  return (
    <ScreenShell>
      <PhoneStatusBar time="15:18" />

      <div className="px-5 pt-5">
        <GradientTitle>{t("title")}</GradientTitle>
        <div className="mt-1 text-[9px] text-[var(--color-bone-soft)]">
          {t("caption")}
        </div>
        <div className="mt-4">
          <Divider />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-5 pt-4">
        <div className="text-[7.5px] font-medium tracking-[0.18em] text-[#D4A373]">
          {t("period")}
        </div>
        <p className="mt-2.5 font-serif text-[12px] leading-[1.5] text-[var(--color-bone)]">
          {t("question")}
        </p>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[var(--color-sumi-line)] bg-[var(--color-sumi-card)] px-3.5 py-3">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: "rgba(212,163,115,0.10)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 20h4l10-10-4-4L4 16v4Zm12-14 2-2 4 4-2 2"
                stroke="#D4A373"
                strokeOpacity="0.85"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[10.5px] text-[var(--color-bone)]">
            {t("write")}
          </span>
        </div>

        <div className="mt-7 text-[7.5px] font-medium tracking-[0.18em] text-[var(--color-bone-soft)]">
          {t("previous")}
        </div>

        <div className="mt-3 space-y-3">
          {reflexoes.map((r, i) => (
            <ReflexaoItem
              key={i}
              momento={r.moment}
              data={r.date}
              pergunta={r.q}
              resposta={r.a}
            />
          ))}
        </div>
      </div>

      <TabBar active="jardim" notify={["biblioteca"]} />
    </ScreenShell>
  );
}

function ReflexaoItem({
  momento,
  data,
  pergunta,
  resposta,
}: {
  momento: string;
  data: string;
  pergunta: string;
  resposta: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="text-[7px] font-medium tracking-[0.18em] text-[var(--color-bone-soft)]">
          {momento}
        </span>
        <span className="text-[7px] font-medium tracking-[0.18em] text-[var(--color-bone-soft)]/60">
          {data}
        </span>
      </div>
      <div className="mt-1 text-[8.5px] leading-[1.4] text-[var(--color-bone-soft)]">
        {pergunta}
      </div>
      <div className="mt-1 font-serif text-[10px] italic leading-[1.5] text-[var(--color-bone)]">
        {resposta}
      </div>
      <div className="mt-2 h-px bg-[var(--color-sumi-line)]" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   4) BIBLIOTECA — carta da semana destacada + estatísticas.
   Replica lib/telas/biblioteca.dart: card "Carta do Mentor" com badge NOVA,
   métricas grandes em serif e sequências de cada prática.
   ────────────────────────────────────────────────────────────────────────── */
export function CartaPreview() {
  const t = useTranslations("previews.biblioteca");
  const sequencias = t.raw("sequences") as { name: string; streak: string }[];

  return (
    <ScreenShell>
      <PhoneStatusBar time="21:08" />

      <div className="px-5 pt-5">
        <GradientTitle>{t("title")}</GradientTitle>
        <div className="mt-1 text-[9px] text-[var(--color-bone-soft)]">
          {t("caption")}
        </div>
        <div className="mt-4">
          <Divider />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-5 pt-4">
        <div className="text-[7.5px] font-medium tracking-[0.18em] text-[#D4A373]">
          {t("letterLabel")}
        </div>

        <div
          className="mt-2.5 rounded-xl border p-3"
          style={{
            background: "var(--color-sumi-card)",
            borderColor: "#D4A373",
            borderWidth: "1.2px",
            boxShadow: "0 6px 26px rgba(212,163,115,0.18)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* biblioteca.dart: KairoEnso(24, KC.acento) — cobre sem alpha */}
              <MiniEnso size={14} opacity={1} />
              <span className="text-[7px] font-medium tracking-[0.18em] text-[#D4A373]">
                {t("weekRange")}
              </span>
            </div>
            <span
              className="rounded-[3px] px-1.5 py-0.5 text-[6.5px] font-medium tracking-[0.18em]"
              style={{
                background: "rgba(212,163,115,0.18)",
                color: "#D4A373",
              }}
            >
              {t("new")}
            </span>
          </div>

          <p className="mt-2 font-serif text-[10.5px] leading-[1.5] text-[var(--color-bone)]">
            {t("excerpt")}
          </p>

          <div className="mt-2 flex items-center gap-1 text-[8px] text-[#D4A373]">
            {t("readLetter")}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="#D4A373"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="mt-5">
          <Divider />
        </div>

        <div className="mt-3 text-[7.5px] font-medium tracking-[0.18em] text-[var(--color-bone-soft)]">
          {t("thisWeek")}
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="font-serif text-[22px] leading-none text-[var(--color-bone)]">
            {t("statValue")}
          </span>
          <span className="font-serif text-[10px] text-[var(--color-bone-soft)]">
            {t("statLabel")}
          </span>
        </div>

        <div className="mt-4 h-px bg-[var(--color-sumi-line)]" />

        <div className="mt-3 text-[7.5px] font-medium tracking-[0.18em] text-[var(--color-bone-soft)]">
          {t("streaks")}
        </div>
        <div className="mt-1.5 space-y-1">
          {sequencias.map((s, i) => (
            <Seq key={i} nome={s.name} streak={s.streak} daysLabel={t("daysLabel")} />
          ))}
        </div>
      </div>

      <TabBar active="biblioteca" notify={["jardim"]} />
    </ScreenShell>
  );
}

function Seq({
  nome,
  streak,
  daysLabel,
}: {
  nome: string;
  streak: string;
  daysLabel: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="truncate text-[9.5px] text-[var(--color-bone)]">{nome}</span>
      <span className="shrink-0 text-[9.5px] text-[#D4A373]">
        {streak}
        <span className="ml-0.5 text-[7px] text-[var(--color-bone-soft)]">
          {daysLabel}
        </span>
      </span>
    </div>
  );
}
