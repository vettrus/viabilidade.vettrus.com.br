"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const items = [
  {
    q: "A análise é gratuita?",
    a: "Sim, sem custo e sem compromisso.",
  },
  {
    q: "É reunião de vendas?",
    a: "Não. É uma avaliação honesta do seu caso. Se houver caminho com a Vettrus, apresentamos; a decisão é sua.",
  },
  {
    q: "Vou sair com nicho e produto definidos?",
    a: "Não. A análise avalia viabilidade e direção. A definição completa é um trabalho de projeto, apresentado se fizer sentido.",
  },
  {
    q: "Preciso de CNPJ?",
    a: "Sim.",
  },
  {
    q: "É presencial?",
    a: "Não. On-line, ±1 hora.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <Reveal>
          <h2 className="text-center text-6xl font-bold text-white sm:text-7xl">
            FAQ
          </h2>
        </Reveal>

        <div className="mx-auto mt-14 flex max-w-3xl flex-col gap-4">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 60}>
                <div className="overflow-hidden rounded-md bg-white text-ink">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-7 py-6 text-left"
                  >
                    <span className="text-xl font-semibold leading-snug text-ink sm:text-2xl">
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`shrink-0 text-2xl text-ink/50 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      ⌄
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-7 pb-6 text-base leading-relaxed text-ink/80 sm:text-lg">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
