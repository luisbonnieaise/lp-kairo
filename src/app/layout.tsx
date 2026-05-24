import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1c1e20" },
    { media: "(prefers-color-scheme: light)", color: "#f7f4eb" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Kairo",
    template: "%s · Kairo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt"
      className={`${inter.variable} ${lora.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Noto Serif JP é carregada via <link> direto (não via next/font) porque
          next/font/google força `subsets` e filtra os @font-face por
          unicode-range — com `subsets: ['latin']` os glifos CJK (回路) ficam
          de fora e renderizam como tofu. Carregando aqui, o Google serve
          todos os 100+ blocos de unicode-range, cobrindo os kanji.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
