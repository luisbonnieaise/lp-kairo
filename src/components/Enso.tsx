import { cn } from "@/lib/utils";

export function Enso({
  className,
  size = 320,
}: {
  className?: string;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.42;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={cn("enso-spin", className)}
      width={size}
      height={size}
      aria-hidden
    >
      <defs>
        <linearGradient id="ensoStroke" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0" />
          <stop offset="30%" stopColor="var(--color-accent)" stopOpacity="0.95" />
          <stop offset="70%" stopColor="var(--color-accent)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="url(#ensoStroke)"
        strokeWidth={size * 0.012}
        strokeLinecap="round"
        strokeDasharray={`${2 * Math.PI * r * 0.89} ${2 * Math.PI * r}`}
        strokeDashoffset={2 * Math.PI * r * 0.21}
        transform={`rotate(-78 ${cx} ${cy})`}
      />
    </svg>
  );
}
