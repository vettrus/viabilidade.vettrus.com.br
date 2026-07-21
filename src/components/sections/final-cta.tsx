"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getSupabase } from "@/lib/supabase/client";
import {
  CANAL_OPTIONS,
  CNPJ_OPTIONS,
  FATURAMENTO_OPTIONS,
  OBJETIVO_OPTIONS,
  isDisqualified,
  leadSchema,
  maskPhone,
  normalizeEmail,
  type LeadInput,
} from "@/lib/lead-schema";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
];

// Captura UTMs/click ids da URL atual (LP single-page mantém a query).
function collectUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key) ?? params.get(key.toUpperCase());
    if (value?.trim()) out[key] = value.trim().slice(0, 500);
  }
  if (document.referrer) out.referrer = document.referrer.slice(0, 500);
  return out;
}

// Empacota as respostas de qualificação no `message`, nos rótulos que a
// Edge Function (kommo.ts) usa para mapear os campos no Kommo.
function buildMessage(data: LeadInput): string {
  return [
    `Possui CNPJ Ativo?: ${data.cnpj}`,
    `Faturamento: ${data.faturamento}`,
    `Qual canal principal de venda: ${data.canal}`,
    `O que você quer avaliar?: ${data.objetivo}`,
  ].join(" · ");
}

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
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    mode: "onTouched",
  });

  // Faturamento abaixo do perfil: não envia ao Kommo, redireciona.
  function onValid(data: LeadInput) {
    if (isDisqualified(data.faturamento)) {
      router.push("/nao-qualificado");
      return;
    }
    mutation.mutate(data);
  }

  const mutation = useMutation({
    mutationFn: async (data: LeadInput) => {
      // Edge Function submit-lead: grava em `leads` (admin) + sincroniza Kommo.
      const { data: res, error } = await getSupabase().functions.invoke(
        "submit-lead",
        {
          body: {
            data: {
              name: data.nome,
              email: data.email,
              phone: data.whatsapp,
              message: buildMessage(data),
              source_section: "formulario-viabilidade",
              utm: collectUtm(),
            },
          },
        },
      );
      if (error) {
        let message = "Falha no envio. Tente novamente.";
        const ctx = (error as { context?: Response }).context;
        if (ctx?.json) {
          try {
            const body = await ctx.json();
            if (body?.error) message = body.error;
          } catch {
            // corpo não-JSON
          }
        }
        throw new Error(message);
      }
      return res;
    },
    onSuccess: () => {
      // Conversão: só leads qualificados (desqualificado nem chega aqui).
      window.fbq?.("track", "Lead", { content_category: "Lead Vettrus" });
    },
  });

  const whatsapp = register("whatsapp");
  const email = register("email");

  return (
    <section id="agendar" className="overflow-hidden">
      {/* Dark intro */}
      <Container className="py-14 text-center lg:py-20">
        <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-8">
          <h2 className="text-xl font-bold uppercase text-white sm:text-2xl">
            Agora é com você:
          </h2>
          <p className="text-xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">
            Continuar adiando no escuro, ou{" "}
            <span className="text-primary">gastar 1 hora</span> e sair sabendo se
            esse caminho é pra você.
          </p>
        </Reveal>
      </Container>

      {/* Form card */}
      <div className="pb-12 lg:pb-16">
        <Container>
          <Reveal className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-black/10 bg-white p-8 text-ink shadow-ambient sm:p-10">
              <h3 className="text-center text-xl font-bold text-ink sm:text-2xl">
                Agende agora sua análise!
              </h3>

            {mutation.isSuccess ? (
              <div className="mt-10 rounded-md border border-primary bg-primary/10 p-8 text-center">
                <p className="text-xl font-bold text-ink">Recebemos seus dados!</p>
                <p className="mt-2 text-lg text-ink/80">
                  Nossa equipe entra em contato em minutos para agendar sua
                  análise gratuita.
                </p>
              </div>
            ) : (
              <form
                noValidate
                onSubmit={handleSubmit(onValid)}
                className="mt-10 flex flex-col gap-6"
              >
                {textFields.map((field) => {
                  const err = errors[field.name]?.message;
                  const base =
                    "h-12 rounded-sm bg-[#f1f1f1] px-4 text-lg text-ink outline-none ring-primary/60 transition focus:ring-2";
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
                    <label key={choice.name} className="flex flex-col gap-2">
                      <span className="text-lg font-medium text-ink">
                        {choice.label}
                      </span>
                      <select
                        {...register(choice.name)}
                        defaultValue=""
                        className={`h-12 rounded-sm bg-[#f1f1f1] px-4 text-lg text-ink outline-none ring-primary/60 transition focus:ring-2 ${
                          err ? "ring-2 ring-danger" : ""
                        }`}
                      >
                        <option value="" disabled>
                          Selecione uma opção
                        </option>
                        {choice.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {err && (
                        <span className="text-sm font-medium text-danger">
                          {err}
                        </span>
                      )}
                    </label>
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
                  className="mt-4 inline-flex h-14 items-center justify-center rounded-md bg-primary px-9 text-lg font-extrabold uppercase tracking-wide text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
                >
                  {mutation.isPending
                    ? "Enviando..."
                    : "Quero agendar minha análise gratuita"}
                </button>
              </form>
            )}
            </div>
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
