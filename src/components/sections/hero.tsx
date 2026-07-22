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
          className="object-cover object-center opacity-75  "
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <Container className="relative flex flex-col items-center pt-8 pb-12 text-center lg:pt-10 lg:pb-16">
        {/* Logo */}
        <Image
          src="https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/logo-vettrus.png"
          alt="Vettrus Soluções Internacionais"
          width={368}
          height={84}
          priority
          className="h-10 w-auto sm:h-12"
        />

        {/* Headline */}
        <h1 className="mt-8 max-w-5xl text-2xl font-extrabold uppercase leading-[1.125] sm:text-3xl lg:mt-10 lg:text-[42px]">
          Enquanto você compra de distribuidor,
          <br />
          <span className="text-primary">seu concorrente importa</span>.
        </h1>

        {/* Video (autoplay ao carregar) */}
        <div className="mt-8 w-full max-w-[720px] lg:mt-10">
          <VideoPlayer
            autoPlay
            src="https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/hero-web.mp4"
            poster="https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/hero-containers.png"
          />
        </div>

        {/* Subheadline */}
        <p className="mt-8 max-w-2xl text-sm font-thin leading-snug text-white sm:text-sm lg:mt-10 lg:text-2xl">
          Se sua empresa já vende, mas ainda depende de distribuidor,
          revendedor ou fornecedor nacional, talvez você esteja{" "}
          <span className="text-primary">perdendo margem de lucro</span>.
        </p>

        {/* CTA */}
        <a
          href="#agendar"
          className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-center text-base font-extrabold uppercase tracking-wide text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5 sm:text-lg lg:mt-10"
        >
          Quero validar minha importação
        </a>
      </Container>
    </section>
  );
}
