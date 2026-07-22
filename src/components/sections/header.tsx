export function Header() {
  return (
    <header
      id="topo"
      className="relative bg-primary"
      data-node-id="247:91"
    >
      <div className="mx-auto flex min-h-[44px] w-full max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-2 text-center sm:min-h-[64px] sm:gap-x-3 sm:px-6 sm:py-3 lg:px-8">
        <span className="text-sm font-extrabold uppercase leading-tight tracking-tight text-ink sm:text-lg lg:text-[20px]">
          Valide sua importação
        </span>

        <a
          href="#agendar"
          className="bg-ink px-2 py-1 text-sm font-extrabold uppercase leading-tight tracking-tight text-white transition-colors hover:text-primary sm:px-3 sm:text-lg lg:text-[20px]"
        >
          Com uma análise gratuita!
        </a>
      </div>
    </header>
  );
}
