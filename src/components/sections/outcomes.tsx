import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const outcomes = [
  "Clareza se este é (ou não) o momento de importar",
  "Visão inicial do capital que uma operação pode exigir",
  "Hipóteses de produtos ou categorias que merecem estudo;",
  "Principais riscos do seu caso;",
  "Próximos passos recomendados com honestidade.",
];

export function Outcomes() {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <Reveal>
          <h2 className="text-xl font-bold uppercase text-primary sm:text-2xl">
            Você sai da análise com:
          </h2>
        </Reveal>

        <ul className="mt-10 flex max-w-4xl flex-col gap-4">
          {outcomes.map((item, i) => (
            <Reveal key={item} delay={i * 70}>
              <li className="flex items-center gap-4 rounded-xl border border-primary/20 bg-muted px-6 py-5">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/40">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </span>
                <span className="text-base font-medium leading-snug text-white sm:text-lg">
                  {item}
                </span>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-14">
          <p
            className="max-w-5xl text-lg font-medium leading-relaxed text-white sm:text-lg lg:text-xl"
            data-node-id="199:14"
          >
            <span className="font-bold">Importante:</span> a análise não entrega
            uma lista completa de produtos, fornecedores ou custos fechados. A
            definição de nicho, produto, fornecedor, tributação e plano de
            importação é um projeto estruturado, apresentado apenas se fizer
            sentido para sua empresa.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
