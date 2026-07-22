import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const ASSETS =
  "https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets";

const steps = [
  { n: "01", label: "Preencha o formulário" },
  { n: "02", label: "Equipe entra em contato em minutos" },
  { n: "03", label: "Conversa on-line de ±1 hora com especialista" },
  { n: "04", label: "Você sai com clareza sobre o próximo passo" },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden border-y border-white/[0.07] py-16 lg:py-28"
    >
      {/* Imagem de fundo */}
      <Image
        src={`${ASSETS}/photo-how.jpg`}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Overlay escuro (topo → base) */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,13,15,0.92) 0%, rgba(12,13,15,0.84) 100%)",
        }}
      />

      <Container className="relative">
        <Reveal className="mb-12 flex max-w-[640px] flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Passo a passo
          </p>
          <h2 className="text-[clamp(1.875rem,4vw,3.125rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
            Como funciona?
          </h2>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal
              key={step.n}
              delay={i * 80}
              className="rounded-2xl border border-white/[0.09] bg-[#16181B] px-6 py-8"
            >
              <div className="mb-4 text-[44px] font-extrabold leading-none tracking-[-0.02em] text-primary/90">
                {step.n}
              </div>
              <p className="text-base leading-normal text-[#D3D8DD]">
                {step.label}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
