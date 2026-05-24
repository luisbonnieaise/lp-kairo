import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Kairo — sistema pessoal de evolução";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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

export default async function OG() {
  const KANJI = "回路";
  const WORDMARK = "KAIRO";
  const TAGLINE = "Seu sistema pessoal de evolução";

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
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
