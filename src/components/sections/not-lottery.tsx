import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { CTA_URL } from "@/lib/site";

export function NotLottery() {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Texto */}
          <Reveal className="flex flex-col gap-5">
            <h2 className="text-2xl font-bold leading-[1.1] text-white sm:text-3xl lg:text-4xl">
              Importar não é loteria ou achismo.
              <br />É <span className="text-primary">análise e método</span>.
            </h2>

            <p className="text-lg font-semibold leading-snug text-white/90 sm:text-xl">
              Primeiro o critério, depois a decisão.
            </p>

            <div className="rounded-2xl border border-primary/25 bg-muted p-7">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                O primeiro passo
              </p>
              <p className="mt-2 text-lg font-medium leading-snug text-white sm:text-xl">
                <span className="font-extrabold text-primary">NÃO É</span> comprar,
                é avaliar se faz sentido para a sua empresa.
              </p>
            </div>

            <a
              href={CTA_URL}
              className="mt-6 inline-flex w-fit items-center justify-center rounded-md bg-primary px-8 py-4 text-center text-base font-extrabold uppercase tracking-wide text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5 sm:text-lg"
            >
              Quero validar minha importação
            </a>
          </Reveal>

          {/* Foto lateral (no mobile fica acima) */}
          <Reveal className="order-first lg:order-last">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl lg:aspect-[5/6]">
              <Image
                src="https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/what-is-2.jpg"
                alt="Especialista Vettrus em atendimento"
                fill
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover object-center"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
