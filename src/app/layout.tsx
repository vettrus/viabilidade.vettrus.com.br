import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { SITE_URL, site } from "@/lib/site";
import { Providers } from "./providers";
import { Analytics, GTM_ID } from "@/components/analytics";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const title =
  "Análise de Viabilidade de Importação — Vettrus | Descubra se importar faz sentido pro seu negócio";
const description =
  "Faça uma análise gratuita com um especialista Vettrus e descubra, em cerca de 1 hora, se importar faz sentido para a sua empresa. Enquanto você compra de distribuidor, seu concorrente importa.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  appleWebApp: { capable: false, title: "Viabilidade Vettrus" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: `${site.service} — ${site.name}`,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${site.service} — ${site.tagline}`,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Analytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
