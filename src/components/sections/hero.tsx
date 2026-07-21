import Image from "next/image";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden" data-node-id="257:4">
      {/* Background — high-angle shipping containers, faded into the dark */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/assets/hero-containers.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <Container className="relative pt-10 pb-16 lg:pt-14 lg:pb-24">
        {/* Logo */}
        <Image
          src="/assets/logo-vettrus.png"
          alt="Vettrus Soluções Internacionais"
          width={368}
          height={84}
          priority
          className="h-16 w-auto sm:h-20"
        />

        {/* Headline + video */}
        <div className="mt-10 grid items-start gap-10 lg:mt-14 lg:grid-cols-[1fr_460px] lg:gap-12">
          <h1 className="max-w-2xl text-4xl font-extrabold uppercase leading-[1.125] sm:text-5xl lg:text-[71px]">
            Enquanto você compra de distribuidor,{" "}
            <span className="text-primary">seu concorrente importa</span>.
          </h1>

          <div className="flex flex-col items-center gap-5">
            <p className="text-2xl font-extrabold uppercase text-primary sm:text-3xl lg:text-[36px]">
              Assista o vídeo:
            </p>
            <video
              controls
              playsInline
              preload="metadata"
              poster="/assets/hero-containers.png"
              className="aspect-video w-full overflow-hidden rounded-[15px] bg-[#454545] object-cover"
            >
              <source
                src="https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/hero-web.mp4"
                type="video/mp4"
              />
              Seu navegador não suporta vídeo.
            </video>
          </div>
        </div>

        {/* Subheadline */}
        <h2 className="mt-12 max-w-3xl text-3xl font-extrabold uppercase leading-[1.125] sm:text-4xl lg:text-[40px]">
          <span className="text-primary">Faça uma análise gratuita</span>{" "}
          <span className="text-white">com um especialista Vettrus</span>
        </h2>
        <p className="mt-4 max-w-xl text-2xl font-semibold leading-[1.125] text-white sm:text-3xl lg:text-[40px]">
          e descubra se importar faz sentido pro seu negócio.
        </p>

        {/* Gold CTA band */}
        <a
          href="#agendar"
          className="mt-12 flex w-full max-w-4xl items-center justify-center rounded-md bg-primary px-8 py-7 text-center text-2xl font-extrabold uppercase tracking-wide text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5 sm:text-3xl lg:text-[42px]"
        >
          Quero validar minha importação
        </a>
      </Container>
    </section>
  );
}
