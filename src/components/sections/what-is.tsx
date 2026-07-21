import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const photos = [
  { src: "https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/what-is-1.jpg", alt: "Especialista Vettrus em reunião" },
  { src: "https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/what-is-2.jpg", alt: "Equipe Vettrus em atendimento" },
  { src: "https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/what-is-3.jpg", alt: "Consultoria de importação Vettrus" },
];

const evaluated = [
  "Se sua empresa está no momento certo para importar;",
  "Se seu faturamento, produto e capital permitem uma operação viável;",
  "Se algum produto da sua curva A pode ser estudado para importação;",
  "Se faz mais sentido importar produto que você já vende ou buscar novos produtos;",
  "Quais custos precisam entrar na conta: imposto, frete, despacho, lote, prazo e margem;",
  "Se existe caminho para marca própria ou redução de dependência de distribuidor;",
  "Qual próximo passo faz sentido para o seu caso.",
];

export function WhatIs() {
  return (
    <section className="bg-[#f0f0f0] py-14 text-ink lg:py-20">
      <Container>
        <Reveal className="flex flex-col gap-6">
          <h2
            className="text-xl font-bold uppercase leading-tight text-ink sm:text-2xl lg:text-3xl"
            data-node-id="191:134"
          >
            O que é a Análise de Viabilidade?
          </h2>
          <p
            className="max-w-5xl text-xl font-bold leading-snug text-ink sm:text-xl lg:text-2xl"
            data-node-id="191:135"
          >
            A <span className="text-black">Análise de Viabilidade de Importação</span>{" "}
            é uma conversa diagnóstica e gratuita, de{" "}
            <span className="box-decoration-clone bg-primary px-1.5 py-0.5 text-ink">
              cerca de 1 hora
            </span>
            , com um especialista da Vettrus.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {photos.map((photo, i) => (
            <Reveal key={photo.src} delay={i * 90}>
              <div className="relative aspect-[5/6] w-full overflow-hidden">
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

        <Reveal className="mt-16">
          <h3 className="text-xl font-bold uppercase text-ink sm:text-xl">
            Nela, avaliamos:
          </h3>
          <ul className="mt-8 flex max-w-4xl flex-col gap-4">
            {evaluated.map((item) => (
              <li key={item} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-3 size-2.5 shrink-0 rounded-full bg-ink"
                />
                <span className="text-lg font-medium leading-snug text-ink sm:text-xl">
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
