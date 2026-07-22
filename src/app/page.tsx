import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { Pain } from "@/components/sections/pain";
import { WhatIs } from "@/components/sections/what-is";
import { NotLottery } from "@/components/sections/not-lottery";
import { Outcomes } from "@/components/sections/outcomes";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Audience } from "@/components/sections/audience";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Pain />
        <WhatIs />
        <NotLottery />
        <Outcomes />
        <HowItWorks />
        <Audience />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
