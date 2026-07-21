export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://viabilidade.vettrus.com.br";

export const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL ?? "#agendar";

export const CTA_URL = CHECKOUT_URL;

export const site = {
  name: "Vettrus",
  service: "Análise de Viabilidade de Importação",
  legalName: "Vettrus Soluções Internacionais",
  tagline: "Importar não é sorte. É método.",
  email: "comercial6@vettrus.com.br",
  phone: "13 99750 2353",
  instagram: "https://www.instagram.com/vettrusimportacao",
  linkedin: "https://www.linkedin.com/company/vettrusimportacao/",
} as const;
