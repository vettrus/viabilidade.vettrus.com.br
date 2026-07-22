import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const ASSETS =
  "https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets";

const outcomes = [
  "Clareza se este é (ou não) o momento de importar",
  "Visão inicial do capital que uma operação pode exigir",
  "Hipóteses de produtos ou categorias que merecem estudo",
  "Principais riscos do seu caso",
  "Próximos passos recomendados com honestidade",
];

export function Outcomes() {
  return (
    <section className="py-16 lg:py-28">
      <Container>
        <Reveal className="mb-12 flex max-w-[640px] flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            O que você leva
          </p>
          <h2 className="text-[clamp(1.875rem,4vw,3.125rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white text-balance">
            Você sai da análise com:
          </h2>
        </Reveal>

        <div className="grid items-stretch gap-7 lg:grid-cols-2">
          <Reveal className="relative min-h-[360px] w-full overflow-hidden rounded-2xl">
            <Image
              src={`${ASSETS}/hero-containers.png`}
              alt="Operação de importação Vettrus"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover object-center"
            />
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {outcomes.map((item, i) => (
              <Reveal
                key={item}
                delay={i * 70}
                className="rounded-[14px] border border-white/[0.09] bg-[#16181B] p-6"
              >
                <span className="mb-4 grid size-10 place-items-center rounded-[10px] bg-primary/[0.12]">
                  <Image
                    src={`${ASSETS}/icon-check.png`}
                    alt=""
                    aria-hidden="true"
                    width={20}
                    height={20}
                    className="size-5"
                  />
                </span>
                <p className="text-base leading-normal text-[#D3D8DD]">{item}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-8">
          <p className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-6 py-5 text-sm leading-relaxed text-[#8A9199]">
            <strong className="text-[#B9BFC6]">Importante:</strong> a análise não
            entrega uma lista completa de produtos, fornecedores ou custos
            fechados. A definição de nicho, produto, fornecedor, tributação e
            plano de importação é um projeto estruturado, apresentado apenas se
            fizer sentido para sua empresa.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
