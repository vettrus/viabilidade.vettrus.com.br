import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { CTA_URL } from "@/lib/site";

const ASSETS =
  "https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets";

export function NotLottery() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Imagem de fundo */}
      <Image
        src={`${ASSETS}/photo-how.jpg`}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Overlay escuro (esquerda → direita) */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(14,15,17,0.95) 0%, rgba(14,15,17,0.82) 55%, rgba(14,15,17,0.6) 100%)",
        }}
      />

      <Container className="relative">
        <Reveal className="flex max-w-[680px] flex-col items-start gap-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Primeiro o critério, depois a decisão
          </p>
          <h2 className="text-[clamp(2rem,4.6vw,3.625rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-white text-balance">
            Importar não é loteria ou achismo.{" "}
            <span className="text-primary">É análise e método.</span>
          </h2>
          <p className="max-w-[560px] text-[clamp(1.0625rem,1.4vw,1.25rem)] leading-snug text-[#C3C9CF]">
            O primeiro passo <strong className="text-white">não é comprar</strong> —
            é avaliar se faz sentido para a sua empresa.
          </p>
          <a
            href={CTA_URL}
            className="mt-3 inline-flex items-center gap-2.5 rounded-[10px] bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
          >
            Quero validar minha importação →
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
