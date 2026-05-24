import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Pilares } from "@/components/sections/Pilares";
import { Silencio } from "@/components/sections/Silencio";
import { Como } from "@/components/sections/Como";
import { Depoimentos } from "@/components/sections/Depoimentos";
import { Comparar } from "@/components/sections/Comparar";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { CtaFinal } from "@/components/sections/CtaFinal";

type Params = Promise<{ locale: string }>;

export default async function Home({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Intro />
      <Pilares />
      <Silencio />
      <Como />
      <Depoimentos />
      <Comparar />
      <Pricing />
      <Faq />
      <CtaFinal />
    </>
  );
}
