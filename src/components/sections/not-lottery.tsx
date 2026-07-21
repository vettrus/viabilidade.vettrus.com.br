import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { CTA_URL } from "@/lib/site";

export function NotLottery() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <Reveal className="flex flex-col items-center gap-8 text-center">
          <h2 className="text-4xl font-bold leading-[1.1] text-primary sm:text-5xl lg:text-6xl">
            Importar não é loteria.
            <br />É conta.
          </h2>

          <p className="max-w-2xl text-2xl font-bold leading-snug text-white sm:text-3xl">
            E o primeiro passo <span className="font-extrabold text-primary">NÃO É</span>{" "}
            comprar: é avaliar se faz sentido.
          </p>

          <p className="text-xl font-semibold leading-snug text-white sm:text-2xl">
            Primeiro o critério, depois a decisão.
          </p>

          <span className="h-px w-full max-w-3xl bg-white" />

          <a
            href={CTA_URL}
            className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-6 text-center text-2xl font-extrabold uppercase leading-tight tracking-wide text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5 sm:text-3xl"
          >
            Quero validar minha importação
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
