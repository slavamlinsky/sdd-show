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

**Query style:** v1 uses the **Supabase client** (and SQL in `supabase/migrations/`). **Drizzle** is optional later if typed SQL migrations become painful — not required for P1–P3.

**Schema deploys:** merge to `main` runs [`.github/workflows/supabase-migrations.yml`](../../.github/workflows/supabase-migrations.yml) (`supabase db push`). Vercel does not apply SQL. See [README](../../README.md#database-migrations) and [spec-workflow-ci.md](./spec-workflow-ci.md).

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

### Glossary terms (suggestions now; catalog later)

| Table | Purpose |
| ----- | ------- |
| `glossary_terms` | One catalog: **pending** community suggestions + future **published** terms. Columns: `slug`, `title`, `short_definition`, `categories` (1–3 pillars), `tags`, `status` (`pending` \| `published` \| `rejected` \| `hidden`), `source`, `submitted_by` (FK `auth.users`), `submitter_name` / `submitter_email`, `review_note`. SQL: `supabase/migrations/20260818000000_glossary_terms.sql`. |

Public listing still uses `lib/glossary-data.ts` until a seed + admin manage slice. RLS: **authenticated** may **insert** pending suggestions; **select** published (and own rows if signed in). Anonymous cannot insert.

### Videos (suggest + subscribe; catalog still static)

| Table | Purpose |
| ----- | ------- |
| `video_suggestions` | Pending community YouTube links. Columns: `youtube_url`, `youtube_id`, `why_it_matters`, `categories` (1–4 pillars), `status` (`pending` \| `accepted` \| `rejected`), `submitted_by`, `submitter_name` / `submitter_email`. SQL: `supabase/migrations/20260824000000_video_suggestions_and_subscriptions.sql`. Guests can submit via service role or email-only fallback. |
| `video_update_subscriptions` | One row per Auth user. `subscribed` boolean (UI toggle). Mailer later. RLS: user manages own row. |

Public `/videos` listing still uses `lib/videos-data.ts`.

### P4 — blog

See [spec-blog.md](./spec-blog.md) v2 data. Rows in Postgres; seed from `content/blog/` until cutover.

### Later

Video **catalog** in Postgres, newsletter send, favorites — [spec-videos-v2-v3.md](./spec-videos-v2-v3.md). Suggest-video intake and subscribe flag are in the videos tables above.

**Tests (leaderboard):** `test_attempts` for signed-in sittings — [spec-tests.md](./spec-tests.md) **P2**. RLS: insert own rows; public `test_leaderboard_rows` RPC (no emails).

## Authorization (app rules)

| Actor | Can |
| ----- | --- |
| **Anonymous** | Read public content; submit course lead with email; **suggest a video** (pending, or email-only). Sign-in required to subscribe to video updates. |
| **Signed-in user** | Same + session in header; **suggest a glossary term** (pending, `submitted_by`); **subscribe to video updates** (`video_update_subscriptions`); later favorites; **save test attempts** to the leaderboard ([spec-tests.md](./spec-tests.md) P2). |
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
- Auto-publishing community glossary edits (suggestions stay **pending** until review).

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
