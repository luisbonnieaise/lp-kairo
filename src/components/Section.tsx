import { cn } from "@/lib/utils";
import { Container } from "./Container";

export function Section({
  id,
  className,
  containerClassName,
  children,
}: {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("relative py-20 sm:py-28 md:py-36", className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
      {children}
    </p>
  );
}

export function H2({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-serif text-balance text-3xl leading-[1.1] tracking-[-0.01em] sm:text-4xl md:text-5xl",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function Lead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-pretty text-base leading-[1.65] text-[var(--color-fg-soft)] sm:text-lg",
        className,
      )}
    >
      {children}
    </p>
  );
}
