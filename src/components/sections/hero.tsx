import Image from "next/image";
import { Container } from "@/components/ui/container";
import { VideoPlayer } from "@/components/ui/video-player";

export function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden" data-node-id="257:4">
      {/* Background — high-angle shipping containers, faded into the dark */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/hero-containers.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <Container className="relative pt-8 pb-12 lg:pt-10 lg:pb-16">
        {/* Logo */}
        <Image
          src="https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/logo-vettrus.png"
          alt="Vettrus Soluções Internacionais"
          width={368}
          height={84}
          priority
          className="h-14 w-auto sm:h-20"
        />

        {/* Headline + video */}
        <div className="mt-10 grid items-start gap-6 lg:mt-14 lg:grid-cols-[1fr_460px] lg:items-center lg:gap-10">
          <h1 className="max-w-2xl text-2xl font-extrabold uppercase leading-[1.125] sm:text-3xl lg:text-[42px]">
            Enquanto você compra de distribuidor,{" "}
            <span className="text-primary">seu concorrente importa</span>.
          </h1>

          <div className="flex flex-col items-center gap-5">
            <p className="text-xl font-extrabold uppercase text-primary sm:text-xl lg:text-[22px]">
              Assista o vídeo:
            </p>
            <VideoPlayer src="https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/hero-web.mp4" poster="https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/hero-containers.png" />
          </div>
        </div>

        {/* Subheadline */}
        <h2 className="mt-12 max-w-3xl text-xl font-extrabold uppercase leading-[1.125] sm:text-2xl lg:text-[24px]">
          <span className="text-primary">Faça uma análise gratuita</span>{" "}
          <span className="text-white">com um especialista Vettrus</span>
        </h2>
        <p className="mt-4 max-w-xl text-xl font-semibold leading-[1.125] text-white sm:text-xl lg:text-[24px]">
          e descubra se importar faz sentido pro seu negócio.
        </p>

        {/* Gold CTA band */}
        <a
          href="#agendar"
          className="mt-12 flex w-full max-w-4xl items-center justify-center rounded-md bg-primary px-8 py-5 text-center text-xl font-extrabold uppercase tracking-wide text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5 sm:text-xl lg:text-[24px]"
        >
          Quero validar minha importação
        </a>
      </Container>
    </section>
  );
}
