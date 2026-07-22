import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function Honesty() {
  return (
    <section className="bg-[#f0f0f0] text-ink">
      <Container className="pb-14">
        <Reveal>
          <p className="max-w-4xl text-xl font-bold leading-tight text-ink sm:text-2xl lg:text-3xl">
            Se importar não fizer sentido agora, você vai ouvir isso da gente.
          </p>
        </Reveal>
      </Container>

      {/* Full-bleed photo strip */}
      <div className="relative h-[280px] w-full sm:h-[420px]">
        <Image
          src="https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/band-analysis.jpg"
          alt="Reunião de análise de viabilidade com a equipe Vettrus"
          fill
          sizes="100vw"
          className="object-cover object-[center_85%]"
        />
      </div>
    </section>
  );
}
