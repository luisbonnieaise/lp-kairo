import { useId } from "react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Ensō — a pincelada calligráfica do app (KairoEnso / _EnsoPainterFino,
 * lib/core/kairo_tema.dart), com o mesmo perfil de espessura: começo fino,
 * barriga grossa em 30% do arco, fim afilado, abertura no topo.
 *
 * Em vez dos 80 sub-arcos translúcidos do painter Flutter (que, ampliados,
 * mostram "contas" onde as pontas arredondadas se sobrepõem), o traço aqui
 * é um ÚNICO contorno preenchido: as bordas externa e interna seguem
 * r ± w(t)/2 e as pontas terminam em bico suave de pincel. A variação de
 * tinta (alpha 0.45 → 1.0 ao longo do arco, como no app) vira um degradê
 * linear contínuo — sem emendas, sem pontos.
 *
 * A geometria é calculada no espaço lógico do app (≤ 120px, o maior
 * tamanho em que o KairoEnso é renderizado) e escalada vetorialmente
 * pelo viewBox, preservando as proporções da pincelada em qualquer
 * tamanho decorativo.
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
  /** Opacidade global do traço. */
  opacity?: number;
  /** Nº de amostras do contorno. Padrão: 160. */
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
  steps = 160,
}: EnsoProps) {
  const gradId = useId();

  // Espaço de desenho: idêntico ao app até 120px; acima disso a geometria
  // de 120px é ampliada pelo SVG, preservando as proporções da pincelada.
  const ref = Math.min(size, APP_MAX_SIZE);
  const cx = ref / 2;
  const cy = ref / 2;
  const r = ref * 0.44; // (ref/2) - ref*0.06, igual ao app
  const fator = Math.sqrt(ref / 48); // escala suave do traço (sqrt)

  const px = (a: number, rad: number) => (cx + rad * Math.cos(a)).toFixed(3);
  const py = (a: number, rad: number) => (cy + rad * Math.sin(a)).toFixed(3);

  const outer: string[] = [];
  const inner: string[] = [];
  let wStart = 0;
  let wEnd = 0;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const pico = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
    const w = clamp(fator * (0.6 + pico * 1.6), 0.4, 5.0);
    if (i === 0) wStart = w;
    if (i === steps) wEnd = w;

    const a = ARC_START + ARC_SWEEP * t;
    outer.push(`${px(a, r + w / 2)} ${py(a, r + w / 2)}`);
    inner.push(`${px(a, r - w / 2)} ${py(a, r - w / 2)}`);
  }

  // Pontas em bico de pincel: a curva de fechamento passa por um ponto
  // sobre o círculo, um pouco além do fim do arco — o traço "levanta"
  // do papel em vez de terminar num corte reto.
  const aEnd = ARC_START + ARC_SWEEP + (wEnd / r) * 1.2;
  const aStart = ARC_START - (wStart / r) * 1.2;
  const d = [
    `M ${outer[0]}`,
    `L ${outer.slice(1).join(" L ")}`,
    `Q ${px(aEnd, r)} ${py(aEnd, r)} ${inner[steps]}`,
    `L ${inner.slice(0, -1).reverse().join(" L ")}`,
    `Q ${px(aStart, r)} ${py(aStart, r)} ${outer[0]}`,
    "Z",
  ].join(" ");

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
      <defs>
        {/* Degradê de tinta — segue o perfil de alpha do app: tênue nas
            pontas (topo, 0.45), pleno na barriga (direita, 1.0). Definido
            no espaço do SVG, gira junto com o traço. */}
        <linearGradient id={gradId} x1="30%" y1="0%" x2="95%" y2="65%">
          <stop offset="0%" stopColor={color} stopOpacity={0.45} />
          <stop offset="55%" stopColor={color} stopOpacity={0.8} />
          <stop offset="100%" stopColor={color} stopOpacity={1} />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${gradId})`} opacity={opacity} />
    </svg>
  );
}
