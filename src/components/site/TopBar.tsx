export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-baseline gap-2 text-foreground">
          <span className="font-display text-xl leading-none tracking-wide">ALEX MORENO</span>
          <span className="hidden text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:inline">
            / S&amp;C · Barcelona
          </span>
        </a>
        <a
          href="#schedule"
          className="inline-flex items-center gap-2 bg-accent px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-accent-foreground transition hover:brightness-110"
        >
          Book a Session
          <span aria-hidden>→</span>
        </a>
      </div>
    </header>
  );
}
