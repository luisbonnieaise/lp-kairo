import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Círculo de respiração — porte fiel do widget _CirculoRespiracao do app
 * Flutter (lib/telas/silencio.dart), o círculo do Modo Silêncio / Reset.
 *
 * No app: anel perfeito com borda de 1.5px em cobre (KC.kin), sem
 * preenchimento, cujo raio anima de 60 a 120 dentro de uma caixa de 200
 * (diâmetro 0.6×–1.2× da caixa). O ritmo é o de uma respiração guiada,
 * assimétrico: inspira em 4s (cresce) e expira em 6s (recolhe), com
 * Curves.easeInOut — ciclo completo de 10s (classe `.breath-circle`
 * em globals.css).
 *
 * Como no <Enso>, a geometria é definida no espaço lógico do app (caixa
 * de 200) e escalada proporcionalmente — incluindo a borda — para que a
 * versão ampliada da landing tenha exatamente a mesma forma.
 */

type CirculoRespiracaoProps = {
  className?: string;
  /** Lado da caixa. 200 = escala 1:1 com o app. */
  size?: number;
};

export function CirculoRespiracao({
  className,
  size = 200,
}: CirculoRespiracaoProps) {
  const escala = size / 200;
  const min = 120 * escala; // diâmetro no fim da expiração (raio 60)
  const max = 240 * escala; // diâmetro no pico da inspiração (raio 120)
  const borda = 1.5 * escala;

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div
        className="breath-circle rounded-full"
        style={
          {
            width: min,
            height: min,
            border: `${borda}px solid var(--color-accent)`,
            "--breath-min": `${min}px`,
            "--breath-max": `${max}px`,
          } as CSSProperties
        }
      />
    </div>
  );
}
