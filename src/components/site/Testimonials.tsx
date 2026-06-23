import c1 from "@/assets/community-1.jpg";
import c2 from "@/assets/community-2.jpg";
import c3 from "@/assets/community-3.jpg";

const QUOTES = [
  {
    q: "Two sessions a week and I&apos;m squatting more than I did at 25. No drama, just steady progress.",
    a: "Marc, 38, Product Manager",
  },
  {
    q: "First coach who actually programmed around my travel schedule instead of guilt-tripping me about it.",
    a: "Tomás, 34, Consultant",
  },
  {
    q: "The outdoor sessions at Ciutadella are the only reason I look forward to Monday mornings.",
    a: "James, 41, Engineer",
  },
];

export function Testimonials() {
  return (
    <section className="border-b border-hairline bg-surface/40">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          <span className="h-px w-8 bg-accent" />
          What clients say
        </div>
        <h2 className="font-display text-5xl leading-none tracking-tight text-foreground sm:text-6xl">
          Real people. Real reps.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-px bg-hairline sm:grid-cols-3">
          {QUOTES.map((t, i) => (
            <figure key={i} className="bg-background p-8">
              <div className="font-display text-3xl text-accent">&ldquo;</div>
              <blockquote
                className="mt-2 text-base leading-relaxed text-foreground"
                dangerouslySetInnerHTML={{ __html: t.q }}
              />
              <figcaption className="mt-6 border-t border-hairline pt-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {t.a}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-px bg-hairline">
          {[c1, c2, c3].map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden bg-background">
              <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
