import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const blockers = [
  "Não saber se o produto atual pode ser importado com vantagem",
  "Não saber quais produtos da sua curva A fazem sentido",
  "Medo de errar fornecedor e de trazer estoque que não gira",
  "Dúvida sobre imposto, frete e custo final",
  "Falta de clareza sobre capital mínimo",
  "Dúvida se vale marca própria ou produto novo",
];

export function Pain() {
  return (
    <section className="relative overflow-hidden bg-[#0C0D0F] py-16 lg:py-28">
      {/* Glow vermelho */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(62% 55% at 50% 44%, rgba(206,32,32,0.30) 0%, rgba(150,22,22,0.12) 40%, transparent 70%)",
        }}
      />

      <Container className="relative">
        <Reveal className="mb-14 flex max-w-[760px] flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            O problema
          </p>
          <h2 className="text-[clamp(1.875rem,4vw,3.125rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white text-balance">
            Seu concorrente pode estar importando com mais margem.
          </h2>
          <p className="text-lg leading-relaxed text-[#B9BFC6]">
            Se sua empresa já vende, mas ainda depende de distribuidor,
            revendedor ou fornecedor nacional, talvez você esteja deixando
            margem na mesa.
          </p>
        </Reveal>

        <div className="grid items-start gap-6 lg:grid-cols-2">
          {/* Card: o que trava */}
          <Reveal className="h-full rounded-2xl border border-danger/25 bg-[#141619]/70 p-8 backdrop-blur-md sm:p-10">
            <h3 className="mb-6 text-2xl font-bold text-white sm:text-3xl">
              O que trava a decisão
            </h3>
            <ul className="flex flex-col gap-4">
              {blockers.map((item) => (
                <li key={item} className="flex items-start gap-3.5">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-0.5 size-[22px] shrink-0 text-danger"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                    <path d="M9 9l6 6M15 9l-6 6" />
                  </svg>
                  <span className="text-base leading-relaxed text-[#C3C9CF]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Card: o resultado */}
          <Reveal className="flex h-full flex-col justify-center rounded-2xl border border-danger/25 bg-[#141619]/70 p-8 backdrop-blur-md sm:p-10">
            <h3 className="mb-[18px] text-2xl font-bold text-primary sm:text-3xl">
              O resultado
            </h3>
            <p className="text-[clamp(1.375rem,2.4vw,1.875rem)] font-semibold leading-[1.28] text-white text-balance">
              O empresário adia por anos, <span className="text-[#8A9199]">ou</span>{" "}
              importa no achismo e paga caro.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
