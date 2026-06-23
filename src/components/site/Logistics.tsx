const ITEMS = [
  {
    k: "Base",
    v: "Carrer de Pujades, Poblenou — Barcelona, Spain",
  },
  {
    k: "Outdoor locations",
    v: "Parc de la Ciutadella · Montjuïc · Barceloneta · Poblenou",
  },
  {
    k: "Session length",
    v: "45 or 60 minutes. 75 min for Saturday open sessions.",
  },
  {
    k: "What to bring",
    v: "Training shoes, water, towel. Studio provides the rest.",
  },
  {
    k: "Good fit for",
    v: "Busy professionals, expats, returning lifters who want structure.",
  },
  {
    k: "Not for",
    v: "Bootcamp vibes, motivational shouting, weekly weigh-ins.",
  },
];

export function Logistics() {
  return (
    <section id="logistics" className="border-b border-hairline">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          <span className="h-px w-8 bg-accent" />
          Logistics
        </div>
        <h2 className="font-display text-5xl leading-none tracking-tight text-foreground sm:text-6xl">
          The practical bits.
        </h2>

        <dl className="mt-12 grid grid-cols-1 gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((i) => (
            <div key={i.k} className="bg-background p-6">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-accent">{i.k}</dt>
              <dd className="mt-3 text-base leading-relaxed text-foreground">{i.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
