import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { CTA_URL } from "@/lib/site";

const forWhom = [
  "Ainda não importam;",
  "Têm CNPJ ativo;",
  "Faturam acima de R$ 100 mil/mês;",
  "Vendem em loja física, e-commerce, marketplace ou B2B;",
  "Já têm produtos com giro;",
  "Compram de distribuidor, revendedor ou fornecedor nacional;",
  "Querem melhorar margem, criar marca própria ou reduzir dependência de terceiros;",
  "Têm disposição para avaliar importação com critério, não por achismo.",
];

const notForWhom = [
  "Pessoa física;",
  "Quem não tem CNPJ;",
  "Quem ainda não tem operação comercial validada;",
  "Quem busca renda extra;",
  "Quem quer importar sem capital;",
  "Quem procura curso básico de importação;",
  "Quem espera uma lista gratuita de fornecedores ou produtos prontos.",
];

export function Audience() {
  return (
    <section id="publico-alvo" className="py-14 lg:py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
          {/* É para */}
          <div className="rounded-2xl border border-white/10 bg-muted p-7 lg:p-9">
            <Reveal>
              <h2 className="text-xl font-bold uppercase leading-tight text-white sm:text-xl lg:text-2xl">
                Esta análise é para empresas que:
              </h2>
            </Reveal>

            <ul className="mt-8 flex flex-col gap-4">
              {forWhom.map((item, i) => (
                <Reveal key={item} delay={i * 50}>
                  <li className="flex items-start gap-4">
                    <Image
                      src="https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/icon-check.png"
                      alt=""
                      width={47}
                      height={47}
                      className="mt-1 size-7 shrink-0"
                    />
                    <span className="text-lg font-medium leading-snug text-white sm:text-lg">
                      {item}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Não é para */}
          <div className="rounded-2xl border border-white/10 bg-muted p-7 lg:p-9">
            <Reveal>
              <h2 className="text-xl font-bold uppercase leading-tight text-white sm:text-xl lg:text-2xl">
                Não é para:
              </h2>
            </Reveal>

            <ul className="mt-8 flex flex-col gap-4">
              {notForWhom.map((item, i) => (
                <Reveal key={item} delay={i * 50}>
                  <li className="flex items-start gap-4">
                    <Image
                      src="https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/icon-x.png"
                      alt=""
                      width={47}
                      height={47}
                      className="mt-1 size-7 shrink-0"
                    />
                    <span className="text-lg font-medium leading-snug text-white sm:text-lg">
                      {item}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>

        <Reveal className="mt-16 flex justify-center">
          <a
            href={CTA_URL}
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-center text-base font-extrabold uppercase leading-tight tracking-wide text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5 sm:text-lg"
          >
            Quero validar minha importação
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
