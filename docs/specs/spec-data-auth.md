# Platform spec — database and authorization

**Status:** P1 in progress. Complements [spec-main.md](./spec-main.md). Content UX still follows feature specs ([spec-blog.md](./spec-blog.md), [spec-course.md](./spec-course.md), [spec-videos-v2-v3.md](./spec-videos-v2-v3.md)).

## Intent

Give the site **hosted Postgres** and **session-based accounts** so later work (course leads, blog v2, video favorites, subscribe) is not blocked by stubs.

Public pages stay readable **without** an account. Auth is for **identity**, **protected writes**, and **admin** later.

## Stack (locked)

| Layer | Choice | Why |
| ----- | ------ | --- |
| **Database** | **PostgreSQL** on **Supabase** | Dashboard, backups, Data API, pooler for Vercel. Already named in spec-main. |
| **Auth** | **Supabase Auth** | Same project as the DB. **Google** and **email magic links** are first-class. Cookies via `@supabase/ssr`. |
| **App client** | `@supabase/supabase-js` + `@supabase/ssr` | Official Next.js App Router pattern (browser + server clients). |

**Do not add** Better Auth, Clerk, or Auth.js on top. One user store: `auth.users`.

**Query style:** v1 uses the **Supabase client** (and SQL in the dashboard / migrations). **Drizzle** is optional later if typed SQL migrations become painful — not required for P1–P3.

**RLS:** Enable on app tables when they exist (P3+). Until then, do not expose service-role keys to the browser.

## Environment (secrets)

Never commit values. Local: `.env.local`. Also set on **Vercel** (Production + Preview).

| Variable | Purpose |
| -------- | ------- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL from Supabase **Connect** / API settings. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable (anon) key. Legacy alias: `NEXT_PUBLIC_SUPABASE_ANON_KEY`. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only. **Never** `NEXT_PUBLIC_`. Use only in Route Handlers that must bypass RLS (prefer RLS + user session instead). |

Copy from [`.env.example`](../../.env.example). The app **must still build** when these are unset (clients skip / no-op); runtime features that need Supabase fail clearly.

## Auth methods (P2+)

| Method | Notes |
| ------ | ----- |
| **Magic link** | `signInWithOtp({ email })`. Configure Site URL + redirect allowlist. Custom **SMTP** for production mail. |
| **Google** | Auth → Providers → Google. OAuth client in Google Cloud. `signInWithOAuth({ provider: 'google' })`. |
| **LinkedIn** | **Deferred** (not P2 UI). Optional later via **LinkedIn (OIDC)** — do not show a button until then. |

Passwords are **out of scope** for v1 (magic link + Google only). PKCE callback route exchanges the code for a session (`exchangeCodeForSession`).

## Data model (phased)

Users live in **Supabase Auth**. App tables in **public** (or a dedicated schema) reference `auth.users.id`.

### P3 — course leads

| Table | Purpose |
| ----- | ------- |
| `course_leads` | Unique **email**, optional **name**, `created_at`, optional `user_id` (uuid, FK to `auth.users`) when submitted while signed in. |

### P4 — blog

See [spec-blog.md](./spec-blog.md) v2 data. Rows in Postgres; seed from `content/blog/` until cutover.

### Later

Videos, newsletter, favorites — [spec-videos-v2-v3.md](./spec-videos-v2-v3.md).

## Authorization (app rules)

| Actor | Can |
| ----- | --- |
| **Anonymous** | Read public content; submit course lead with email. |
| **Signed-in user** | Same + session in header; later favorites. |
| **Admin** | Later. Seed via dashboard or allowlist email. **Not** in P2 UI. |

**Session:** HTTP-only cookies from `@supabase/ssr`. Server: `getClaims()` / `getUser()` — **never** trust `getSession()` alone for authorization. Next **proxy** (`proxy.ts`) refreshes tokens.

`/sign-in` redirects to `/` when already signed in.

## Routes and UI (P2)

| Path | Behavior |
| ---- | -------- |
| `/sign-in` | Magic link (email) + **Google**. **`robots: noindex`**. |
| `/auth/callback` | PKCE: exchange code, set cookies, redirect. |
| Header | Logged out: **Sign in**. Logged in: email/avatar + **Sign out**. |

Copy: sentence case. shadcn **Input**, **Label**, **Button**.

`/sign-up` **stays a redirect to `/sign-in`** (magic link or Google creates the account).

## Implementation phases

Feature branch per [spec-workflow-ci.md](./spec-workflow-ci.md). `npm run lint` and `npm run build` each phase.

### P1 — Install and configure Supabase (**no sign-in UI**)

1. Create a Supabase project (dashboard).
2. Add packages; `lib/supabase` browser + server clients; `.env.example`.
3. Optional **proxy** (`proxy.ts`) that **refreshes session cookies** when env is set; **no-op** when env is missing so CI/build still works.
4. Document URL + publishable key in README.

**Acceptance P1:** Packages and clients in repo. App builds **without** secrets. With `.env.local` filled, a server helper can create a client (smoke in a later route). **No** change to `/sign-in` stub yet.

### P2 — Auth layer

1. Enable magic links (email templates / SMTP as needed).
2. Enable **Google** in the dashboard; redirect URLs include local + Vercel. Do not require LinkedIn for P2.
3. `/sign-in` UI (magic link + Google only) + `/auth/callback`; header session + sign out.

**Acceptance P2:** Magic link or Google → cookie session → header signed-in → sign out.

### P3 — Course leads

Persist `/course` form to `course_leads` (RLS or server insert with user session).

### P4 — Blog from DB

[spec-blog.md](./spec-blog.md) v2 data.

## Non-goals

- Second auth vendor.
- Payments, CMS, comments, RSS.
- Glossary in the DB for v1.

## Security notes

- Publishable key is public by design; **RLS** protects data.
- Service role: server-only, never in client bundles.
- HTTPS in production.

## Acceptance (platform)

- Specs name **Supabase Postgres + Supabase Auth**.
- P1: clients + env template.
- P2: Google, magic links.
- P3: course leads in Postgres.

## Related

- [spec-main.md](./spec-main.md)
- [spec-course.md](./spec-course.md)
- [spec-blog.md](./spec-blog.md)
- [spec-videos-v2-v3.md](./spec-videos-v2-v3.md)
- [spec-workflow-ci.md](./spec-workflow-ci.md)
