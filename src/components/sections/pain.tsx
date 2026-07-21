import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const blockers = [
  "Não saber se o produto atual pode ser importado com vantagem;",
  "não saber quais produtos da sua curva A fazem sentido;",
  "medo de errar fornecedor e medo de trazer estoque que não gira;",
  "dúvida sobre imposto, frete e custo final;",
  "falta de clareza sobre capital mínimo;",
  "dúvida se vale marca própria ou produto novo.",
];

export function Pain() {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <Reveal className="flex flex-col gap-6">
          <h2 className="max-w-4xl text-xl font-bold leading-[1.15] sm:text-2xl lg:text-3xl">
            Enquanto você compra de distribuidor, seu concorrente pode estar{" "}
            <span className="text-primary">importando com mais margem</span>.
          </h2>
          <p className="max-w-3xl text-lg font-medium leading-snug text-white sm:text-xl">
            Se sua empresa já vende, mas ainda depende de distribuidor,
            revendedor ou fornecedor nacional, talvez você esteja deixando
            margem na mesa.
          </p>
        </Reveal>

        <Reveal className="mt-16">
          <h3 className="text-xl font-extrabold uppercase text-white sm:text-xl">
            O que trava a decisão:
          </h3>
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {blockers.map((item, i) => (
            <Reveal key={item} delay={(i % 2) * 90}>
              <div className="flex h-full items-start gap-5 rounded-md border-2 border-white bg-muted p-7">
                <Image
                  src="https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/icon-pain.png"
                  alt=""
                  width={51}
                  height={51}
                  className="mt-1 size-9 shrink-0"
                />
                <p className="text-lg font-medium leading-snug text-white sm:text-lg">
                  {item}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 flex flex-col gap-6">
          <h3 className="text-xl font-extrabold uppercase text-white sm:text-xl">
            Resultado:
          </h3>
          <div className="rounded-md border-2 border-danger bg-muted p-8 shadow-[0px_4px_120px_-57px_var(--danger)] sm:p-10">
            <p className="text-lg font-medium leading-snug text-white sm:text-xl">
              O resultado é quase sempre um destes dois caminhos:
            </p>
            <p className="mt-6 text-xl font-semibold leading-snug text-white sm:text-xl">
              ou o empresário <span className="text-primary">adia por anos</span>
              , ou importa no achismo e paga caro.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
