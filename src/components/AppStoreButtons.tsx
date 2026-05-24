import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/utils";

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.07-.32-.07-.6 0-1.15.563-2.26 1.293-3.06.74-.84 2.05-1.49 2.99-1.55l.25-.01zm4.565 17.385c-.45 1.07-.66 1.55-1.24 2.48-.81 1.3-1.97 2.92-3.4 2.93-1.27.01-1.59-.85-3.32-.85-1.73 0-2.08.83-3.36.85-1.42.02-2.5-1.43-3.31-2.73-2.27-3.65-2.5-7.92-1.1-10.21.96-1.58 2.5-2.5 3.93-2.5 1.45 0 2.36.83 3.55.83 1.16 0 1.86-.83 3.54-.83 1.27 0 2.62.7 3.58 1.9-3.14 1.74-2.62 6.25.13 8.13z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path
        fill="currentColor"
        d="M3.6 1.34a1.94 1.94 0 0 0-.46 1.3v18.72c0 .51.18.96.46 1.3l10.6-10.66L3.6 1.34zm12.07 8.45 2.97 1.71c.93.54.93 1.87 0 2.4l-2.97 1.71-3.7-3.71 3.7-2.11zM4.66 22.96l11.5-6.56-3.36-3.37L4.66 22.96zM4.66.7l8.14 9.97 3.36-3.37L4.66.7z"
      />
    </svg>
  );
}

export function AppStoreButtons({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const isLarge = size === "md";
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <a
        href={siteConfig.appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group inline-flex items-center gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-fg)]/[0.03] backdrop-blur-sm transition-all duration-500 ease-[var(--ease-out-zen)] hover:border-[var(--color-accent)]/60 hover:bg-[var(--color-card)]",
          isLarge ? "px-5 py-3" : "px-4 py-2.5",
        )}
      >
        <AppleIcon />
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-soft)]">
            Download on the
          </span>
          <span className="font-sans text-base font-semibold">App Store</span>
        </span>
      </a>
      <a
        href={siteConfig.playStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group inline-flex items-center gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-fg)]/[0.03] backdrop-blur-sm transition-all duration-500 ease-[var(--ease-out-zen)] hover:border-[var(--color-accent)]/60 hover:bg-[var(--color-card)]",
          isLarge ? "px-5 py-3" : "px-4 py-2.5",
        )}
      >
        <PlayIcon />
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-soft)]">
            Get it on
          </span>
          <span className="font-sans text-base font-semibold">Google Play</span>
        </span>
      </a>
    </div>
  );
}
