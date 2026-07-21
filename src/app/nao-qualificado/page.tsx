import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Obrigado pelo interesse — Vettrus",
  robots: { index: false, follow: false },
  openGraph: null,
  twitter: null,
};

const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=5513997502353&text=Ol%C3%A1%2C+vim+da+Viabilidade+Vettrus+e+tenho+capital+pr%C3%B3prio&type=phone_number&app_absent=0";
const METODO_URL = "https://metodo.vettrus.com.br/";

export default function NaoQualificado() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background py-16">
      <Container className="max-w-3xl">
        <div className="rounded-2xl border border-border bg-card/70 p-8 shadow-ambient sm:p-12">
          <Image
            src="https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/logo-vettrus.png"
            alt="Vettrus"
            width={368}
            height={84}
            priority
            className="h-11 w-auto"
          />

          <h1 className="mt-8 text-3xl font-extrabold text-heading sm:text-4xl">
            Agradecemos seu interesse na Vettrus!
          </h1>

          <div className="mt-6 flex flex-col gap-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              Pelas informações preenchidas, identificamos que sua empresa ainda
              está abaixo do perfil que normalmente atendemos para projetos de
              importação. Em geral, recomendamos operações para empresas que já
              faturam{" "}
              <strong className="text-heading">acima de R$ 50 mil por mês</strong>
              , garantindo mais viabilidade e segurança.
            </p>
            <p>
              Se você possui{" "}
              <strong className="text-heading">
                capital próprio para iniciar a importação
              </strong>
              , fale com nossa equipe pelo WhatsApp — vamos avaliar o seu caso.
            </p>
            <p>
              Enquanto isso, recomendamos o{" "}
              <strong className="text-heading">
                Método Vettrus de Importação
              </strong>
              , um treinamento completo para você aprender a importar com
              estratégia e chegar mais preparado ao momento de iniciar sua
              operação.
            </p>
            <p className="text-heading">
              Esperamos poder fazer parte da sua jornada em breve! 🤝
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 flex-1 items-center justify-center rounded-md bg-primary px-6 text-center text-base font-extrabold uppercase tracking-wide text-primary-foreground shadow-gold-soft transition-transform hover:-translate-y-0.5"
            >
              Vamos avaliar o seu caso
            </a>
            <a
              href={METODO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 flex-1 items-center justify-center rounded-md border border-primary px-6 text-center text-base font-extrabold uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Conhecer o Método Vettrus
            </a>
          </div>
        </div>
      </Container>
    </main>
  );
}
