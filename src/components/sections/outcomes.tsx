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

        <ul className="mt-10 flex max-w-4xl flex-col gap-6">
          {outcomes.map((item, i) => (
            <Reveal key={item} delay={i * 70}>
              <li className="flex items-start gap-5">
                <span
                  aria-hidden="true"
                  className="mt-2 size-3 shrink-0 rounded-full bg-primary"
                />
                <span className="text-lg font-medium leading-snug text-white sm:text-xl">
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
