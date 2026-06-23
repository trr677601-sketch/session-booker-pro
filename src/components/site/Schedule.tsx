import { useState } from "react";
import { SCHEDULE, type ClassSlot } from "@/lib/schedule";

function focusColor(focus: ClassSlot["focus"]) {
  switch (focus) {
    case "Strength":
      return "border-foreground/40 text-foreground";
    case "Conditioning":
      return "border-accent/60 text-accent";
    case "Mobility":
      return "border-muted-foreground/40 text-muted-foreground";
  }
}

function Chip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${className}`}
    >
      {children}
    </span>
  );
}

function Row({ slot, onBook }: { slot: ClassSlot; onBook: (id: string) => void }) {
  const full = slot.spots === 0;
  return (
    <div
      id={`slot-${slot.id}`}
      className={`grid grid-cols-12 items-center gap-4 border-b border-hairline px-4 py-5 transition hover:bg-surface/60 sm:px-6 ${full ? "opacity-60" : ""}`}
    >
      <div className="col-span-3 sm:col-span-2">
        <div className="font-display text-3xl leading-none text-accent sm:text-4xl">
          {slot.time}
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {slot.duration} min
        </div>
      </div>

      <div className="col-span-9 sm:col-span-5">
        <div className="text-base font-medium text-foreground sm:text-lg">{slot.name}</div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip className={focusColor(slot.focus)}>{slot.focus}</Chip>
          <Chip className="border-hairline text-muted-foreground">
            {slot.location}
            {slot.area ? ` · ${slot.area}` : ""}
          </Chip>
        </div>
      </div>

      <div className="col-span-7 mt-2 sm:col-span-2 sm:mt-0">
        {full ? (
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Fully booked
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {slot.spots} {slot.spots === 1 ? "spot" : "spots"} left
          </span>
        )}
      </div>

      <div className="col-span-5 mt-2 flex justify-end sm:col-span-3 sm:mt-0">
        <button
          onClick={() => !full && onBook(slot.id)}
          disabled={full}
          className="group inline-flex items-center gap-2 border border-hairline px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-foreground transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-hairline disabled:hover:text-foreground"
        >
          {full ? "Waitlist" : "Book"}
          {!full && <span aria-hidden className="transition group-hover:translate-x-1">→</span>}
        </button>
      </div>
    </div>
  );
}

export function Schedule() {
  const [active, setActive] = useState(SCHEDULE[0].key);
  const day = SCHEDULE.find((d) => d.key === active)!;

  function handleBook(id: string) {
    const el = document.getElementById(`slot-${id}`);
    if (el) {
      el.classList.remove("flash");
      void el.offsetWidth;
      el.classList.add("flash");
    }
  }

  return (
    <section id="schedule" className="border-b border-hairline">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              <span className="h-px w-8 bg-accent" />
              Weekly Schedule
            </div>
            <h2 className="font-display text-5xl leading-none tracking-tight text-foreground sm:text-6xl">
              Pick a time. Book it.
            </h2>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            Recurring weekly slots. Sessions are 1-on-1 unless marked otherwise.
            Spots refresh every Sunday at 21:00 CET.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-1 border-b border-hairline">
          {SCHEDULE.map((d) => {
            const isActive = d.key === active;
            return (
              <button
                key={d.key}
                onClick={() => setActive(d.key)}
                className={`-mb-px border-b-2 px-4 py-3 text-[11px] uppercase tracking-[0.22em] transition ${
                  isActive
                    ? "border-accent text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {d.short}
              </button>
            );
          })}
        </div>

        <div className="mt-2 border border-hairline border-t-0 bg-background">
          <div className="hidden grid-cols-12 gap-4 border-b border-hairline px-6 py-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:grid">
            <div className="col-span-2">Time</div>
            <div className="col-span-5">Session</div>
            <div className="col-span-2">Availability</div>
            <div className="col-span-3 text-right">Action</div>
          </div>
          {day.slots.map((s) => (
            <Row key={s.id} slot={s} onBook={handleBook} />
          ))}
        </div>
      </div>
    </section>
  );
}
