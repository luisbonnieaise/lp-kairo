import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";

export function LegalPage({
  title,
  updated,
  intro,
  children,
  related,
}: {
  title: string;
  updated: string;
  intro: React.ReactNode;
  children: React.ReactNode;
  related: { href: "/termos" | "/privacidade"; label: string };
}) {
  return (
    <article lang="pt-BR" className="relative pt-32 pb-24 sm:pt-40 sm:pb-32">
      <Container>
        <div className="mx-auto max-w-2xl">
          <header className="border-b border-[var(--color-line)] pb-8">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Kairo · Legal
            </p>
            <h1 className="mt-4 font-serif text-3xl leading-[1.1] tracking-[-0.01em] sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 text-sm text-[var(--color-fg-soft)]">
              Última atualização: {updated}
            </p>
            <div className="mt-6 space-y-2 leading-relaxed text-[var(--color-fg-soft)]">
              {intro}
            </div>
          </header>

          <div className="prose-legal mt-12">{children}</div>

          <nav className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--color-line)] pt-8 text-sm">
            <Link
              href="/"
              className="text-[var(--color-fg-soft)] underline-offset-4 transition-colors duration-300 hover:text-[var(--color-fg)] hover:underline"
            >
              Voltar ao início
            </Link>
            <Link
              href={related.href}
              className="text-[var(--color-accent)] underline-offset-4 transition-colors duration-300 hover:text-[var(--color-fg)] hover:underline"
            >
              {related.label}
            </Link>
          </nav>
        </div>
      </Container>
    </article>
  );
}
