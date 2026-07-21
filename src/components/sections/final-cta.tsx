"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import {
  CANAL_OPTIONS,
  CNPJ_OPTIONS,
  FATURAMENTO_OPTIONS,
  OBJETIVO_OPTIONS,
  leadSchema,
  maskPhone,
  normalizeEmail,
  type LeadInput,
} from "@/lib/lead-schema";

const textFields = [
  { name: "nome", label: "Nome", type: "text", placeholder: "Seu nome completo" },
  {
    name: "whatsapp",
    label: "WhatsApp",
    type: "tel",
    placeholder: "(00) 00000-0000",
  },
  {
    name: "email",
    label: "E-mail corporativo",
    type: "email",
    placeholder: "voce@suaempresa.com.br",
  },
] as const;

const choices = [
  { name: "cnpj", label: "Possui CNPJ Ativo?", options: CNPJ_OPTIONS },
  {
    name: "faturamento",
    label: "Qual o faturamento médio mensal da sua empresa?",
    options: FATURAMENTO_OPTIONS,
  },
  { name: "canal", label: "Qual canal principal de venda:", options: CANAL_OPTIONS },
  {
    name: "objetivo",
    label: "O que você quer avaliar?",
    options: OBJETIVO_OPTIONS,
  },
] as const;

export function FinalCta() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    mode: "onTouched",
  });

  const mutation = useMutation({
    mutationFn: async (data: LeadInput) => {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error ?? "Falha no envio. Tente novamente.");
      }
      return res.json();
    },
  });

  const whatsapp = register("whatsapp");
  const email = register("email");

  return (
    <section id="agendar" className="overflow-hidden">
      {/* Dark intro */}
      <Container className="py-20 text-center lg:py-28">
        <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-8">
          <h2 className="text-3xl font-bold uppercase text-white sm:text-4xl">
            Agora é com você:
          </h2>
          <p className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Continuar adiando no escuro, ou{" "}
            <span className="text-primary">gastar 1 hora</span> e sair sabendo se
            esse caminho é pra você.
          </p>
        </Reveal>
      </Container>

      {/* White form panel */}
      <div className="bg-white text-ink">
        <Container className="py-16 lg:py-20">
          <Reveal className="mx-auto max-w-2xl">
            <h3 className="text-center text-3xl font-bold text-ink sm:text-4xl">
              Agende agora sua análise!
            </h3>

            {mutation.isSuccess ? (
              <div className="mt-10 rounded-md border border-primary bg-primary/10 p-8 text-center">
                <p className="text-2xl font-bold text-ink">Recebemos seus dados!</p>
                <p className="mt-2 text-lg text-ink/80">
                  Nossa equipe entra em contato em minutos para agendar sua
                  análise gratuita.
                </p>
              </div>
            ) : (
              <form
                noValidate
                onSubmit={handleSubmit((data) => mutation.mutate(data))}
                className="mt-10 flex flex-col gap-6"
              >
                {textFields.map((field) => {
                  const err = errors[field.name]?.message;
                  const base =
                    "h-14 rounded-sm bg-[#f1f1f1] px-4 text-lg text-ink outline-none ring-primary/60 transition focus:ring-2";
                  const invalid = err ? "ring-2 ring-danger" : "";

                  if (field.name === "whatsapp") {
                    return (
                      <label key={field.name} className="flex flex-col gap-2">
                        <span className="text-lg font-medium text-ink">
                          {field.label}
                        </span>
                        <input
                          {...whatsapp}
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          placeholder={field.placeholder}
                          className={`${base} ${invalid}`}
                          onChange={(e) => {
                            e.target.value = maskPhone(e.target.value);
                            whatsapp.onChange(e);
                          }}
                        />
                        {err && (
                          <span className="text-sm font-medium text-danger">
                            {err}
                          </span>
                        )}
                      </label>
                    );
                  }

                  if (field.name === "email") {
                    return (
                      <label key={field.name} className="flex flex-col gap-2">
                        <span className="text-lg font-medium text-ink">
                          {field.label}
                        </span>
                        <input
                          {...email}
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder={field.placeholder}
                          className={`${base} ${invalid}`}
                          onChange={(e) => {
                            e.target.value = normalizeEmail(e.target.value);
                            email.onChange(e);
                          }}
                        />
                        {err && (
                          <span className="text-sm font-medium text-danger">
                            {err}
                          </span>
                        )}
                      </label>
                    );
                  }

                  return (
                    <label key={field.name} className="flex flex-col gap-2">
                      <span className="text-lg font-medium text-ink">
                        {field.label}
                      </span>
                      <input
                        {...register(field.name)}
                        type={field.type}
                        autoComplete="name"
                        placeholder={field.placeholder}
                        className={`${base} ${invalid}`}
                      />
                      {err && (
                        <span className="text-sm font-medium text-danger">
                          {err}
                        </span>
                      )}
                    </label>
                  );
                })}

                {choices.map((choice) => {
                  const err = errors[choice.name]?.message;
                  return (
                    <fieldset key={choice.name} className="flex flex-col gap-3">
                      <legend className="mb-1 text-lg font-bold text-ink">
                        {choice.label}
                      </legend>
                      <div className="flex flex-wrap gap-3">
                        {choice.options.map((opt) => (
                          <label
                            key={opt}
                            className="flex cursor-pointer items-center gap-2.5 rounded-sm bg-[#f1f1f1] px-4 py-3 text-base text-ink transition has-[:checked]:bg-primary has-[:checked]:font-semibold"
                          >
                            <input
                              type="radio"
                              value={opt}
                              {...register(choice.name)}
                              className="size-4 accent-primary"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                      {err && (
                        <span className="text-sm font-medium text-danger">
                          {err}
                        </span>
                      )}
                    </fieldset>
                  );
                })}

                {mutation.isError && (
                  <p className="text-sm font-medium text-danger">
                    {mutation.error.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="mt-4 inline-flex h-16 items-center justify-center rounded-md bg-primary px-9 text-lg font-extrabold uppercase tracking-wide text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:text-xl"
                >
                  {mutation.isPending
                    ? "Enviando..."
                    : "Quero agendar minha análise gratuita"}
                </button>
              </form>
            )}
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
