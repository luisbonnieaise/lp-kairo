import { ImageResponse } from "next/og";

// Card de compartilhamento (OpenGraph / Twitter) gerado por locale.
// Servido como route handler em /og?l=<locale> — fora do [locale] de propósito,
// para não passar pelo redirect "as-needed" do middleware i18n (que mandaria
// /pt/og → /og e quebraria). O middleware exclui /og do matcher.
export const runtime = "edge";

const SIZE = { width: 1200, height: 630 };

const TAGLINES: Record<string, string> = {
  pt: "Seu sistema pessoal de evolução",
  en: "Your personal system of evolution",
  es: "Tu sistema personal de evolución",
  de: "Dein persönliches System der Entwicklung",
};

async function loadFont(family: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`;
  const css = await fetch(url, {
    headers: {
      // UA real evita Google servir woff2-variations (sem suporte no satori)
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  }).then((r) => r.text());
  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!match) return null;
  return fetch(match[1]).then((r) => r.arrayBuffer());
}

export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get("l") ?? "pt";
  const locale = requested in TAGLINES ? requested : "pt";

  const KANJI = "回路";
  const WORDMARK = "KAIRO";
  const TAGLINE = TAGLINES[locale];

  const [jpFont, loraFont] = await Promise.all([
    loadFont("Noto+Serif+JP:wght@500", KANJI),
    loadFont("Lora:wght@400", WORDMARK + " " + TAGLINE),
  ]);

  const fonts: { name: string; data: ArrayBuffer; style: "normal" }[] = [];
  if (jpFont) fonts.push({ name: "NotoJP", data: jpFont, style: "normal" });
  if (loraFont) fonts.push({ name: "Lora", data: loraFont, style: "normal" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #2a2520 0%, #1c1e20 60%)",
          color: "#e5e3dc",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            fontFamily: "NotoJP",
            fontSize: 180,
            color: "#d4a373",
            letterSpacing: 18,
            lineHeight: 1,
          }}
        >
          {KANJI}
        </div>
        <div
          style={{
            fontFamily: "Lora",
            marginTop: 36,
            fontSize: 100,
            letterSpacing: 24,
            fontWeight: 500,
          }}
        >
          {WORDMARK}
        </div>
        <div
          style={{
            fontFamily: "Lora",
            marginTop: 32,
            fontSize: 32,
            color: "#8a8e93",
            fontStyle: "italic",
          }}
        >
          {TAGLINE}
        </div>
      </div>
    ),
    { ...SIZE, fonts: fonts.length ? fonts : undefined },
  );
}
