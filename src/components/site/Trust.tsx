import studio from "@/assets/studio.jpg";
import outdoor from "@/assets/outdoor.jpg";

const BULLETS = [
  {
    n: "01",
    h: "10+ years of coaching",
    p: "Trained competitive athletes, desk-bound professionals and returning lifters. The programming is the same craft, scaled to you.",
  },
  {
    n: "02",
    h: "Strength-first, evidence-based",
    p: "Compound lifts, structured progression, honest load management. No fads, no theatrics, no hype.",
  },
  {
    n: "03",
    h: "Same coach, every session",
    p: "You train with me — not a rotating roster. Consistency is the product.",
  },
];

export function Trust() {
  return (
    <section id="coach" className="border-b border-hairline">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              <span className="h-px w-8 bg-accent" />
              The Coach
            </div>
            <h2 className="font-display text-5xl leading-[0.95] tracking-tight text-foreground sm:text-6xl">
              Alex Moreno.<br />
              <span className="text-muted-foreground">Strength &amp; Conditioning.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Based in Barcelona. Works with busy professionals and expats
              who want structured, efficient training — indoors when it&apos;s
              focused work, outdoors when the city is the better gym.
            </p>
          </div>

          <ol className="space-y-px lg:col-span-7">
            {BULLETS.map((b) => (
              <li
                key={b.n}
                className="grid grid-cols-12 gap-4 border-t border-hairline py-6 last:border-b"
              >
                <div className="col-span-2 font-display text-2xl text-accent">{b.n}</div>
                <div className="col-span-10">
                  <h3 className="text-base font-medium text-foreground sm:text-lg">{b.h}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.p}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <figure className="relative aspect-[4/3] overflow-hidden bg-surface">
            <img src={studio} alt="Training studio interior" className="h-full w-full object-cover" loading="lazy" />
            <figcaption className="absolute bottom-3 left-3 bg-background/80 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground">
              Studio · Poblenou
            </figcaption>
          </figure>
          <figure className="relative aspect-[4/3] overflow-hidden bg-surface">
            <img src={outdoor} alt="Outdoor training in Barcelona" className="h-full w-full object-cover" loading="lazy" />
            <figcaption className="absolute bottom-3 left-3 bg-background/80 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground">
              Outdoor · Ciutadella
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
