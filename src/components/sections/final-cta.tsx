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

  const inputBase =
    "rounded-[9px] border border-[#D6D6D0] bg-white px-[15px] py-3.5 text-[15px] text-ink outline-none transition focus:border-primary";
  const labelBase = "text-[13px] font-semibold tracking-[0.01em] text-[#6A6A6A]";

  return (
    <section
      id="agendar"
      className="border-t border-black/[0.08] bg-white text-ink"
    >
      <Container className="grid items-start gap-10 py-16 lg:grid-cols-2 lg:gap-[72px] lg:py-28">
        {/* Coluna esquerda — texto */}
        <Reveal className="flex flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#141414]">
            Agora é com você
          </p>
          <h2 className="text-[clamp(1.875rem,4vw,3.25rem)] font-extrabold leading-[1.06] tracking-[-0.025em] text-[#141414] text-balance">
            Agende agora sua análise gratuita.
          </h2>
          <p className="max-w-[460px] text-lg leading-relaxed text-[#4A4A4A]">
            Continuar adiando no escuro, ou gastar 1 hora e sair sabendo se esse
            caminho é pra você.
          </p>
          <ul className="mt-2 flex flex-col gap-3.5">
            {[
              "Gratuita e sem compromisso",
              "±1 hora, 100% on-line",
              "Com um especialista Vettrus",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-base text-[#333]"
              >
                <span
                  aria-hidden="true"
                  className="size-[7px] shrink-0 rounded-full bg-primary"
                />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Coluna direita — form */}
        <Reveal>
          {mutation.isSuccess ? (
            <div className="rounded-[18px] border border-primary/50 bg-[#F6F6F3] p-9 text-center sm:p-14">
              <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-primary/[0.18]">
                <svg
                  viewBox="0 0 24 24"
                  className="size-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </div>
              <h3 className="text-[26px] font-bold text-[#141414]">
                Solicitação enviada!
              </h3>
              <p className="mt-3 text-base leading-relaxed text-[#555]">
                Nossa equipe entra em contato em minutos. Fique de olho no seu
                WhatsApp.
              </p>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={handleSubmit(onValid)}
              className="flex flex-col gap-[18px] rounded-[18px] border border-[#E4E4DF] bg-white p-7 shadow-[0_24px_60px_rgba(0,0,0,0.08)] sm:p-11"
            >
              {textFields.map((field) => {
                const err = errors[field.name]?.message;
                const invalid = err ? "border-danger" : "";

                if (field.name === "whatsapp") {
                  return (
                    <label key={field.name} className="flex flex-col gap-[7px]">
                      <span className={labelBase}>{field.label}</span>
                      <input
                        {...whatsapp}
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder={field.placeholder}
                        className={`${inputBase} ${invalid}`}
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
                    <label key={field.name} className="flex flex-col gap-[7px]">
                      <span className={labelBase}>{field.label}</span>
                      <input
                        {...email}
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder={field.placeholder}
                        className={`${inputBase} ${invalid}`}
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
                  <label key={field.name} className="flex flex-col gap-[7px]">
                    <span className={labelBase}>{field.label}</span>
                    <input
                      {...register(field.name)}
                      type={field.type}
                      autoComplete="name"
                      placeholder={field.placeholder}
                      className={`${inputBase} ${invalid}`}
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
                  <label key={choice.name} className="flex flex-col gap-[7px]">
                    <span className={labelBase}>{choice.label}</span>
                    <select
                      {...register(choice.name)}
                      defaultValue=""
                      className={`${inputBase} text-[#555] ${
                        err ? "border-danger" : ""
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
                className="mt-2 rounded-[10px] bg-primary px-8 py-[17px] text-base font-bold text-primary-foreground transition-[background,transform] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {mutation.isPending
                  ? "Enviando..."
                  : "Quero agendar minha análise gratuita"}
              </button>
              <p className="text-center text-xs text-[#999]">
                Resposta em minutos, direto no seu WhatsApp.
              </p>
            </form>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
