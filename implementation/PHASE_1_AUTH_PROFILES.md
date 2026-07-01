# Backend Phase 1 — Authentication & User Profiles

> **Project**: Alex Moreno — S&C Coach, Barcelona  
> **Goal**: Add Supabase authentication and user profiles to power session booking

---

## 1. Supabase Project Setup

- [ ] Create a Supabase project (or link an existing one)
- [ ] Install `@supabase/supabase-js` and `@supabase/ssr` packages
- [ ] Configure environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] Create a `src/lib/supabase.ts` client (server-safe with SSR cookie handling)
- [ ] Verify connection with a test query

---

## 2. Authentication (Email + Password)

- [ ] Enable Email/Password auth provider in Supabase dashboard
- [ ] Create a sign-up page/component (`/auth/register`)
- [ ] Create a sign-in page/component (`/auth/login`)
- [ ] Create a password reset flow (`/auth/reset-password`)
- [ ] Create reusable `AuthGuard` component to protect authenticated routes
- [ ] Wire auth state into the app (context or TanStack Query)
- [ ] Add sign-out functionality

---

## 3. User Profiles Table

- [ ] Create a `profiles` table in Supabase:
  - `id` (uuid, PK, references `auth.users`)
  - `email` (text, not null)
  - `full_name` (text)
  - `avatar_url` (text)
  - `phone` (text)
  - `role` (text, default `'client'`) — `client` | `admin`
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
- [ ] Enable Row-Level Security (RLS) on the `profiles` table
- [ ] Create a Supabase trigger to auto-create a profile row on user sign-up
- [ ] Add RLS policies:
  - Users can read their own profile
  - Users can update their own profile (non-role fields)
  - Admins can read/update all profiles
- [ ] Create `src/lib/profiles.ts` with typed helper functions (get, upsert, update)

---

## 4. Auth UI Integration

- [ ] Add a user menu / avatar in the TopBar (logged-in state)
- [ ] Show sign-in / sign-up CTA when logged out
- [ ] Display user name and avatar from profile after login
- [ ] Handle redirects: after login → return to previous page; after logout → go to home
- [ ] Add a simple profile settings page (`/profile`) to edit name and phone

---

## 5. Session Management & Middleware

- [ ] Set up TanStack Router auth guards using `beforeLoad`
- [ ] Persist session across page reloads using SSR-safe cookie storage
- [ ] Handle session expiry and refresh tokens gracefully
- [ ] Add a loading/skeleton state while auth status is being determined

---

## 6. Testing & Verification

- [ ] Test sign-up flow (email confirmation, redirect)
- [ ] Test sign-in flow (valid + invalid credentials)
- [ ] Test password reset flow
- [ ] Test profile auto-creation on sign-up
- [ ] Test RLS policies (authenticated vs. anonymous)
- [ ] Test session persistence across page reloads
- [ ] Test responsive auth UI on mobile (375px–414px)

---

## Progress Tracker

| # | Step | Status |
|---|------|--------|
| 1 | Supabase Project Setup | ☐ |
| 2 | Authentication (Email + Password) | ☐ |
| 3 | User Profiles Table | ☐ |
| 4 | Auth UI Integration | ☐ |
| 5 | Session Management & Middleware | ☐ |
| 6 | Testing & Verification | ☐ |
