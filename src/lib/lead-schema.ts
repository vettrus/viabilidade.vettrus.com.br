import { z } from "zod";

export const CNPJ_OPTIONS = ["Sim", "Não"] as const;

export const FATURAMENTO_OPTIONS = [
  "Não faturo",
  "Menos de 50 mil",
  "De 50 mil a 100 mil",
  "Acima de 100 mil",
] as const;

// Faturamento abaixo do perfil atendido: não envia ao Kommo, redireciona.
export const DISQUALIFYING_FATURAMENTO = [
  "Não faturo",
  "Menos de 50 mil",
] as const;

export function isDisqualified(faturamento: string | undefined): boolean {
  return (DISQUALIFYING_FATURAMENTO as readonly string[]).includes(
    faturamento ?? "",
  );
}

export const CANAL_OPTIONS = [
  "Loja física",
  "E-commerce / marketplace",
  "Indústria",
  "Distribuição / atacado",
] as const;

export const OBJETIVO_OPTIONS = [
  "Importar produto que já vendo",
  "Criar marca própria",
  "Buscar novos produtos",
  "Reduzir custo do fornecedor atual",
] as const;

// WhatsApp mask: (00) 00000-0000
const PHONE_RE = /^\(\d{2}\) \d{5}-\d{4}$/;

export const leadSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome completo"),
  whatsapp: z
    .string()
    .regex(PHONE_RE, "Informe um WhatsApp válido: (00) 00000-0000"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um e-mail corporativo válido"),
  cnpj: z.enum(CNPJ_OPTIONS, { message: "Selecione uma opção" }),
  faturamento: z.enum(FATURAMENTO_OPTIONS, { message: "Selecione uma opção" }),
  canal: z.enum(CANAL_OPTIONS, { message: "Selecione uma opção" }),
  objetivo: z.enum(OBJETIVO_OPTIONS, { message: "Selecione uma opção" }),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Format raw input into the WhatsApp mask `(00) 00000-0000`. */
export function maskPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.replace(/^(\d{0,2})/, "($1");
  if (d.length <= 7) return d.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  return d.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

/** Normalize an e-mail as the user types: no spaces, lowercase. */
export function normalizeEmail(value: string): string {
  return value.replace(/\s+/g, "").toLowerCase();
}
