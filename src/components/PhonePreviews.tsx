/**
 * Previews fiéis às telas reais do app Kairo (C:/dev/kairo/lib/telas/*).
 * Cada componente reconstrói em HTML/CSS o layout, tipografia e hierarquia
 * da tela equivalente em Flutter — sem screenshots, sem assets externos.
 *
 * Tokens espelhados de lib/core/kairo_tema.dart:
 *   sumi    #1C1E20   bone    #E5E3DC
 *   card    #24272A   bone-soft #8A8E93
 *   line    #2A2A2A   accent  #D4A373  (cobre iluminado)
 */

import { PhoneStatusBar } from "./PhoneFrame";

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

function MiniEnso({ size = 22, opacity = 0.85 }: { size?: number; opacity?: number }) {
  const r = size * 0.42;
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke="#D4A373"
        strokeOpacity={opacity}
        strokeWidth={Math.max(1.2, size * 0.06)}
        strokeLinecap="round"
        strokeDasharray={`${2 * Math.PI * r * 0.89} ${2 * Math.PI * r}`}
        strokeDashoffset={2 * Math.PI * r * 0.21}
        transform={`rotate(-78 ${c} ${c})`}
      />
    </svg>
  );
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
        {withEnso && <MiniEnso size={26} />}
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
  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Início", icon: <IconHome /> },
    { key: "mentor", label: "Mentor", icon: <IconChat /> },
    { key: "dojo", label: "Dôjo", icon: <IconSelf /> },
    { key: "jardim", label: "Jardim", icon: <IconLeaf /> },
    { key: "biblioteca", label: "Biblioteca", icon: <IconBook /> },
  ];

  return (
    <div className="absolute inset-x-3 bottom-3 z-20">
      <div
        className="rounded-[22px] border border-white/[0.06] px-1 py-1.5 backdrop-blur-xl"
        style={{
          background: "rgba(0,0,0,0.45)",
          boxShadow: "0 6px 24px rgba(0,0,0,0.30)",
        }}
      >
        <div className="flex items-center">
          {tabs.map((t) => {
            const isActive = t.key === active;
            const hasDot = notify.includes(t.key);
            return (
              <div
                key={t.key}
                className="flex flex-1 flex-col items-center gap-[3px] py-[3px]"
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
                    {t.icon}
                  </div>
                  {hasDot && (
                    <span className="absolute -right-1 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#E53935]" />
                  )}
                </div>
                <div
                  className="text-[7px] font-medium leading-none tracking-[0.05em]"
                  style={{
                    color: isActive ? "#D4A373" : "rgba(138,142,147,0.7)",
                  }}
                >
                  {t.label}
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

/* ────────────────────────────────────────────────────────────────────────────
   1) MENTOR — tela de chat sem balões.
   Replica lib/telas/mentor.dart: mensagens do mentor em cobre à esquerda,
   do usuário em texto normal à direita, campo de entrada arredondado.
   ────────────────────────────────────────────────────────────────────────── */
export function MentorPreview() {
  return (
    <div className="relative flex h-full w-full flex-col bg-[var(--color-sumi)]">
      <PhoneStatusBar time="21:04" />
      <ScreenHeader
        title="Mentor"
        caption="Onde estamos hoje?"
        withEnso
      />

      <div className="flex-1 overflow-hidden px-5 pt-4">
        {/* Saudação do Mentor — italic, cor cobre, sem balão */}
        <p className="font-serif text-[11px] italic leading-[1.55] text-[#D4A373]">
          Bem-vindo de volta. O que merece atenção agora?
        </p>

        <div className="mt-5 flex justify-end">
          <p className="max-w-[70%] text-right text-[10.5px] leading-[1.55] text-[var(--color-bone)]">
            Hoje custou começar. Acordei tarde.
          </p>
        </div>

        <div className="mt-5">
          <p className="max-w-[78%] font-serif text-[11px] italic leading-[1.55] text-[#D4A373]">
            O atraso de hoje não apaga o ritmo da semana. Comece do silêncio — só isso.
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

      {/* Campo de entrada — fino, com seta para enviar */}
      <div className="px-5 pb-[68px]">
        <div className="flex items-center justify-between rounded-full border border-[var(--color-sumi-line)] bg-[var(--color-sumi-card)] px-3.5 py-2">
          <span className="text-[10px] text-[var(--color-bone-soft)]">
            Escreva...
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
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   2) DÔJO — práticas + sequência de 7 dias por linha (com pontos).
   Replica lib/telas/dojo.dart: categoria uppercase, nome, duração,
   row de 7 pontos com dia da semana, e card "Escolher prática" no fim.
   ────────────────────────────────────────────────────────────────────────── */
export function DojoPreview() {
  const praticas = [
    {
      cat: "MENTE",
      nome: "Cinco minutos de silêncio",
      dur: "5 min",
      dias: [true, true, false, true, true, true, true],
    },
    {
      cat: "CORPO",
      nome: "Caminhada após o almoço",
      dur: "15 min",
      dias: [false, true, true, false, true, true, true],
    },
    {
      cat: "DISCIPLINA",
      nome: "Diário antes de dormir",
      dur: "",
      dias: [true, false, true, true, false, true, true],
    },
  ];

  const dias = ["S", "T", "Q", "Q", "S", "S", "D"];

  return (
    <div className="relative flex h-full w-full flex-col bg-[var(--color-sumi)]">
      <PhoneStatusBar time="07:42" />

      <div className="px-5 pt-5">
        <GradientTitle>Dôjo</GradientTitle>
        <div className="mt-1 text-[9px] text-[var(--color-bone-soft)]">
          3 práticas ativas
        </div>
        <div className="mt-4">
          <Divider />
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-5 pt-4">
        <div className="space-y-3">
          {praticas.map((p, i) => (
            <div key={i} className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-[7px] font-medium tracking-[0.18em] text-[var(--color-bone-soft)]">
                    {p.cat}
                  </div>
                  <div className="mt-0.5 text-[10.5px] leading-tight text-[var(--color-bone)]">
                    {p.nome}
                  </div>
                  {p.dur && (
                    <div className="text-[8px] text-[var(--color-bone-soft)]">
                      {p.dur}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="text-[var(--color-bone-soft)]"
                  aria-hidden
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-2">
                <div className="text-[7px] font-medium tracking-[0.18em] text-[var(--color-bone-soft)]">
                  ÚLTIMOS 7 DIAS
                </div>
                <div className="mt-1.5 flex gap-2">
                  {p.dias.map((feito, j) => {
                    const eHoje = j === 6;
                    return (
                      <div key={j} className="flex flex-col items-center">
                        <div
                          className="text-[7px] font-medium tracking-wide"
                          style={{
                            color: eHoje ? "#D4A373" : "rgba(138,142,147,0.8)",
                          }}
                        >
                          {dias[j]}
                        </div>
                        <div
                          className="mt-0.5 h-[7px] w-[7px] rounded-full border"
                          style={{
                            background: feito ? "#D4A373" : "transparent",
                            borderColor: feito ? "#D4A373" : "#2A2A2A",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {i < praticas.length - 1 && (
                <div className="mt-3 h-px bg-[var(--color-sumi-line)]" />
              )}
            </div>
          ))}
        </div>

        {/* Card "Adicionar prática" */}
        <div className="mt-3 flex items-center gap-2.5 rounded-2xl border border-[var(--color-sumi-line)] bg-[var(--color-sumi-card)] px-3 py-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="#D4A373"
              strokeOpacity="0.6"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[10px] text-[var(--color-bone)]">
            Escolher uma prática
          </span>
        </div>
      </div>

      <TabBar active="dojo" notify={["jardim", "biblioteca"]} />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   3) JARDIM — pergunta guiada do momento + card de escrita.
   Replica lib/telas/jardim.dart: label "TARDE", pergunta em serif,
   card com ícone de edit e CTA "Escrever".
   ────────────────────────────────────────────────────────────────────────── */
export function JardimPreview() {
  return (
    <div className="relative flex h-full w-full flex-col bg-[var(--color-sumi)]">
      <PhoneStatusBar time="15:18" />

      <div className="px-5 pt-5">
        <GradientTitle>Jardim</GradientTitle>
        <div className="mt-1 text-[9px] text-[var(--color-bone-soft)]">
          Reflexão guiada
        </div>
        <div className="mt-4">
          <Divider />
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-5 pt-4">
        <div className="text-[7.5px] font-medium tracking-[0.18em] text-[#D4A373]">
          TARDE
        </div>
        <p className="mt-2.5 font-serif text-[12px] leading-[1.5] text-[var(--color-bone)]">
          O que merece sua atenção até o fim do dia?
        </p>

        {/* Card "Escrever" */}
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
            Escrever
          </span>
        </div>

        <div className="mt-7 text-[7.5px] font-medium tracking-[0.18em] text-[var(--color-bone-soft)]">
          REFLEXÕES ANTERIORES
        </div>

        <div className="mt-3 space-y-3">
          <ReflexaoItem
            momento="MANHÃ"
            data="HOJE"
            pergunta="Por onde começar com presença?"
            resposta="Pelo café feito devagar — antes do telefone."
          />
          <ReflexaoItem
            momento="NOITE"
            data="ONTEM"
            pergunta="O que foi suficiente hoje?"
            resposta="Ter dito não duas vezes sem culpa."
          />
        </div>
      </div>

      <TabBar active="jardim" notify={["biblioteca"]} />
    </div>
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
  return (
    <div className="relative flex h-full w-full flex-col bg-[var(--color-sumi)]">
      <PhoneStatusBar time="21:08" />

      <div className="px-5 pt-5">
        <GradientTitle>Biblioteca</GradientTitle>
        <div className="mt-1 text-[9px] text-[var(--color-bone-soft)]">
          Estudo de si mesmo
        </div>
        <div className="mt-4">
          <Divider />
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-5 pt-4">
        <div className="text-[7.5px] font-medium tracking-[0.18em] text-[#D4A373]">
          CARTA DO MENTOR
        </div>

        {/* Card da carta — borda cobre, glow se "NOVA" */}
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
              <MiniEnso size={14} />
              <span className="text-[7px] font-medium tracking-[0.18em] text-[#D4A373]">
                SEMANA DE 17 → 23 NOV
              </span>
            </div>
            <span
              className="rounded-[3px] px-1.5 py-0.5 text-[6.5px] font-medium tracking-[0.18em]"
              style={{
                background: "rgba(212,163,115,0.18)",
                color: "#D4A373",
              }}
            >
              NOVA
            </span>
          </div>

          <p className="mt-2 font-serif text-[10.5px] leading-[1.5] text-[var(--color-bone)]">
            Esta semana, três conquistas silenciosas — e um padrão que
            merece atenção...
          </p>

          <div className="mt-2 flex items-center gap-1 text-[8px] text-[#D4A373]">
            Ler carta
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

        {/* Estatísticas — números grandes em serif */}
        <div className="mt-3 text-[7.5px] font-medium tracking-[0.18em] text-[var(--color-bone-soft)]">
          ESTA SEMANA
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="font-serif text-[22px] leading-none text-[var(--color-bone)]">
            12
          </span>
          <span className="font-serif text-[10px] text-[var(--color-bone-soft)]">
            práticas cumpridas
          </span>
        </div>

        <div className="mt-4 h-px bg-[var(--color-sumi-line)]" />

        <div className="mt-3 text-[7.5px] font-medium tracking-[0.18em] text-[var(--color-bone-soft)]">
          SEQUÊNCIAS
        </div>
        <div className="mt-1.5 space-y-1">
          <Seq nome="Cinco minutos de silêncio" streak={7} />
          <Seq nome="Caminhada após o almoço" streak={4} />
        </div>
      </div>

      <TabBar active="biblioteca" notify={["jardim"]} />
    </div>
  );
}

function Seq({ nome, streak }: { nome: string; streak: number }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[9.5px] text-[var(--color-bone)]">{nome}</span>
      <span className="text-[9.5px] text-[#D4A373]">
        {streak}
        <span className="ml-0.5 text-[7px] text-[var(--color-bone-soft)]">
          dias
        </span>
      </span>
    </div>
  );
}
