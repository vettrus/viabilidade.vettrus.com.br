import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

type Stat = { prefix?: string; strong: string; suffix: React.ReactNode };

const stats: Stat[] = [
  { prefix: "+ de ", strong: "22 anos", suffix: " de comércio exterior" },
  { prefix: "+ de ", strong: "10 mil", suffix: " importações estruturadas" },
  { prefix: "+ de ", strong: "350 clientes", suffix: " ativos" },
  { strong: "2 escritórios", suffix: " na China" },
];

export function Stats() {
  return (
    <section
      className="relative overflow-hidden bg-[#101010] py-14"
      data-node-id="246:20"
    >
      {/* Gold glow — bottom-right corner */}
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-primary/20 blur-[120px]" />

      <Container className="relative">
        <div className="grid gap-x-12 gap-y-8 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-2">
          {stats.map((stat, i) => (
            <Reveal key={stat.strong} delay={i * 80}>
              <div className="flex items-center gap-5">
                <Image
                  src="https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/icon-stat.png"
                  alt=""
                  width={93}
                  height={63}
                  className="h-12 w-auto shrink-0"
                />
                <p className="text-xl font-medium leading-tight text-white sm:text-2xl lg:text-3xl">
                  {stat.prefix}
                  <span className="font-bold">{stat.strong}</span>
                  {stat.suffix}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
