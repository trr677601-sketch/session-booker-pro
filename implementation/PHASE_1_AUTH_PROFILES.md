# Phase 1: Backend Supabase Authentication & User Profiles

> **Parent**: `IMPLEMENTATION_PLAN.md` — Phases 0, 1, 2, and 8.1
> **Issue**: [#7 Phase 1: Backend Supabase Authentication & User Profiles](https://github.com/trr677601-sketch/session-booker-pro/issues/7)

---

## Implementation Order

1. [Project Setup & Dependencies](#step-1--project-setup--dependencies)
2. [Migrations: profiles + login_history + RLS](#step-2--migrations)
3. [Supabase Client Setup](#step-3--supabase-client-setup)
4. [Auth Provider & Context](#step-4--auth-provider--context)
5. [Auth Guard Component](#step-5--auth-guard-component)
6. [Auth Pages (Login, Signup, Logout)](#step-6--auth-pages)

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

## Step 2 — Migrations

### 001_profiles.sql

Table: `profiles` — one row per auth user, created via a DB trigger on `auth.users`.

```sql
-- 001_profiles.sql

-- 1. Create the profiles table
CREATE TABLE profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text NOT NULL,
  full_name   text,
  phone_prefix text,
  phone       text,
  avatar_url  text,
  address_line_1 text,
  address_line_2 text,
  postal_code text,
  city        text,
  county      text,
  country     text,
  role        text NOT NULL DEFAULT 'user',
  banned_at   timestamptz,
  ban_reason  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 2. Trigger: auto-create profile on user signup
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

-- 3. Trigger: auto-update updated_at on profile changes
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

-- 4. Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
```

### 002_login_history.sql

```sql
-- 002_login_history.sql

CREATE TABLE login_history (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ip_address  text,
  user_agent  text,
  logged_in_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_login_history_user_id ON login_history(user_id);
CREATE INDEX idx_login_history_logged_in_at ON login_history(logged_in_at);
```

### 003_rls_policies.sql

```sql
-- 003_rls_policies.sql

-- Enable RLS on both tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_read_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_read_all_admin"
  ON profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_admin"
  ON profiles FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "profiles_insert_admin"
  ON profiles FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "profiles_delete_admin"
  ON profiles FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Login history policies (admin only)
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

Server-side client using `createServerClient` with cookie handling. Used in TanStack Start server functions.

```typescript
import { createServerClient } from '@supabase/ssr'
import { parseCookies, setCookie, deleteCookie } from '@tanstack/react-start/server'

export function createServerSupabase() {
  return createServerClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookies()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            setCookie(name, value, options)
          })
        },
      },
    }
  )
}
```

### `src/lib/supabase/middleware.ts`

TanStack Router auth guard logic (used in route `beforeLoad`).

### TypeScript Types

After migrations are applied, run:

```bash
npx supabase gen types typescript --project-id <PROJECT_REF> > src/lib/supabase-types.ts
```

This generates types for all tables. Hand-edit or augment as needed.

---

## Step 4 — Auth Provider & Context

### `src/providers/auth-provider.tsx`

React context wrapping Supabase session. Responsibilities:
- Subscribe to `supabase.auth.onAuthStateChange`
- Expose: `user`, `profile` (with role), `signIn`, `signUp`, `signOut`, `isAdmin`, `isClient`
- Fetch/refresh the user's `profiles` row on auth state change
- Insert into `login_history` on sign-in

```typescript
// Structure outline — fill in during implementation
interface AuthContextValue {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<...>
  signUp: (email: string, password: string, fullName: string) => Promise<...>
  signOut: () => Promise<void>
  isAdmin: boolean
  isClient: boolean
}
```

### TanStack Router Context

In `__root.tsx`, extend router context with auth via `createRootRouteWithContext`:

```typescript
import { createRootRouteWithContext } from '@tanstack/react-router'

interface RouterContext {
  user: User | null
  profile: Profile | null
}

export const Route = createRootRouteWithContext<RouterContext>()({...})
```

This makes auth available in route `beforeLoad` guards.

---

## Step 5 — Auth Guard Component

### `src/components/auth/AuthGuard.tsx`

Wrapper component that checks authentication and role:

| Prop | Behavior |
|------|----------|
| `requireAuth` | Redirect to `/login` if not authenticated |
| `requireAdmin` | Redirect to `/` if not admin |
| `requireClient` | Redirect if role is `'user'` (no bookings yet) |

Banned users (`role = 'banned'`) are blocked from all authenticated pages.

---

## Step 6 — Auth Pages

| Route | File | Description |
|-------|------|-------------|
| `/login` | `src/routes/login.tsx` | Email + password form, links to signup |
| `/signup` | `src/routes/signup.tsx` | Name, email, password fields, creates auth user |
| `/logout` | `src/routes/logout.tsx` | Signs out, redirects to `/` |

All three pages use:
- shadcn form components (Button, Input, Card, etc.)
- sonner toasts positioned top-left
- Unique page URLs (no modals)

### Role Management Reference

| Event | Action |
|-------|--------|
| User signs up | Profile created with `role='user'` via `handle_new_user` trigger |
| User books first session | Trigger promotes `user` → `client` (future phase) |
| Admin bans user | `role='banned'`, `banned_at=now()`, `ban_reason` set |
| Admin unbans user | Role restored to previous (`user` or `client`) |
| Admin promotes to admin | `role='admin'` |

---

## File Structure (Phase 1 additions)

```
src/
  lib/
    supabase/
      client.ts
      server.ts
      middleware.ts
    supabase-types.ts
  providers/
    auth-provider.tsx
  components/
    auth/
      AuthGuard.tsx
  routes/
    __root.tsx              — updated with auth context
    login.tsx               — new
    signup.tsx              — new
    logout.tsx              — new

supabase/
  migrations/
    001_profiles.sql
    002_login_history.sql
    003_rls_policies.sql
```

---

## Verification Checklist

- [ ] All 3 migrations run successfully against a fresh Supabase branch
- [ ] Auth: signup creates profile row, login returns session, logout clears session
- [ ] RLS: user reads own profile only; admin reads all
- [ ] Banned users cannot access authenticated routes
- [ ] Login page redirects to `/` on success
- [ ] Signup page creates auth user + profile, redirects to `/`
- [ ] Logout page signs out and redirects to `/`
- [ ] Toast notifications appear top-left for all auth actions
- [ ] TypeScript types generated and compile cleanly
