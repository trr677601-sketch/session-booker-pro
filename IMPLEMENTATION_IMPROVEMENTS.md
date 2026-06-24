# Frontend Improvement Implementation Plan

> **Project**: Alex Moreno — S&C Coach, Barcelona  
> **Goal**: Improve UX and UI of the single-page booking site without backend changes

---

## 1. Booking Modal / Sheet on "Book" Buttons

The schedule's "Book" buttons currently only flash the row. Replace with a shadcn `Dialog` or `Sheet` that opens on click.

- [ ] Pick `Dialog` or `Sheet` component from the installed shadcn library
- [ ] Create a `BookingModal` component accepting session data (time, name, location)
- [ ] Wire each schedule row's "Book" button to open the modal with that session's details
- [ ] Display session summary inside the modal (time, focus, location)
- [ ] Add a "Book on Calendly" external link or a "Call to book" CTA inside the modal
- [ ] Handle closing / backdrop dismiss
- [ ] Test on mobile — ensure the modal is scrollable and thumb-friendly

---

## 2. Scroll-Triggered Section Animations

Add Intersection Observer-based fade-in/up animations so sections appear as the user scrolls.

- [ ] Choose approach: lightweight custom hook vs. `framer-motion` vs. CSS + `IntersectionObserver`
- [ ] Create a reusable `AnimateOnScroll` component or hook
- [ ] Apply to: Hero stats bar, Trust, Testimonials, Logistics, RepeatCTA
- [ ] Animate the stats numbers (10+ years, 1:1, 45/60 min) — count-up effect on entry
- [ ] Define consistent animation config (duration, easing, stagger delay)
- [ ] Respect `prefers-reduced-motion` — disable animations for accessibility

---

## 3. Sticky Schedule Day Tabs

Make the day tabs (Mon–Sat) sticky so they remain visible when scrolling through a day's sessions.

- [ ] Identify the tab bar element in `Schedule.tsx`
- [ ] Apply `position: sticky; top: 0` with a z-index that sits below the TopBar but above schedule rows
- [ ] Ensure the TopBar (which is also sticky) has a higher z-index so tabs slide under it
- [ ] Account for the TopBar height offset — tabs should stick just below it
- [ ] Test on tall session lists (e.g., Monday with 6 rows) to confirm tabs stay put
- [ ] Test on mobile where the viewport is shorter

---

## 4. Mobile-Friendly Schedule View

The table layout for the schedule is likely cramped on small screens. Improve with an alternative mobile layout.

- [ ] Define breakpoint at which the table collapses (e.g., `md` = 768px)
- [ ] Design mobile view: stacked card per session or accordion by time slot
- [ ] On mobile, show each session as a compact card (time, name, focus chip, spots)
- [ ] Keep the "Book" button prominent on each card
- [ ] Keep day tabs (now sticky) to switch days on mobile
- [ ] Consider a horizontal swipeable day picker as an alternative to tabs on mobile
- [ ] Test on real mobile viewports (375px–414px width)

---

## 5. Image Lazy Loading & Lightbox

Optimize image loading and add a lightbox for the community photo strip and coach imagery.

- [ ] Add `loading="lazy"` to all `<img>` tags in Hero, Trust, and Testimonials
- [ ] Add `decoding="async"` for non-critical images
- [ ] For the coach portrait (`Hero.tsx`), consider keeping it `eager` (above the fold)
- [ ] Build a simple `Lightbox` component using shadcn `Dialog` (already available)
- [ ] Wire the 3 community photos to open the lightbox with a carousel/prev-next
- [ ] Add a subtle "tap to expand" hint on image hover (scale + overlay)

---

## 6. Micro-Interactions & Polish

Small motion details that make the UI feel responsive and premium.

- [ ] Add `hover:scale-[1.02]` + smooth `transition-transform` on all CTA buttons
- [ ] Shrink the TopBar padding and logo size on scroll (scroll-shrink effect)
- [ ] Add a subtle scroll-progress bar at the very top of the page
- [ ] Smooth anchor scrolling with an offset for the sticky TopBar height
- [ ] Add a `focus-visible` ring style for keyboard navigation on interactive elements
- [ ] Add a subtle underline animation on nav links on hover

---

## 7. Testimonial Carousel

Convert the static testimonial block into an auto-rotating carousel with manual controls.

- [ ] Choose approach: shadcn `Carousel` (already installed) vs. custom CSS scroll-snap
- [ ] Create a `TestimonialCarousel` component wrapping the 3 quotes
- [ ] Add dot indicators for current slide
- [ ] Add previous/next arrow buttons (hidden on mobile, optional on desktop)
- [ ] Auto-rotate every 6–8 seconds, pause on hover / focus
- [ ] Ensure each slide is a semantic `<figure>` with `<blockquote>` and `<figcaption>`
- [ ] If time allows, reduce the 3 community photos to 1 visible at a time per slide

---

## 8. Active Section Highlight in Nav

Track which section the user is currently viewing and reflect it in the TopBar navigation.

- [ ] Use `IntersectionObserver` on each major section (Hero, Schedule, Trust, Testimonials, Logistics)
- [ ] Track the "most visible" section in state
- [ ] If nav links are added (e.g., "Schedule", "About", "Location"), highlight the active one
- [ ] At minimum, show a visual indicator of scroll progress relative to sections
- [ ] Update the active section on scroll with throttling (or use a `scroll` event with `requestAnimationFrame`)

---

## 9. Prune Unused shadcn Components

Clean up the 40+ installed shadcn components that are not used anywhere.

- [ ] Audit `src/components/ui/` — identify which components are actually imported
- [ ] Remove component files with no references in the codebase
- [ ] Update `components.json` if needed
- [ ] Verify no build errors after removal
- [ ] Double-check that `Button` and other basic components remain if they might be used soon

---

## 10. Sticky Mobile Bottom "Book" Bar

Add a small, fixed bottom bar on mobile with a single "Book Your Session" CTA.

- [ ] Create a `MobileStickyBar` component
- [ ] Show only on viewports below `md` breakpoint
- [ ] Include a prominent "Book Your Session" button that scrolls to `#schedule`
- [ ] Give it a subtle background blur (Tailwind `backdrop-blur`) so content shows through
- [ ] Ensure it doesn't overlap the Footer (hide at the bottom of the page)
- [ ] Add `safe-area-inset-bottom` padding for notched phones
- [ ] Test on iOS Safari and Chrome on Android (if possible) for bottom bar overlap issues

---

## Progress Tracker

| # | Improvement | Status |
|---|-------------|--------|
| 1 | Booking Modal / Sheet | ☐ |
| 2 | Scroll-Triggered Animations | ☐ |
| 3 | Sticky Schedule Day Tabs | ☐ |
| 4 | Mobile-Friendly Schedule | ☐ |
| 5 | Image Lazy Loading & Lightbox | ☐ |
| 6 | Micro-Interactions & Polish | ☐ |
| 7 | Testimonial Carousel | ☐ |
| 8 | Active Section Nav Highlight | ☐ |
| 9 | Prune Unused shadcn | ☐ |
| 10 | Sticky Mobile Bottom Bar | ☐ |
