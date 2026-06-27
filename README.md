# Alex Moreno — S&C Coach · Booking Platform

A full-stack booking and session management platform for **Alex Moreno**, a Barcelona-based strength and conditioning coach. Clients can discover sessions, book slots, and manage their profile; the admin dashboard provides session CRUD, client management, calendar availability rules, reporting, and audit history.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [TanStack Start](https://tanstack.com/start) (SSR + file-based routing) |
| **UI Library** | React 19 |
| **Routing** | [TanStack Router](https://tanstack.com/router) v1 — type-safe file-based routing |
| **Data Fetching** | [TanStack React Query](https://tanstack.com/query) v5 |
| **Component Library** | [shadcn/ui](https://ui.shadcn.com) — built on Radix Primitives |
| **Styling** | TailwindCSS v4 + `tw-animate-css` |
| **Forms** | react-hook-form + zod (via `@hookform/resolvers`) |
| **Charts** | recharts |
| **Toast** | sonner — positioned top-left |
| **Icons** | lucide-react |
| **Date Utils** | date-fns v4 |
| **Database** | PostgreSQL 17 (Supabase) |
| **Auth** | Supabase Auth (email + password) |
| **Backend Logic** | Supabase Edge Functions |
| **File Storage** | Supabase Storage (avatars, session media) |
| **Deployment** | Vercel |
| **Error Tracking** | Sentry |
| **Scaffolding** | Lovable |

---

## Project Structure

```
src/
├── assets/                 # Static images
├── components/
│   ├── admin/              # Admin-specific components
│   ├── auth/               # Login/signup forms, auth guard
│   ├── bookings/           # Booking card, status badges
│   ├── shared/             # PageHeader, StatusBadge, ConfirmDialog, etc.
│   ├── site/               # Landing page sections (Hero, Schedule, etc.)
│   └── ui/                 # shadcn primitives (button, dialog, form, table, etc.)
├── hooks/                  # Custom React hooks
│   ├── use-auth.ts
│   ├── use-bookings.ts
│   ├── use-clients.ts
│   ├── use-sessions.ts
│   └── use-availability.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser Supabase client
│   │   └── server.ts       # SSR-safe Supabase client
│   └── utils.ts             # cn() helper (clsx + tailwind-merge)
├── providers/
│   └── auth-provider.tsx   # Auth context wrapping Supabase session
├── routes/
│   ├── __root.tsx           # App shell — QueryClientProvider, AuthProvider, Toaster
│   ├── index.tsx            # Public landing page
│   ├── login.tsx            # Email + password login
│   ├── signup.tsx           # Registration
│   └── _user/               # Authenticated user routes
│       ├── profile.tsx
│       └── bookings/
│   └── _admin/              # Admin routes (role-gated)
│       └── admin/
│           ├── index.tsx    # Dashboard
│           ├── categories/
│           ├── sessions/
│           ├── session-types/
│           ├── bookings/
│           ├── clients/
│           ├── reporting.tsx
│           ├── settings.tsx
│           └── calendar.tsx
├── router.tsx               # TanStack Router setup
├── server.ts                # SSR error wrapper
├── start.ts                 # TanStack Start instance
└── styles.css               # Global styles + design tokens
```

---

## Database Schema

9 core tables managed via Supabase migrations:

- **profiles** — Extended user data (name, address, phone, role, ban status)
- **categories** — Dynamically managed session groupings (Strength, Conditioning, Mobility, etc.)
- **session_types** — Reusable session templates linked to a category
- **sessions** — Concrete session occurrences with date/time, location, price, capacity
- **bookings** — Links users to sessions with status tracking (confirmed, cancelled, no-show, completed)
- **session_availability_rules** — Recurring weekly patterns stored as `jsonb` (RRULE-compatible format)
- **session_availability_exceptions** — One-off overrides to recurring rules
- **login_history** — Audit trail of all user sign-ins
- **booking_history** — Audit trail of all booking status changes
- **session_history** — Audit trail of all session field changes

All tables have Row-Level Security (RLS) enforced, with role-based access (user, client, admin, banned).

---

## Roles & Permissions

| Role | Description |
|------|-------------|
| `user` | Signed up, no bookings yet |
| `client` | Has booked at least one session |
| `admin` | Full access to all admin pages |
| `banned` | Blocked from accessing any authenticated page |

---

## Key Features

### Public
- Landing page with hero, weekly schedule, testimonials, logistics info
- Weekly schedule fetched live from Supabase (replaces the original static mock data)
- Book button → auth gate → booking flow

### User / Client
- Profile management (name, phone, avatar, address)
- View and manage personal bookings
- Cancel bookings (with reason) within the configurable cancellation window

### Admin
- **Dashboard** — Stats overview (occupancy, revenue, bookings, client count)
- **Categories** — CRUD for dynamic session categories
- **Session Types** — CRUD for reusable session templates linked to categories
- **Sessions** — CRUD for individual time slots; cancel sessions with reason
- **Bookings** — Manage all bookings, change status, check-in clients
- **Clients** — User management, role changes, ban/unban
- **Calendar** — Manage recurring availability rules (jsonb recurrence), set exceptions (cancel/add/modify), generate upcoming sessions
- **Reporting** — Charts for bookings, revenue, occupancy, client growth
- **Settings** — Configurable cancellation window, business hours, session generation horizon

### History & Audit
- Booking status changes automatically recorded via DB triggers
- Session field changes versioned in `session_history`
- Every login logged in `login_history`

---

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase project URL, anon key, and service role key

# Start dev server
npm run dev
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key (client-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side only) |
| `VITE_SENTRY_DSN` | Sentry error tracking DSN (optional) |

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

---

## Design System

- **Fonts**: Bebas Neue (display headings) + Inter (body)
- **Dark theme**: Near-black background (`#0E0E0E`) with warm off-white text (`#EAE6DF`)
- **Accent**: Orange (`#FF5A1F`) — used for CTAs, highlights, emphasis
- **Surfaces**: layered dark grays (`#1A1A1A`, `#2D2D2D`)
- **Borders**: Subtle `oklch(1 0 0 / 10%)` hairline rules
- **Toasts**: Sonner, positioned top-left
- **Components**: shadcn primitives throughout — Button, Card, Table, Dialog, Form, Badge, Tabs, etc.
