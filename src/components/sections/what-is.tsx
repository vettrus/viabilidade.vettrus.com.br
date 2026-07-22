import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const ASSETS =
  "https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets";

const photos = [
  { src: `${ASSETS}/what-is-1.jpg`, alt: "Especialista Vettrus em reunião" },
  { src: `${ASSETS}/what-is-2.jpg`, alt: "Equipe Vettrus em atendimento" },
  { src: `${ASSETS}/what-is-3.jpg`, alt: "Consultoria de importação Vettrus" },
];

const evaluated = [
  "Se sua empresa está no momento certo para importar",
  "Se seu faturamento, produto e capital permitem uma operação viável",
  "Se algum produto da sua curva A pode ser estudado para importação",
  "Se faz mais sentido importar produto que você já vende ou buscar novos",
  "Quais custos entram na conta: imposto, frete, despacho, lote, prazo e margem",
  "Se existe caminho para marca própria ou redução de dependência",
  "Qual próximo passo faz sentido para o seu caso",
];

export function WhatIs() {
  return (
    <section className="border-y border-white/[0.07] bg-[#111316] py-16 lg:py-28">
      <Container>
        <Reveal className="mb-9 flex max-w-[820px] flex-col gap-5 lg:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            O que é
          </p>
          <h2 className="text-[clamp(1.875rem,4vw,3.125rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white text-balance">
            A Análise de Viabilidade
          </h2>
          <p className="max-w-[680px] text-[clamp(1.0625rem,1.4vw,1.3125rem)] leading-relaxed text-[#B9BFC6]">
            Uma conversa diagnóstica e <strong className="text-white">gratuita</strong>,
            de cerca de 1 hora, com um especialista da Vettrus.
          </p>
          <p className="text-[17px] leading-relaxed text-[#9BA1A8]">
            Se importar não fizer sentido agora, você vai ouvir isso da gente.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-3">
          {photos.map((photo, i) => (
            <Reveal key={photo.src} delay={i * 90}>
              <div className="relative h-[360px] w-full overflow-hidden rounded-[14px]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 90vw, 33vw"
                  className="object-cover object-center"
                />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-11 rounded-2xl border border-white/[0.09] bg-[#16181B] p-8 sm:p-12 lg:mt-16">
          <h3 className="mb-8 text-2xl font-bold text-white sm:text-3xl">
            Nela, avaliamos:
          </h3>
          <ul className="grid gap-x-11 gap-y-[22px] sm:grid-cols-2">
            {evaluated.map((item) => (
              <li key={item} className="flex items-start gap-3.5">
                <Image
                  src={`${ASSETS}/icon-check.png`}
                  alt=""
                  aria-hidden="true"
                  width={22}
                  height={22}
                  className="mt-0.5 size-[22px] shrink-0"
                />
                <span className="text-[clamp(1.0625rem,1.4vw,1.1875rem)] leading-relaxed text-[#D3D8DD]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
