export function RepeatCTA() {
  return (
    <section className="border-b border-hairline">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
          <h2 className="font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] tracking-tight text-foreground lg:col-span-8">
            Pick a time.<br />
            Show up.<br />
            <span className="text-accent">Get to work.</span>
          </h2>
          <div className="lg:col-span-4">
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Next available slots open this week. One click to lock in your session.
            </p>
            <a
              href="#schedule"
              className="group inline-flex w-full items-center justify-between gap-3 bg-accent px-7 py-5 text-xs font-medium uppercase tracking-[0.22em] text-accent-foreground transition hover:brightness-110"
            >
              Book Your Session
              <span aria-hidden className="transition group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
