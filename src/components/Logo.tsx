import { cn } from "@/lib/utils";

export function Logo({
  className,
  showKanji = true,
  size = "md",
}: {
  className?: string;
  showKanji?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: { kanji: "text-xs", word: "text-[13px] tracking-[0.32em]" },
    md: { kanji: "text-sm", word: "text-[15px] tracking-[0.36em]" },
    lg: { kanji: "text-base", word: "text-[18px] tracking-[0.4em]" },
  };
  const s = sizes[size];
  return (
    <span className={cn("inline-flex items-center gap-2 select-none", className)}>
      {showKanji && (
        <span
          className={cn(
            "font-jp font-medium text-[var(--color-accent)]",
            s.kanji,
          )}
          aria-hidden
        >
          回路
        </span>
      )}
      <span className={cn("font-sans font-semibold", s.word)}>KAIRO</span>
    </span>
  );
}
