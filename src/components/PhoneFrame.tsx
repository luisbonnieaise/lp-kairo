import { cn } from "@/lib/utils";

/**
 * Moldura de iPhone usada nos previews da landing.
 * Replica a estrutura visual real do app: status bar, conteúdo e
 * tab bar flutuante "glassmorphic" idêntica ao Pátio do Kairo.
 */
export function PhoneFrame({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19] w-full max-w-[300px] rounded-[44px] border border-[var(--color-line)] bg-[var(--color-bg)] p-[10px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      {/* Dynamic Island */}
      <div className="absolute left-1/2 top-[14px] z-30 h-[18px] w-[78px] -translate-x-1/2 rounded-full bg-black" />

      <div className="relative h-full w-full overflow-hidden rounded-[34px] bg-[var(--color-sumi)]">
        {children}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Bloco status-bar — relógio à esquerda, ícones à direita.
   Fica embaixo do recorte para não competir com o Dynamic Island.
   ────────────────────────────────────────────────────────────────────────── */
export function PhoneStatusBar({ time = "21:04" }: { time?: string }) {
  return (
    <div className="relative z-10 flex items-center justify-between px-6 pt-3 text-[9px] font-medium tracking-wide text-[var(--color-bone)]">
      <span className="tabular-nums">{time}</span>
      <div className="flex items-center gap-1 text-[var(--color-bone)]">
        {/* signal bars */}
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden>
          <rect x="0" y="6" width="2" height="2" rx="0.5" fill="currentColor" />
          <rect x="3" y="4" width="2" height="4" rx="0.5" fill="currentColor" />
          <rect x="6" y="2" width="2" height="6" rx="0.5" fill="currentColor" />
          <rect x="9" y="0" width="2" height="8" rx="0.5" fill="currentColor" />
        </svg>
        {/* wifi */}
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none" aria-hidden>
          <path
            d="M5.5 7.2a0.9 0.9 0 1 0 0-1.8 0.9 0.9 0 0 0 0 1.8Z"
            fill="currentColor"
          />
          <path
            d="M2.4 4.4a4.4 4.4 0 0 1 6.2 0"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M0.6 2.6a7 7 0 0 1 9.8 0"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        {/* battery */}
        <svg width="18" height="8" viewBox="0 0 18 8" fill="none" aria-hidden>
          <rect
            x="0.5"
            y="0.5"
            width="14"
            height="7"
            rx="1.5"
            stroke="currentColor"
            opacity="0.6"
            fill="none"
          />
          <rect x="2" y="2" width="10" height="4" rx="0.5" fill="currentColor" />
          <rect x="15.5" y="3" width="1.5" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
}
