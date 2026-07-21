import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const steps = [
  { n: "01", label: "Preencha o formulário" },
  { n: "02", label: "Equipe entra em contato em minutos" },
  { n: "03", label: "Conversa on-line de ±1 hora com especialista" },
  { n: "04", label: "Você sai com clareza sobre o próximo passo" },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="pt-20 lg:pt-28">
      <Container>
        <Reveal>
          <h2 className="text-center text-4xl font-bold text-primary sm:text-5xl">
            Como funciona?
          </h2>
        </Reveal>

        <div className="mx-auto mt-14 flex max-w-4xl flex-col gap-4">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 80}>
              <div className="flex items-stretch overflow-hidden rounded-sm bg-white/10">
                <span aria-hidden="true" className="w-2 shrink-0 bg-primary" />
                <div className="flex flex-1 items-center gap-6 px-6 py-6 sm:gap-10 sm:px-8">
                  <span className="text-4xl font-bold text-primary sm:text-5xl">
                    {step.n}
                  </span>
                  <span className="text-xl font-bold leading-snug text-white sm:text-2xl">
                    {step.label}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* Full-bleed photo strip */}
      <div className="relative mt-20 h-[300px] w-full sm:h-[420px] lg:h-[480px]">
        <Image
          src="https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/photo-how.jpg"
          alt="Especialistas Vettrus em análise de importação"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
      </div>
    </section>
  );
}
