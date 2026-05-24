/**
 * Pequenas réplicas estilizadas das telas do app — usadas dentro de PhoneFrame
 * para ilustrar visualmente cada pilar. Tudo HTML/CSS, sem screenshots.
 */

export function MentorPreview() {
  return (
    <div className="flex h-full w-full flex-col bg-[var(--color-sumi)] p-4 text-[var(--color-bone)]">
      <div className="pt-3 text-center font-serif text-[15px] italic text-[var(--color-bone-soft)]">
        Mentor
      </div>
      <div className="mt-4 h-px w-full bg-[var(--color-sumi-line)]" />
      <div className="mt-5 space-y-3">
        <div className="text-[8px] uppercase tracking-[0.18em] text-[var(--color-bone-soft)]">
          VOCÊ
        </div>
        <div className="text-[11px] leading-snug">
          Hoje custou começar. Acordei tarde.
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <div className="text-[8px] uppercase tracking-[0.18em] text-[var(--color-copper-glow)]">
          MENTOR
        </div>
        <div className="rounded-2xl bg-[var(--color-sumi-card)] p-3 font-serif text-[12px] italic leading-snug text-[var(--color-bone)]">
          O atraso de hoje não apaga o ritmo da semana. Comece do silêncio — só isso.
        </div>
      </div>
      <div className="mt-auto flex items-center gap-2 rounded-full border border-[var(--color-sumi-line)] px-3 py-2 text-[10px] text-[var(--color-bone-soft)]">
        Escreva...
      </div>
    </div>
  );
}

export function DojoPreview() {
  const praticas = [
    { name: "Cinco minutos de silêncio", done: true, days: 6 },
    { name: "Leitura · 15 min", done: true, days: 4 },
    { name: "Caminhada após almoço", done: false, days: 3 },
    { name: "Sem celular antes das 9h", done: true, days: 7 },
    { name: "Diário antes de dormir", done: false, days: 2 },
  ];
  return (
    <div className="flex h-full w-full flex-col bg-[var(--color-sumi)] p-4 text-[var(--color-bone)]">
      <div className="pt-3 text-center font-serif text-[15px] italic text-[var(--color-bone-soft)]">
        Dôjo
      </div>
      <div className="mt-1 text-center text-[9px] uppercase tracking-[0.18em] text-[var(--color-bone-soft)]">
        5 de 5 práticas
      </div>
      <div className="mt-4 h-px w-full bg-[var(--color-sumi-line)]" />
      <div className="mt-3 space-y-2">
        {praticas.map((p, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl bg-[var(--color-sumi-card)] px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <div
                className={`h-3.5 w-3.5 rounded-full border ${
                  p.done
                    ? "border-[var(--color-copper-glow)] bg-[var(--color-copper-glow)]"
                    : "border-[var(--color-bone-soft)]/40"
                }`}
              />
              <div className="text-[10px] leading-tight">{p.name}</div>
            </div>
            <div className="text-[9px] text-[var(--color-bone-soft)]">
              {p.days}d
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function JardimPreview() {
  return (
    <div className="flex h-full w-full flex-col bg-[var(--color-sumi)] p-4 text-[var(--color-bone)]">
      <div className="pt-3 text-center font-serif text-[15px] italic text-[var(--color-bone-soft)]">
        Jardim
      </div>
      <div className="mt-4 h-px w-full bg-[var(--color-sumi-line)]" />
      <div className="mt-5 flex justify-between text-[9px] uppercase tracking-[0.18em]">
        <span className="text-[var(--color-bone-soft)]">Manhã</span>
        <span className="text-[var(--color-copper-glow)]">Tarde</span>
        <span className="text-[var(--color-bone-soft)]">Noite</span>
      </div>
      <div className="mt-3 rounded-2xl border border-[var(--color-sumi-line)] bg-[var(--color-sumi-card)] p-3">
        <div className="text-[9px] uppercase tracking-[0.18em] text-[var(--color-bone-soft)]">
          Reflexão guiada
        </div>
        <div className="mt-2 font-serif text-[14px] leading-snug">
          O que merece sua atenção até o fim do dia?
        </div>
        <div className="mt-3 text-[10px] leading-snug text-[var(--color-bone-soft)]">
          Escreva sem pressa...
        </div>
      </div>
      <div className="mt-auto text-center text-[9px] uppercase tracking-[0.18em] text-[var(--color-bone-soft)]">
        Reflexões anteriores
      </div>
    </div>
  );
}

export function CartaPreview() {
  return (
    <div className="flex h-full w-full flex-col bg-[var(--color-sumi)] p-4 text-[var(--color-bone)]">
      <div className="pt-3 text-center font-serif text-[15px] italic text-[var(--color-bone-soft)]">
        Biblioteca
      </div>
      <div className="mt-4 h-px w-full bg-[var(--color-sumi-line)]" />
      <div className="mt-4 rounded-2xl border border-[var(--color-copper-glow)]/30 bg-[var(--color-sumi-card)] p-3">
        <div className="flex items-center justify-between">
          <div className="text-[9px] uppercase tracking-[0.18em] text-[var(--color-copper-glow)]">
            Carta do Mentor
          </div>
          <div className="rounded-full bg-[var(--color-copper-glow)] px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.18em] text-[var(--color-sumi)]">
            NOVA
          </div>
        </div>
        <div className="mt-2 font-serif text-[12px] italic leading-snug">
          "Esta semana, três conquistas silenciosas..."
        </div>
        <div className="mt-3 text-[9px] uppercase tracking-[0.18em] text-[var(--color-bone-soft)]">
          Semana de 17 → 23 nov
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {["10 → 16 nov", "03 → 09 nov", "27 out → 02 nov"].map((s) => (
          <div
            key={s}
            className="rounded-xl bg-[var(--color-sumi-card)] px-3 py-2 text-[10px] text-[var(--color-bone-soft)]"
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
