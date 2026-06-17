import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Ensō — a pincelada calligráfica do app (KairoEnso / _EnsoPainterFino,
 * lib/core/kairo_tema.dart). Reproduz o MESMO traço, com as mesmas
 * características: começo fino, barriga grossa em ~30% do arco, fim afilado,
 * abertura no topo-direito, tinta tênue nas pontas e plena na barriga, cor
 * cobre (KC.acento) e rotação contínua horária.
 *
 * Geometria idêntica ao painter:
 *   raio   = 0.44 · ref            (= ref/2 − ref·0.06)
 *   fator  = √(ref / 48)           escala calligráfica do traço
 *   largura(t) = clamp(fator · (0.6 + pico · 1.6), 0.4, 5.0)
 *   alpha(t)   = clamp(0.45 + pico · 0.55, 0, 1)
 *   pico(t)    = t<0.3 ? t/0.3 : 1 − (t−0.3)/0.7      (pico triangular em t=0.3)
 *   arco       = de −1.35 rad por 5.60 rad (~321°)
 *
 * Técnica de desenho: o painter Flutter pinta 80 sub-arcos com `StrokeCap.round`.
 * No tamanho nativo do app (≤120px) os caps se sobrepõem e o traço é liso — mas
 * AMPLIADO para o porte do hero (≈760px) esses 80 caps viram "contas" que o app
 * nunca exibe. Para reproduzir a APARÊNCIA real do app em qualquer tamanho,
 * desenhamos o mesmo traço como uma fita de quadriláteros preenchidos (bordas
 * externa/interna em r ± largura/2), amostrada finamente: a espessura e a tinta
 * variam exatamente pelas fórmulas acima, sem contas e sem emendas.
 *
 * Escala: a geometria é calculada no espaço lógico do app (ref ≤ 120px, o maior
 * tamanho em que o KairoEnso é desenhado — silencio.dart:551) e o `viewBox`
 * amplia vetorialmente até o `size` pedido. Em size ≤ 120 fica idêntico ao app.
 *
 * Rotação contínua (classe `.enso-spin` em globals.css), horária e linear como
 * o `Transform.rotate(angle: ctrl.value · 2π)` do widget. Padrão 8s = `duracao`
 * padrão do KairoEnso.
 */

type EnsoProps = {
  className?: string;
  size?: number;
  /** Cor base do traço. Padrão: --color-accent (cobre, = KC.acento). */
  color?: string;
  /** Habilita rotação contínua. Padrão: true (igual ao app). */
  spin?: boolean;
  /** Duração de uma volta completa, em segundos. Padrão: 8 (igual ao app). */
  duration?: number;
  /** Opacidade global do traço. */
  opacity?: number;
  /** Nº de segmentos da fita. Padrão: 160 (mais que os 80 sub-arcos do app,
   *  para uma fita lisa quando ampliada; o perfil amostrado é o mesmo). */
  steps?: number;
};

// Constantes idênticas ao _EnsoPainterFino (radianos).
const ARC_START = -1.35; // ≈ -77° — abertura no topo-direito
const ARC_SWEEP = 5.6; //   ≈ 321° — varredura do arco

/** Maior tamanho lógico em que o app desenha o ensō (KairoEnso(tamanho: 120)). */
const APP_MAX_SIZE = 120;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function Enso({
  className,
  size = 320,
  color = "var(--color-accent)",
  spin = true,
  duration = 8,
  opacity = 1,
  steps = 160,
}: EnsoProps) {
  // Espaço de desenho: idêntico ao app até 120px; acima disso a geometria de
  // 120px é ampliada pelo viewBox, preservando as proporções da pincelada.
  const ref = Math.min(size, APP_MAX_SIZE);
  const cx = ref / 2;
  const cy = ref / 2;
  const r = ref * 0.44; // (ref/2) - ref*0.06, igual ao app
  const fator = Math.sqrt(ref / 48); // escala calligráfica do traço (sqrt)

  // Ponto sobre o arco de raio `rad` no ângulo `a`.
  const P = (a: number, rad: number) =>
    `${(cx + rad * Math.cos(a)).toFixed(3)} ${(cy + rad * Math.sin(a)).toFixed(3)}`;

  const step = ARC_SWEEP / steps;
  // Pequeno overlap angular entre segmentos vizinhos: cobre a costura de
  // anti-aliasing entre preenchimentos adjacentes (não nas pontas, para manter
  // a abertura nítida).
  const overlap = step * 0.6;

  // Cada segmento é um quad preenchido (borda externa r+w/2, interna r-w/2) com
  // a largura e a opacidade da tinta amostradas no meio do segmento.
  const segmentos = Array.from({ length: steps }, (_, i) => {
    const t = i / steps;
    const t2 = (i + 1) / steps;
    const tm = (t + t2) / 2;

    const pico = tm < 0.3 ? tm / 0.3 : 1 - (tm - 0.3) / 0.7;
    const w = clamp(fator * (0.6 + pico * 1.6), 0.4, 5.0);
    const alpha = clamp(0.45 + pico * 0.55, 0, 1);

    const a0 = ARC_START + ARC_SWEEP * t - (i > 0 ? overlap : 0);
    const a1 = ARC_START + ARC_SWEEP * t2 + (i < steps - 1 ? overlap : 0);

    const d = `M ${P(a0, r + w / 2)} L ${P(a1, r + w / 2)} L ${P(
      a1,
      r - w / 2,
    )} L ${P(a0, r - w / 2)} Z`;

    return { d, alpha: alpha.toFixed(3), key: i };
  });

  const style: CSSProperties | undefined = spin
    ? { animationDuration: `${duration}s` }
    : undefined;

  return (
    <svg
      viewBox={`0 0 ${ref} ${ref}`}
      width={size}
      height={size}
      className={cn(spin && "enso-spin", className)}
      style={style}
      aria-hidden
    >
      <g opacity={opacity}>
        {segmentos.map(({ d, alpha, key }) => (
          <path key={key} d={d} fill={color} fillOpacity={alpha} />
        ))}
      </g>
    </svg>
  );
}
