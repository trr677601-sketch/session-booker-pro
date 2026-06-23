## Build plan: Alex Moreno — S&C Coach, Barcelona

Single-page, mobile-first site optimized for one job: get a visitor to the schedule and tap "Book".

### Visual direction
- Base: near-black `#0E0E0E`, surface `#1A1A1A`, text `#EAE6DF`, accent orange `#FF5A1F`. Orange used only for CTAs, availability dots, and key numerals.
- Typography: Bebas Neue (display, tight tracking) + Inter (body). Strong hierarchy, large numerals in schedule.
- Layout: generous spacing, thin hairline dividers, sharp corners (radius ~4px), no gradients, no glassmorphism. Subtle grain on hero only.
- Motion: restrained — fade/translate on section enter, hover underline on schedule rows. No parallax.

### Page structure (one route: `/`)

1. **Sticky top bar** — wordmark "ALEX MORENO / S&C" left, "Book a Session" orange button right. Always visible = booking one tap away.

2. **Hero**
   - H1: "Get strong. Stay consistent. Train efficiently."
   - Sub: "1-on-1 strength & conditioning in Barcelona — studio sessions and outdoor training across the city."
   - Primary CTA `Book Your Session` (orange) → scrolls to #schedule
   - Secondary text link `View Schedule ↓`
   - Right side: portrait of Alex (generated, male)

3. **Schedule / Classes** (the centerpiece)
   - Day tabs: Mon–Sat
   - Table-style rows per day, each row:
     - Time (large orange numeral) · Class name · Focus chip (Strength / Conditioning / Mobility) · Location chip (Studio / Outdoor) · Duration · Availability (orange dot + "2 spots" / muted "Full")
     - Row-level `Book` button on the right
   - ~6 recurring classes/day, hardcoded weekly template
   - Feels like a functional system, not marketing

4. **Trust**
   - Portrait + short bio block
   - 3 credibility bullets: "10+ years coaching", "Strength-first, evidence-based programming", "Same coach, every session — no rotating staff"
   - 2-up image grid: clean studio interior + Barcelona outdoor training (park/beach/urban)

5. **Social proof**
   - 3 short testimonials, 1–2 lines, attributed: "Marc, 38, Product Manager" etc.
   - 3-image community strip (studio + outdoor, male athletes per user preference)

6. **Logistics** — 5 compact info blocks in a grid:
   - Base: Carrer de [studio], Barcelona
   - Outdoor locations: Ciutadella, Montjuïc, Barceloneta, Poblenou
   - Session length: 45 / 60 min
   - What to bring: training shoes, water, towel
   - Who it's for / not for: 2 short lines each

7. **Repeat CTA section** — full-width near-black band, large headline "Pick a time. Show up. Get to work.", orange `Book Your Session` button → scrolls to #schedule.

8. **Footer** — minimal: location, IG handle, email, copyright.

### Booking behavior
All `Book` buttons (hero, every schedule row, repeat CTA, top bar) scroll to `#schedule` with the selected class row highlighted briefly. No modal, no form, no external link — wire real booking later.

### Imagery
Generate male-only photos via `imagegen`:
- Hero portrait (coach, athletic, neutral background)
- Studio interior (minimal, structured)
- Outdoor Barcelona training shot (park or beach, male athlete)
- 3 community shots for social proof strip

### Technical notes
- Single route: `src/routes/index.tsx`, replacing placeholder.
- Section components under `src/components/site/` (Hero, Schedule, Trust, Testimonials, Logistics, CTA, Footer, TopBar).
- Schedule data: `src/lib/schedule.ts` — typed weekly array.
- Tokens in `src/styles.css` under `@theme` (`--color-bg`, `--color-surface`, `--color-fg`, `--color-accent`). Bebas Neue + Inter via `<link>` in `__root.tsx` head; family names registered in `@theme`.
- Update `__root.tsx` head: title, description, og:title/description/image (hero portrait), twitter card.
- No backend, no Cloud, no auth.

### Out of scope (per brief)
No pricing, no lead forms, no email capture, no blog, no motivational copy.
