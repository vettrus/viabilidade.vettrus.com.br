import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <span className="rounded-md border border-primary/60 px-3 py-1 text-sm font-bold text-primary">
        404
      </span>
      <h1 className="mt-6 text-4xl font-extrabold text-heading sm:text-5xl">
        Página não encontrada
      </h1>
      <p className="mt-3 text-muted-foreground">
        O endereço acessado não existe ou foi movido.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-md border border-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
