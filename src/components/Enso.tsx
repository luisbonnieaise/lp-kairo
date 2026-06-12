import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Ensō — porte fiel do widget KairoEnso do app Flutter
 * (lib/core/kairo_tema.dart → _EnsoPainterFino).
 *
 * O traço é montado em 80 sub-arcos pequenos. Em cada um, a largura e a
 * opacidade seguem uma curva de "pico" (cresce até 30% do arco, depois
 * decresce) — é isso que dá o sentido de pincelada calligráfica de tinta
 * sumi, com começo fino, barriga grossa e fim afilado.
 *
 * A geometria é calculada no espaço lógico do app (≤ 120px, o maior
 * tamanho em que o KairoEnso é renderizado — o círculo do Modo Silêncio,
 * silencio.dart) e escalada vetorialmente pelo viewBox. Sem isso, o clamp
 * de 5px do painter achataria a pincelada num fio uniforme nos tamanhos
 * decorativos grandes da landing (520–760px), que o app nunca usa.
 *
 * Rotação contínua (classe `.enso-spin` em globals.css), horária e linear
 * como o Transform.rotate do app. Padrão 8s = `duracao` padrão do widget.
 */

type EnsoProps = {
  className?: string;
  size?: number;
  /** Cor base do traço. Padrão: --color-accent (cobre). */
  color?: string;
  /** Habilita rotação contínua. Padrão: true (igual ao app). */
  spin?: boolean;
  /** Duração de uma volta completa, em segundos. Padrão: 8 (igual ao app). */
  duration?: number;
  /** Multiplicador de opacidade global aplicado a todos os sub-arcos. */
  opacity?: number;
  /** Nº de segmentos do arco. Padrão: 80 (igual ao app). */
  steps?: number;
};

const ARC_START = -1.35; // ≈ -77° em radianos (abertura topo-direito)
const ARC_SWEEP = 5.6; //  ≈ 321° em radianos

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
  steps = 80,
}: EnsoProps) {
  // Espaço de desenho: idêntico ao app até 120px; acima disso a geometria
  // de 120px é ampliada pelo SVG, preservando as proporções da pincelada.
  const ref = Math.min(size, APP_MAX_SIZE);
  const cx = ref / 2;
  const cy = ref / 2;
  const r = ref * 0.44; // (ref/2) - ref*0.06, igual ao app
  const fator = Math.sqrt(ref / 48); // escala suave do traço (sqrt)

  const arcs: { d: string; w: number; a: number }[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const t2 = (i + 1) / steps;

    const pico = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
    const w = clamp(fator * (0.6 + pico * 1.6), 0.4, 5.0);
    const a = clamp(0.45 + pico * 0.55, 0, 1) * opacity;

    const a0 = ARC_START + ARC_SWEEP * t;
    const a1 = ARC_START + ARC_SWEEP * t2;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);

    arcs.push({
      d: `M ${x0.toFixed(3)} ${y0.toFixed(3)} A ${r.toFixed(3)} ${r.toFixed(3)} 0 0 1 ${x1.toFixed(3)} ${y1.toFixed(3)}`,
      w,
      a,
    });
  }

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
      {arcs.map((arc, i) => (
        <path
          key={i}
          d={arc.d}
          fill="none"
          stroke={color}
          strokeOpacity={arc.a}
          strokeWidth={arc.w}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
