import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";

type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  caption: string;
};

const stats: Stat[] = [
  { value: 22, prefix: "+", suffix: " anos", caption: "de comércio exterior" },
  { value: 10, prefix: "+", suffix: " mil", caption: "importações estruturadas" },
  { value: 350, prefix: "+", caption: "clientes ativos" },
  { value: 2, caption: "escritórios na China" },
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
        <Reveal className="flex flex-col gap-3">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Por dentro da Vettrus
          </p>
          <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
            Pessoas, presença e operação real.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.caption} delay={i * 80}>
              <div className="flex flex-col gap-2 border-l-2 border-primary/40 pl-5">
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  className="text-4xl font-extrabold leading-none text-primary sm:text-5xl"
                />
                <span className="text-sm font-medium leading-snug text-white/80 sm:text-base">
                  {stat.caption}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
