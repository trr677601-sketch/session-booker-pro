export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-12 sm:grid-cols-3 sm:px-8">
        <div>
          <div className="font-display text-xl tracking-wide text-foreground">ALEX MORENO</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            S&amp;C Coach · Barcelona
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Carrer de Pujades<br />
          08005 Poblenou, Barcelona
        </div>
        <div className="text-sm sm:text-right">
          <a href="mailto:alex@morenosc.com" className="block text-foreground transition hover:text-accent">
            alex@morenosc.com
          </a>
          <a
            href="https://instagram.com"
            className="mt-1 block text-muted-foreground transition hover:text-accent"
          >
            @morenosc
          </a>
        </div>
      </div>
      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:px-8">
          <span>© {new Date().getFullYear()} Moreno S&amp;C</span>
          <span>Barcelona, ES</span>
        </div>
      </div>
    </footer>
  );
}
