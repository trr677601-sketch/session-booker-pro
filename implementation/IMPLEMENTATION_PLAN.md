# Implementation Plan: Full Backend + Dashboards

> **Project**: Alex Moreno — S&C Coach, Barcelona  
> **Stack**: TanStack Start (React 19) + TanStack Router + React Query + shadcn/ui + TailwindCSS v4
> **Database & Auth**: Supabase (Postgres + Auth + Storage)
> **Deployment**: Vercel

---

## Table of Contents

1. [Phase 0 — Project Setup & Dependencies](#phase-0--project-setup--dependencies)
2. [Phase 1 — Supabase Schema & Migrations](#phase-1--supabase-schema--migrations)
3. [Phase 2 — Auth Layer (Supabase + TanStack Integration)](#phase-2--auth-layer)
4. [Phase 3 — Shared UI & Branding Guide](#phase-3--shared-ui--branding-guide)
5. [Phase 4 — User Pages (Profile, Bookings)](#phase-4--user-pages)
6. [Phase 5 — Admin Pages](#phase-5--admin-pages)
7. [Phase 6 — Availability Calendar (Rules & Exceptions)](#phase-6--availability-calendar)
8. [Phase 7 — History & Audit Tables](#phase-7--history--audit)
9. [Phase 8 — Polish, Edge Cases, Role Management](#phase-8--polish--role-management)

---

## Phase 0 — Project Setup & Dependencies

### 0.1 Install Supabase packages

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 0.2 Environment variables (`.env`)

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Add to `.env.example` and `.gitignore`.

### 0.3 Create Supabase project

- Go to [supabase.com](https://supabase.com) → New project
- Note the project URL, anon key, and service role key
- Enable Email + Password auth in Authentication → Providers
- Disable "Confirm email" initially for dev (can turn on later)

### 0.4 File structure additions

```
src/
  lib/
    supabase/
      client.ts          — browser client (anon key)
      server.ts          — server client (service role, SSR-safe)
      middleware.ts       — TanStack router auth guard
    supabase-types.ts    — generated or manual DB types
  components/
    shared/              — BrandAvatar, StatusBadge, RoleBadge, PageHeader, EmptyState, ConfirmDialog
    auth/                — LoginForm, SignupForm, AuthGuard
    admin/               — AdminSidebar, StatsCard, SessionForm, ClientTable
    bookings/            — BookingCard, BookingStatusBadge
  hooks/
    use-auth.ts          — auth context hook
    use-sessions.ts      — session queries/mutations
    use-bookings.ts      — booking queries/mutations
    use-clients.ts       — client queries/mutations
    use-availability.ts  — availability rules/exceptions
    use-history.ts       — history queries
  providers/
    auth-provider.tsx    — React context wrapping Supabase session

supabase/
  migrations/
    001_profiles.sql
    002_categories.sql
    003_session_types.sql
    004_sessions.sql
    005_bookings.sql
    006_availability_rules_exceptions.sql
    007_history_tables.sql
    008_rls_policies.sql
  seed.sql               — dev seed data
```

---

## Phase 1 — Supabase Schema & Migrations

### 1.1 Table: `profiles`

One row per auth user, created via a DB trigger on `auth.users`.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | references `auth.users(id)` |
| `email` | `text` | copied from auth.users |
| `full_name` | `text` | |
| `phone_prefix` | `text nullable` | country code, e.g. `+34` |
| `phone` | `text nullable` | phone number without prefix |
| `avatar_url` | `text nullable` | Supabase Storage path |
| `address_line_1` | `text nullable` | street + number |
| `address_line_2` | `text nullable` | apartment, floor, etc. |
| `postal_code` | `text nullable` | |
| `city` | `text nullable` | |
| `county` | `text nullable` | region / province |
| `country` | `text nullable` | |
| `role` | `text` | default `'user'` — values: `user`, `client`, `admin`, `banned` |
| `banned_at` | `timestamptz nullable` | |
| `ban_reason` | `text nullable` | |
| `created_at` | `timestamptz` | default `now()` |
| `updated_at` | `timestamptz` | auto-update via trigger |

**Triggers**:
- `handle_new_user()` — on `auth.users INSERT`, create a `profiles` row with email + role=`'user'`
- `auto_update_updated_at()` — before UPDATE on profiles

### 1.2 Table: `categories`

Dynamically managed session categories (no hardcoded enums — admins create/edit these freely).

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `name` | `text` | e.g. `Strength`, `Conditioning`, `Mobility` |
| `description` | `text nullable` | |
| `created_at` | `timestamptz` | default `now()` |
| `updated_at` | `timestamptz` | auto-update via trigger |

### 1.3 Table: `session_types`

Defines reusable session templates (e.g., "Sunrise Strength", "Mobility Reset"). Each type belongs to a category.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `title` | `text` | |
| `description` | `text nullable` | |
| `category_id` | `uuid FK nullable` | references `categories(id)` |
| `default_duration` | `integer` | minutes |
| `default_price` | `numeric(10,2)` | EUR per session |
| `default_max_slots` | `integer` | cap for bookings |
| `default_location` | `text` | `Studio`, `Outdoor` |
| `is_active` | `boolean` | default `true` |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

### 1.4 Table: `sessions`

Individual session occurrences (a concrete slot on a date/time).

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `session_type_id` | `uuid FK nullable` | links to session_types |
| `category_id` | `uuid FK nullable` | references `categories(id)` |
| `title` | `text` | denormalized from type or custom |
| `description` | `text nullable` | |
| `duration` | `integer` | minutes |
| `price` | `numeric(10,2)` | per-session price |
| `max_slots` | `integer` | |
| `location` | `text` | `Studio` / `Outdoor` |
| `area` | `text nullable` | e.g. `Barceloneta`, `Ciutadella`, `Montjuïc` |
| `start_time` | `timestamptz` | |
| `end_time` | `timestamptz` | computed as start_time + duration |
| `status` | `text` | `scheduled`, `cancelled`, `completed` |
| `cancel_reason` | `text nullable` | |
| `cancelled_at` | `timestamptz nullable` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

### 1.5 Table: `bookings`

Links a user to a session.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `user_id` | `uuid FK` | references profiles(id) |
| `session_id` | `uuid FK` | references sessions(id) |
| `status` | `text` | `confirmed`, `cancelled`, `no_show`, `completed` |
| `booked_at` | `timestamptz` | default `now()` |
| `cancelled_at` | `timestamptz nullable` | |
| `cancel_reason` | `text nullable` | |
| `checked_in_at` | `timestamptz nullable` | admin check-in |
| `notes` | `text nullable` | client or admin notes |

**Trigger**: After INSERT, if the user's role is `'user'`, promote to `'client'` (first booking).

### 1.5 Table: `session_availability_rules`

Recurring patterns that drive automatic session generation. The `recurrence` column uses a `jsonb` field to store a flexible rrule-like structure instead of individual fixed columns, supporting complex patterns (e.g., "every Mon/Wed/Fri at 06:30 for 60min", "every second Tuesday at 18:00").

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `session_type_id` | `uuid FK nullable` | optional link to type |
| `category_id` | `uuid FK nullable` | optional link to category |
| `title` | `text` | display name |
| `recurrence` | `jsonb` | structured rrule pattern (see below) |
| `is_active` | `boolean` | default `true` |
| `valid_from` | `date nullable` | first date this rule applies |
| `valid_until` | `date nullable` | last date this rule applies |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**`recurrence` jsonb structure:**

```json
{
  "frequency": "weekly",
  "by_day": ["MO", "WE", "FR"],
  "interval": 1,
  "start_time": "06:30",
  "duration": 60,
  "location": "Outdoor",
  "area": "Barceloneta",
  "max_slots": 6,
  "price": 35.00
}
```

- `frequency`: `"weekly"` (expandable later to `"daily"`, `"biweekly"`, `"monthly"`)
- `by_day`: ISO weekday codes (`"MO"`–`"SU"`), following the RRULE spec
- `interval`: every N weeks (default `1`)
- The remaining fields are the materialised defaults used when generating individual `sessions` rows

### 1.7 Table: `session_availability_exceptions`

One-off overrides to the recurring rules — cancel a session on a specific date, add an extra session, modify slots.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `rule_id` | `uuid FK nullable` | links to the rule being overridden |
| `session_id` | `uuid FK nullable` | directly link to existing session if modifying |
| `exception_date` | `date` | the date this exception applies |
| `action` | `text` | `cancel`, `add`, `modify` |
| `new_start_time` | `time nullable` | for modify/add |
| `new_duration` | `integer nullable` | |
| `new_max_slots` | `integer nullable` | |
| `new_price` | `numeric nullable` | |
| `reason` | `text nullable` | why this exception exists |
| `created_at` | `timestamptz` | |

### 1.8 Table: `login_history`

Audit log of every user login.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `user_id` | `uuid FK` | references profiles(id) |
| `ip_address` | `text nullable` | |
| `user_agent` | `text nullable` | |
| `logged_in_at` | `timestamptz` | default `now()` |

### 1.9 Table: `booking_history`

Audit log of all booking status changes.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `booking_id` | `uuid FK` | references bookings(id) |
| `changed_by` | `uuid FK` | references profiles(id) |
| `old_status` | `text nullable` | |
| `new_status` | `text` | |
| `change_reason` | `text nullable` | |
| `changed_at` | `timestamptz` | default `now()` |

### 1.10 Table: `session_history`

Audit log of all session changes (cancellation, rescheduling, etc.).

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | |
| `session_id` | `uuid FK` | references sessions(id) |
| `changed_by` | `uuid FK` | references profiles(id) |
| `field_changed` | `text` | e.g. `status`, `start_time`, `max_slots` |
| `old_value` | `text nullable` | |
| `new_value` | `text` | |
| `changed_at` | `timestamptz` | default `now()` |

### 1.11 Row-Level Security (RLS) Policies

Basic approach:

| Table | Policy |
|-------|--------|
| `profiles` | Users read own; admin reads all; admin writes ban/role |
| `categories` | All authenticated can read; admin write |
| `session_types` | All authenticated can read; admin write |
| `sessions` | All authenticated can read; admin write |
| `bookings` | Users read own; admin reads all; users create own; admin writes all |
| `session_availability_rules` | All authenticated read; admin write |
| `session_availability_exceptions` | All authenticated read; admin write |
| `login_history` | Admin only |
| `booking_history` | Admin only |
| `session_history` | Admin only |

### 1.12 Seed Data

Create `supabase/seed.sql` that:
- Inserts 3 categories (`Strength`, `Conditioning`, `Mobility`)
- Inserts 6 session types linked to their respective categories, matching the current mock schedule (Sunrise Strength, Foundations, Midday Conditioning, etc.)
- Inserts 2 weeks of individual sessions based on the existing `SCHEDULE` data (Mon–Sat, 4–6 slots per day)
- Inserts recurring availability rules (with `recurrence` jsonb) matching the weekly pattern

---

## Phase 2 — Auth Layer

### 2.1 Supabase client setup

**`src/lib/supabase/client.ts`** — browser-side Supabase client using `createBrowserClient` from `@supabase/ssr`.

**`src/lib/supabase/server.ts`** — server-side client using `createServerClient` with cookie handling. Used in TanStack Start server functions.

### 2.2 Auth context provider

**`src/providers/auth-provider.tsx`**:
- Wraps the app in `__root.tsx`
- Subscribes to `supabase.auth.onAuthStateChange`
- Exposes `user`, `profile` (with role), `signIn`, `signUp`, `signOut`, `isAdmin`, `isClient`
- Fetches/refreshes the user's `profiles` row on auth state change
- Inserts into `login_history` on sign-in

### 2.3 Auth guard

**`src/components/auth/AuthGuard.tsx`** — wrapper component that checks authentication and role:
- `requireAuth` — redirects to `/login` if not authenticated
- `requireAdmin` — redirects to `/` if not admin
- `requireClient` — redirects if role is just 'user' (no bookings yet)

### 2.4 TanStack Router auth context

Add `user` and `profile` to the router context in `__root.tsx` via `createRootRouteWithContext`. This makes auth available in route `beforeLoad` guards.

### 2.5 Auth pages

| Route | File | Description |
|-------|------|-------------|
| `/login` | `src/routes/login.tsx` | Email + password form, links to signup |
| `/signup` | `src/routes/signup.tsx` | Name, email, password fields, creates auth user |
| `/logout` | `src/routes/logout.tsx` | Signs out, redirects to `/` |

All three pages use shadcn form components + sonner toasts (top-left). No fancy modals — unique page URLs.

---

## Phase 3 — Shared UI & Branding Guide

### 3.1 Branding Reference

Derived from the existing landing page:

| Element | Value |
|---------|-------|
| **Font (display)** | `Bebas Neue` — all-caps headings, tracking-wide |
| **Font (body)** | `Inter` — 300/400/500/600 weights |
| **Background** | `oklch(0.16 0 0)` — near-black `#0E0E0E` |
| **Foreground** | `oklch(0.93 0.01 80)` — warm off-white `#EAE6DF` |
| **Accent (primary)** | `oklch(0.70 0.20 45)` — orange `#FF5A1F` |
| **Surface** | `oklch(0.20 0 0)` — dark gray `#1A1A1A` |
| **Surface-2** | `oklch(0.24 0 0)` |
| **Hairline** | `oklch(1 0 0 / 10%)` |
| **Muted text** | `oklch(0.66 0.01 80)` |
| **Border radius** | `0.25rem` (4px) — sharp/slight, no heavy rounding |
| **Button style** | Solid accent bg, uppercase, tracking, no rounding, hover brightness |
| **Section headings** | Small uppercase label with accent hairline + `font-display` title |
| **Animation** | Fade-in + slide-up on scroll, `duration-700`, respects `prefers-reduced-motion` |
| **Toast** | Sonner `toaster` component, positioned top-left |

**Component conventions**:
- All new pages follow the same dark theme
- `cn()` utility for class merging
- shadcn components as the building blocks (Button, Card, Table, Dialog, Form, Input, Select, Badge, Tabs, etc.)
- Pages use `PageHeader` shared component for title + description + optional action button

### 3.2 Shared components to build

| Component | Purpose |
|-----------|---------|
| `PageHeader` | Title, subtitle, optional CTA button — consistent top of every page |
| `StatusBadge` | Colored badge for booking/session statuses |
| `RoleBadge` | Badge showing user role |
| `ConfirmDialog` | Wraps shadcn `AlertDialog` for delete/cancel confirmations |
| `EmptyState` | Shown when lists have no items, with icon + message + optional action |
| `AvatarUpload` | Profile avatar upload (Supabase Storage bucket) |
| `LoadingPage` | Full-page loading skeleton |
| `AdminSidebar` | Sidebar nav for admin section (shadcn Sidebar) |
| `UserSidebar` | Sidebar nav for client/user section |
| `StatsCard` | Dashboard stat card (label, value, icon, trend) |

### 3.3 Route layout structure

```
__root.tsx                  — QueryClientProvider + AuthProvider + Toaster
├── index.tsx               — public landing page (no auth needed)
├── login.tsx               — public
├── signup.tsx              — public
├── logout.tsx              — public (auto-logout)
├── _user/                  — auth-gated layout (user or client or admin)
│   ├── _layout.tsx         — shared layout with user sidebar/nav
│   ├── profile.tsx
│   └── bookings/
│       ├── index.tsx
│       └── $bookingId.tsx
├── _admin/                 — admin-gated layout (role=admin)
│   └── admin/
│       ├── _layout.tsx     — admin sidebar layout
│       ├── index.tsx       — dashboard
│       ├── categories/
│       │   ├── index.tsx
│       │   ├── new.tsx
│       │   └── $categoryId.tsx
│       ├── sessions/
│       │   ├── index.tsx
│       │   ├── new.tsx
│       │   └── $sessionId.tsx
│       ├── session-types/
│       │   ├── index.tsx
│       │   ├── new.tsx
│       │   └── $typeId.tsx
│       ├── bookings/
│       │   ├── index.tsx
│       │   └── $bookingId.tsx
│       ├── clients/
│       │   ├── index.tsx
│       │   └── $clientId.tsx
│       ├── reporting.tsx
│       ├── settings.tsx
│       └── calendar.tsx
```

---

## Phase 4 — User Pages

### 4.1 `/profile`

- Displays and edits the user's `profiles` row (name, phone, avatar)
- Avatar upload to Supabase Storage `avatars` bucket
- Shows current role and email (read-only)
- Uses shadcn Form + react-hook-form + zod validation
- Modals only for avatar crop/confirm

### 4.2 `/bookings` (user's own bookings)

- List view showing all user's bookings with status, session info, date
- Filterable by status (upcoming, past, cancelled)
- Each row: session name, date/time, status badge, location, action buttons
- "Cancel" action opens a `ConfirmDialog` modal with cancel reason field
- Link to individual booking detail page

### 4.3 `/bookings/:id`

- Full detail view of a single booking
- Session details, status history (from `booking_history`), check-in info
- "Cancel booking" button (with confirm modal)
- Admin-only actions shown if viewer is admin

---

## Phase 5 — Admin Pages

### 5.1 `/admin` — Dashboard

High-level stats:
- Total upcoming sessions (today/this week)
- Total bookings (confirmed, pending)
- Occupancy rate (filled slots / total slots)
- Revenue (total price of completed/confirmed bookings)
- Recent bookings list (last 10)
- Client count (total, active)
- Quick-action buttons: "New Session", "New Session Type", "View Bookings"

### 5.2 `/admin/sessions` — Session List

- Table/card list of all sessions (past and future)
- Filters: date range, status, location, category
- Sort by date/time
- Actions: Edit, Cancel (with confirm modal + reason), Duplicate
- "New Session" button → `/admin/sessions/new`
- Paginated

### 5.3 `/admin/sessions/new` — Create Session

- Form for creating a single session instance
- Fields: title, description, category (select from dynamic `categories` table), duration, price, max_slots, location, area, start_time
- Option to link to a session_type (pre-fills defaults)
- On submit, creates session + inserts into `session_history`

### 5.4 `/admin/sessions/:id` — Edit Session

- Same form as new, pre-filled
- Can change status to `cancelled` with reason
- Shows booking list for this session (who's booked, statuses)
- History of changes to this session

### 5.5 `/admin/categories` — Category List

- Table of all categories (name, description, linked session types count)
- Actions: Edit, Delete (with confirm dialog — prevents deletion if types are linked)
- "New Category" button
- Used to categorise session types (Strength, Conditioning, Mobility, or any custom)

### 5.6 `/admin/categories/new` & `/:id`

- Form with name + description fields
- Simple two-field form — uses a page (not a modal) per the slug convention

### 5.7 `/admin/session-types` — Session Type List

- Table of all session types
- Actions: Edit, Toggle active/inactive
- "New Type" button

### 5.8 `/admin/session-types/new` & `/:id`

- Form with all session_type fields (title, description, category, default_duration, default_price, default_max_slots, default_location)
- Category is a select populated from the `categories` table

### 5.9 `/admin/bookings` — All Bookings

- Full list of every booking across all sessions
- Filters: status, date range, client name, session
- Admin can change booking status (confirm, mark no-show, mark complete)
- Cancel a booking on behalf of a client (with reason)
- Each row links to `/admin/bookings/:id`

### 5.10 `/admin/bookings/:id` — Booking Detail View

- Full booking info + client info
- Status change actions
- History of changes
- Check-in button (sets `checked_in_at`)

### 5.11 `/admin/clients` — Client Management

- Table of all users (filterable by role)
- Columns: name, email, role, bookings count, last booking date, joined date
- Actions: Promote to admin (confirm dialog), Ban/Unban (with reason), Reject
- Search by name/email
- Bulk actions: select multiple, change role
- Each row links to `/admin/clients/:id`

### 5.12 `/admin/clients/:id` — Client Detail View

- Profile info (read-only for admin)
- Booking history for this client
- Login history
- Role management (change role, ban/unban)
- Notes field (admin-only internal notes)

### 5.13 `/admin/reporting` — Reports

- Charts (recharts):
  - Bookings over time (line chart, daily/weekly/monthly)
  - Revenue over time
  - Session type popularity (bar chart)
  - Occupancy rate trend
  - Client growth (cumulative)
- Exportable summary stats
- Date range picker

### 5.14 `/admin/settings` — Settings

- Configurable cancellation window (hours before session)
- Default booking confirmation message
- Business hours / operating days
- Session slot generation settings (how far in advance to generate recurring sessions)
- Notification preferences (future: email settings)

---

## Phase 6 — Availability Calendar

### 6.1 `/admin/calendar` — Calendar View

- Month/week/day view of sessions
- Shows all generated sessions for each day
- Color-coded by category
- Click on a date to see sessions for that day

### 6.2 Recurring Rules Management

On the calendar page or a dedicated section:
- List of recurring `session_availability_rules`
- Create rule: selects category (optional), session_type (optional), then builds the `recurrence` jsonb (day, time, duration, location, slots, price)
- Set validity period (valid_from / valid_until) — e.g., only active for summer months
- Toggle rules on/off
- Edit rule → affects all future generated sessions

### 6.3 Exceptions

Within the calendar, admin can:
- **Cancel a single occurrence**: creates an exception with `action='cancel'`
- **Add an extra session**: creates `action='add'` — fills in full session details
- **Modify an occurrence**: `action='modify'` — change time, duration, max_slots, or price for one date
- Exceptions are displayed on the calendar with visual indicators (strikethrough for cancelled, modified icon, etc.)

### 6.4 Session Generation Logic

A background function (server function or cron job) that:
- Reads active `session_availability_rules`
- For each rule, generates `sessions` rows for upcoming dates (e.g., next 4 weeks)
- Respects exceptions (doesn't generate cancelled sessions, applies modifications)
- Runs daily or on-demand

This can be a TanStack Start server function triggered:
- Manually from the admin calendar page ("Generate upcoming sessions")
- Automatically via a Vercel Cron Job hitting a server endpoint

---

## Phase 7 — History & Audit

### 7.1 Login History

- Inserted automatically via Supabase trigger or in the auth provider on sign-in
- Stored in `login_history` table
- Viewable by admin on client detail page
- Columns: timestamp, IP, user agent

### 7.2 Booking History

- Every status change on `bookings` inserts a row into `booking_history`
- Track: who changed it, from what status to what, reason, timestamp
- Implemented via a Postgres trigger on `bookings` UPDATE
- Viewable on booking detail page (admin) and within client detail

### 7.3 Session History

- Track changes to session fields (status changes, rescheduling, price changes)
- Inserted via Postgres trigger on `sessions` UPDATE
- Viewable on session detail page

### 7.4 Trigger Implementation Pattern

```sql
CREATE OR REPLACE FUNCTION record_booking_history()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO booking_history (booking_id, changed_by, old_status, new_status, change_reason, changed_at)
    VALUES (NEW.id, auth.uid(), OLD.status, NEW.status, NEW.cancel_reason, now());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER booking_history_trigger
  AFTER UPDATE ON bookings
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION record_booking_history();
```

(Same pattern for sessions → `session_history`.)

---

## Phase 8 — Polish & Role Management

### 8.1 Role Management Logic

| Event | Action |
|-------|--------|
| User signs up | Profile created with `role='user'` |
| User books first session | Trigger promotes `user` → `client` |
| Admin bans user | `role='banned'`, `banned_at=now()`, `ban_reason` set |
| Admin unbans user | `role` restored to previous (`user` or `client`) |
| Admin rejects user | No explicit "rejected" role — use `banned` with reason or add `rejected` if needed. For MVP, use `banned`. |
| Admin promotes to admin | `role='admin'` |

**Auth guard behavior**:
- Banned users are blocked from accessing any authenticated page
- Auth provider checks role on every page load
- Admin pages return 404 or redirect if user is not admin

### 8.2 Updating the Landing Page (index.tsx)

- The existing static `Schedule` component should be updated to fetch sessions from Supabase instead of the hardcoded `SCHEDULE` constant
- The `SCHEDULE` data in `src/lib/schedule.ts` can remain as a fallback or be removed
- "Book" buttons on the landing page should link to `/signup` (if not logged in) or open the booking flow

### 8.3 Booking Flow (Landing → Auth → Book)

1. Visitor clicks "Book" on a session → if not authenticated, redirect to `/login` with a `?redirect=` param
2. After login, redirect to the session detail or booking page
3. Booking page shows session details + "Confirm Booking" button
4. On confirm: creates booking in Supabase, shows toast, redirects to `/my-bookings`

### 8.4 Edge Cases

- **Concurrent booking**: Use a booking transaction that checks `max_slots` before inserting. If slots are full, show error toast.
- **Session cancellation while booked**: When admin cancels a session, all associated bookings get status `cancelled` with reason "Session cancelled by admin".
- **User deletion / account deletion**: Supabase Auth handles user deletion; cascade deletes or set `profiles` to anonymous.
- **Time zones**: Store all timestamps in UTC. Display in browser's local timezone using `date-fns` + `formatInTimeZone` or Intl API.
- **Mobile responsiveness**: All admin pages use responsive layouts — sidebar collapses to bottom nav or hamburger on mobile.

### 8.5 Storage Bucket

Create a Supabase Storage bucket `avatars`:
- Public read, authenticated write
- Upload path: `avatars/{userId}/{timestamp}-{filename}`
- Max file size: 2MB
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

### 8.6 Verification Checklist

Before considering the implementation complete:

- [ ] All migrations run successfully against a fresh Supabase project
- [ ] Auth: signup, login, logout, session persistence all work
- [ ] RLS: users can only see their own data; admins see all
- [ ] Role promotion: first booking promotes `user` → `client`
- [ ] Admin CRUD: categories, session types, sessions, bookings
- [ ] Admin calendar: rules, exceptions, session generation
- [ ] Admin reports: stats load correctly
- [ ] Client management: role changes, ban/unban
- [ ] History: booking changes, session changes, login history recorded
- [ ] Landing page loads live schedule from Supabase
- [ ] Booking flow works end-to-end (select → auth → confirm → see in my bookings)
- [ ] Cancellation flow works (user cancels → status updates → history logged)
- [ ] Mobile: all admin pages usable on small screens
- [ ] Toast notifications appear top-left for all success/error states

---

## Implementation Order (Recommended)

1. **Phase 0** — Install deps, create Supabase project, env vars
2. **Phase 1** — Run migrations, set up RLS, seed data
3. **Phase 2** — Auth layer (Supabase clients, auth provider, guard, login/signup pages)
4. **Phase 3** — Shared components, layouts, branding
5. **Phase 4** — User pages (profile, bookings)
6. **Phase 5** — Admin pages (in order: dashboard → categories → session types → sessions → bookings → clients → reporting → settings)
7. **Phase 6** — Availability calendar (rules, exceptions, generation)
8. **Phase 7** — History & audit tables + triggers
9. **Phase 8** — Polish, edge cases, landing page integration
