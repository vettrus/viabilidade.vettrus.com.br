export function Header() {
  return (
    <header
      id="topo"
      className="sticky top-0 z-50 bg-primary shadow-gold-soft"
      data-node-id="247:91"
    >
      <div className="mx-auto flex min-h-[64px] w-full max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-2 px-6 py-3 text-center sm:min-h-[80px] lg:px-8">
        <span className="text-xl font-extrabold uppercase leading-tight tracking-tight text-ink sm:text-2xl lg:text-[35px]">
          Valide sua importação
        </span>

        <span className="bg-ink px-3 py-1 text-xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-2xl lg:text-[35px]">
          Com uma análise gratuita!
        </span>
      </div>
    </header>
  );
}
