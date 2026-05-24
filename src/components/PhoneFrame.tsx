import { cn } from "@/lib/utils";

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
      <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black/80" />
      <div className="relative h-full w-full overflow-hidden rounded-[34px] bg-[var(--color-sumi)]">
        {children}
      </div>
    </div>
  );
}
