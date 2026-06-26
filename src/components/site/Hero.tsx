import { ChevronDown } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import portrait from "@/assets/coach-portrait.jpg";

export function Hero() {
  const { ref, inView } = useInView();

  return (
    <section id="top" className="relative border-b border-hairline" ref={ref}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:pb-32 lg:pt-24">
        <div className="lg:col-span-7 lg:pt-6">
          <div
            className={`mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-muted-foreground motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
              inView
                ? "animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700 motion-reduce:animate-none"
                : "opacity-0"
            }`}
          >
            <span className="h-px w-8 bg-accent" />
            Barcelona · Strength &amp; Conditioning
          </div>

          <h1
            className={`font-display text-[clamp(3rem,9vw,7rem)] leading-[0.92] tracking-tight text-foreground motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
              inView
                ? "animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700 motion-reduce:animate-none"
                : "opacity-0"
            }`}
            style={{ animationDelay: inView ? "100ms" : "0ms" }}
          >
            Get strong.<br />
            Stay consistent.<br />
            <span className="text-accent">Train efficiently.</span>
          </h1>

          <p
            className={`mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
              inView
                ? "animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700 motion-reduce:animate-none"
                : "opacity-0"
            }`}
            style={{ animationDelay: inView ? "200ms" : "0ms" }}
          >
            1-on-1 strength and conditioning for busy professionals.
            Studio sessions in Poblenou and outdoor training across
            Ciutadella, Montjuïc and Barceloneta.
          </p>

          <div
            className={`mt-10 flex flex-wrap items-center gap-6 motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
              inView
                ? "animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700 motion-reduce:animate-none"
                : "opacity-0"
            }`}
            style={{ animationDelay: inView ? "300ms" : "0ms" }}
          >
            <a
              href="#schedule"
              className="group inline-flex items-center gap-3 bg-accent px-7 py-4 text-xs font-medium uppercase tracking-[0.22em] text-accent-foreground transition hover:brightness-110"
            >
              Book Your Session
              <span aria-hidden className="transition group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#schedule"
              className="text-xs uppercase tracking-[0.22em] text-foreground underline decoration-hairline decoration-1 underline-offset-[6px] transition hover:decoration-accent"
            >
              View Schedule ↓
            </a>
          </div>

          <dl
            className={`mt-16 grid grid-cols-3 gap-6 border-t border-hairline pt-8 text-left motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
              inView
                ? "animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700 motion-reduce:animate-none"
                : "opacity-0"
            }`}
            style={{ animationDelay: inView ? "400ms" : "0ms" }}
          >
            {[
              { k: "10+", v: "Years coaching" },
              { k: "1:1", v: "Every session" },
              { k: "45/60", v: "Minute formats" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-display text-3xl text-accent sm:text-4xl">{s.k}</dt>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          className={`relative lg:col-span-5 motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
            inView
              ? "animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700 motion-reduce:animate-none"
              : "opacity-0"
          }`}
          style={{ animationDelay: inView ? "100ms" : "0ms" }}
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface">
            <img
              src={portrait}
              alt="Alex Moreno, strength and conditioning coach"
              className="h-full w-full object-cover grayscale-[15%]"
              loading="eager"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 text-[10px] uppercase tracking-[0.22em] text-foreground">
              <span>Alex Moreno</span>
              <span className="text-accent">S&amp;C Coach</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-1000 motion-reduce:opacity-100 ${
          inView ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: inView ? "1000ms" : "0ms" }}
      >
        <ChevronDown className="h-5 w-5 animate-bounce text-muted-foreground motion-reduce:animate-none" />
      </div>
    </section>
  );
}
