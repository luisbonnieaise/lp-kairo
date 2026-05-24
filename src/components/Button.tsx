import { cn } from "@/lib/utils";
import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium tracking-tight transition-all duration-300 ease-[var(--ease-out-zen)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-fg)] text-[var(--color-bg)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] active:scale-[0.98]",
  outline:
    "border border-[var(--color-line)] bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-card)] hover:border-[var(--color-accent)]/40",
  ghost:
    "text-[var(--color-fg)] hover:text-[var(--color-accent)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-14 px-8 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & CommonProps
>(({ className, variant = "primary", size = "md", children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(base, variants[variant], sizes[size], className)}
    {...props}
  >
    {children}
  </button>
));
Button.displayName = "Button";

export const ButtonLink = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement> & CommonProps
>(({ className, variant = "primary", size = "md", children, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(base, variants[variant], sizes[size], className)}
    {...props}
  >
    {children}
  </a>
));
ButtonLink.displayName = "ButtonLink";
