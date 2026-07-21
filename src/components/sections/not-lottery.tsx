import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { CTA_URL } from "@/lib/site";

export function NotLottery() {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <Reveal className="flex flex-col items-center gap-8 text-center">
          <h2 className="text-2xl font-bold leading-[1.1] text-primary sm:text-3xl lg:text-4xl">
            Importar não é loteria.
            <br />É conta.
          </h2>

          <p className="max-w-2xl text-xl font-bold leading-snug text-white sm:text-xl">
            E o primeiro passo <span className="font-extrabold text-primary">NÃO É</span>{" "}
            comprar: é avaliar se faz sentido.
          </p>

          <p className="text-lg font-semibold leading-snug text-white sm:text-xl">
            Primeiro o critério, depois a decisão.
          </p>

          <span className="h-px w-full max-w-3xl bg-white" />

          <a
            href={CTA_URL}
            className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-6 text-center text-xl font-extrabold uppercase leading-tight tracking-wide text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5 sm:text-xl"
          >
            Quero validar minha importação
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
