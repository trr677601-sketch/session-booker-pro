# Phase 1: Backend Supabase Authentication & User Profiles

> **Parent**: `IMPLEMENTATION_PLAN.md` — Phases 0, 1, 2, and 8.1
> **Issue**: [#7 Phase 1: Backend Supabase Authentication & User Profiles](https://github.com/trr677601-sketch/session-booker-pro/issues/7)

---

## Implementation Order

1. [Project Setup & Dependencies](#step-1--project-setup--dependencies)
2. [Database Migrations (profiles + login_history + RLS)](#step-2--database-migrations)
3. [Supabase Client Setup](#step-3--supabase-client-setup)
4. [Signup & Login Pages](#step-4--signup--login-pages)
5. [Mock Admin Dashboard](#step-5--mock-admin-dashboard)
6. [Mock User Dashboard](#step-6--mock-user-dashboard)
7. [Manual Admin Creation on Supabase Dashboard](#step-7--manual-admin-creation-on-supabase-dashboard)

---

## Step 1 — Project Setup & Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Environment Variables (`.env`)

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Add these to `.env.example` and ensure `.env` is in `.gitignore`.

### Supabase Project Configuration

- Go to [supabase.com](https://supabase.com) → New project
- Note the project URL, anon key, and service role key
- Enable **Email + Password** auth in Authentication → Providers
- Disable "Confirm email" initially for dev (can re-enable later)

---

## Step 2 — Database Migrations

### 001_profiles.sql

Table: `profiles` — one row per auth user, created via a DB trigger on `auth.users`.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid PK` | references `auth.users(id)` |
| `email` | `text` | copied from auth.users |
| `full_name` | `text` | |
| `phone_prefix` | `text nullable` | country code, e.g. `+34` |
| `phone` | `text nullable` | |
| `avatar_url` | `text nullable` | Supabase Storage path |
| `address_line_1` | `text nullable` | |
| `address_line_2` | `text nullable` | |
| `postal_code` | `text nullable` | |
| `city` | `text nullable` | |
| `county` | `text nullable` | |
| `country` | `text nullable` | |
| `role` | `text` | default `'user'` — values: `user`, `client`, `admin`, `banned` |
| `banned_at` | `timestamptz nullable` | |
| `ban_reason` | `text nullable` | |
| `created_at` | `timestamptz` | default `now()` |
| `updated_at` | `timestamptz` | auto-update via trigger |

```sql
CREATE TABLE profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         text NOT NULL,
  full_name     text,
  phone_prefix  text,
  phone         text,
  avatar_url    text,
  address_line_1 text,
  address_line_2 text,
  postal_code   text,
  city          text,
  county        text,
  country       text,
  role          text NOT NULL DEFAULT 'user',
  banned_at     timestamptz,
  ban_reason    text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
```

**Trigger: auto-create profile on signup**

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

**Trigger: auto-update `updated_at`**

```sql
CREATE OR REPLACE FUNCTION auto_update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_update_updated_at();
```

**Indexes**

```sql
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
```

### 002_login_history.sql

```sql
CREATE TABLE login_history (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ip_address    text,
  user_agent    text,
  logged_in_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_login_history_user_id ON login_history(user_id);
CREATE INDEX idx_login_history_logged_in_at ON login_history(logged_in_at);
```

### 003_rls_policies.sql

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- Profiles: users read own profile
CREATE POLICY "profiles_read_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Profiles: admins read all
CREATE POLICY "profiles_read_all_admin"
  ON profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Profiles: users update own
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Profiles: admins update any
CREATE POLICY "profiles_update_admin"
  ON profiles FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Profiles: admin insert
CREATE POLICY "profiles_insert_admin"
  ON profiles FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Profiles: admin delete
CREATE POLICY "profiles_delete_admin"
  ON profiles FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Login history: admin only
CREATE POLICY "login_history_admin_all"
  ON login_history FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));
```

---

## Step 3 — Supabase Client Setup

### `src/lib/supabase/client.ts`

Browser-side Supabase client using `createBrowserClient` from `@supabase/ssr`.

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
  )
}
```

### `src/lib/supabase/server.ts`

Server-side client using `createServerClient` with cookie handling.

```typescript
import { createServerClient } from '@supabase/ssr'
import { parseCookies, setCookie, deleteCookie } from '@tanstack/react-start/server'

export function createServerSupabase() {
  return createServerClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return parseCookies() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            setCookie(name, value, options)
          )
        },
      },
    }
  )
}
```

### TypeScript Types

After migrations are applied, run:

```bash
npx supabase gen types typescript --project-id <PROJECT_REF> > src/lib/supabase-types.ts
```

---

## Step 4 — Signup & Login Pages

Build standalone auth pages without a full auth provider context (the pages handle Supabase auth directly for now).

### Route structure

| Route | File | Description |
|-------|------|-------------|
| `/signup` | `src/routes/signup.tsx` | Name, email, password fields. Calls `supabase.auth.signUp()`. On success, redirects to `/login` with a toast. |
| `/login` | `src/routes/login.tsx` | Email + password form. Calls `supabase.auth.signInWithPassword()`. On success, redirects to `/dashboard` or `/admin/dashboard` based on role. |
| `/logout` | `src/routes/logout.tsx` | Calls `supabase.auth.signOut()`, redirects to `/`. |

### signup.tsx

- Fields: full name, email, password, confirm password
- On submit: `supabase.auth.signUp({ email, password, options: { data: { full_name } } })`
- The `handle_new_user` trigger copies `full_name` into the `profiles` row
- Toast on success: "Account created! Please log in."
- Link to `/login` for existing users

### login.tsx

- Fields: email, password
- On submit: `supabase.auth.signInWithPassword({ email, password })`
- After login, fetch the user's `profiles` row to check `role`:
  - `admin` → redirect to `/admin/dashboard`
  - `user` or `client` → redirect to `/dashboard`
- If banned (`role = 'banned'`), show error toast and stay on login
- Link to `/signup` for new users
- Insert a row into `login_history` on successful login

### logout.tsx

- Calls `supabase.auth.signOut()`
- No UI — immediately redirects to `/`

All pages use shadcn form components (Button, Input, Card) and sonner toasts (top-left).

---

## Step 5 — Mock Admin Dashboard

### `src/routes/admin/dashboard.tsx`

A lightweight mockup to verify that authenticted users with `role = 'admin'` can access the admin area.

- Route: `/admin/dashboard`
- **Auth guard at top of component**: fetch current session + profile. If not authenticated or `role !== 'admin'`, redirect to `/login`.
- Page contents:
  - Heading: "Admin Dashboard"
  - Stats cards (hardcoded mock data):
    - "Total Clients: 24"
    - "Upcoming Sessions: 12"
    - "Revenue This Month: €1,240"
  - "Clients" section — hardcoded list of 3–4 mock client entries (name, email, role badge, status)
  - "Recent Bookings" section — 3–4 mock booking entries
- Logout button in the header

### `src/routes/admin/_layout.tsx`

Minimal admin layout wrapper:
- Sidebar or top nav with: Dashboard link, Logout button
- Dark theme consistent with existing brand
- Outlet for child routes

---

## Step 6 — Mock User Dashboard

### `src/routes/dashboard.tsx`

A lightweight mockup to verify that regular users (role `user` or `client`) can access their area.

- Route: `/dashboard`
- **Auth guard at top of component**: fetch current session + profile. If not authenticated, redirect to `/login`.
- If user is banned, show "Account suspended" message and redirect.
- Page contents:
  - Heading: "My Dashboard"
  - Profile summary card: name, email, role badge
  - "My Bookings" section — hardcoded mock data (2–3 entries)
  - "Upcoming Sessions" section — hardcoded mock data (2 entries)
- Logout button in the header

---

## Step 7 — Manual Admin Creation on Supabase Dashboard

Once all migrations and pages are in place, create the admin user directly through the Supabase Dashboard:

1. Go to **Authentication → Users** in the Supabase Dashboard
2. Click **"Add User"** → manually create a user with email + password
3. Copy the new user's `id` (UUID)
4. Go to **SQL Editor** and run:
   ```sql
   UPDATE profiles
   SET role = 'admin'
   WHERE id = '<user-uuid>';
   ```
5. Verify by logging in at `/login` with the admin credentials — should redirect to `/admin/dashboard`

---

## File Structure (Phase 1 additions)

```
src/
  lib/
    supabase/
      client.ts
      server.ts
    supabase-types.ts
  routes/
    signup.tsx               — new
    login.tsx                — new
    logout.tsx               — new
    dashboard.tsx            — new (user dashboard mockup)
    admin/
      _layout.tsx            — new (admin layout)
      dashboard.tsx          — new (admin dashboard mockup)

supabase/
  migrations/
    001_profiles.sql
    002_login_history.sql
    003_rls_policies.sql
```

---

## Verification Checklist

- [ ] All 3 migrations run successfully against a fresh Supabase branch
- [ ] `supabase gen types` produces valid TypeScript types
- [ ] `/signup` creates a Supabase auth user + `profiles` row with `role='user'`
- [ ] `/login` authenticates and redirects based on role (user → `/dashboard`, admin → `/admin/dashboard`)
- [ ] `/logout` signs out and redirects to `/`
- [ ] Banned users cannot access `/dashboard` or `/admin/dashboard`
- [ ] User dashboard shows mock data and profile info
- [ ] Admin dashboard shows mock stats, clients, and bookings
- [ ] Admin user can be manually created via Supabase Dashboard + SQL
- [ ] Toast notifications appear top-left for all auth actions
- [ ] TypeScript compiles cleanly with no errors
