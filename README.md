This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Supabase (P1)

Postgres + Auth live in a [Supabase](https://supabase.com) project. Spec: [`docs/specs/spec-data-auth.md`](docs/specs/spec-data-auth.md).

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Copy **Project URL** and **publishable** (anon) key from **Project Settings → API** (or **Connect**).
3. `cp .env.example .env.local` and paste those values.
4. Restart `npm run dev`. The app still builds **without** env vars; clients throw only when called without config.
5. **Auth (P2):** In Supabase → **Authentication → URL configuration**, set **Site URL** to your production origin (e.g. `https://sdd-show.vercel.app`) and add **Redirect URLs**: `http://localhost:3000/auth/callback`, `https://sdd-show.vercel.app/auth/callback` (plus preview wildcards). Enable **Google** under **Providers** if you want that button to work. Magic links use **Authentication → Email**.
6. **Schema:** add GitHub Actions secrets and let [Database migrations](#database-migrations) apply `supabase/migrations/` (do not paste SQL into the dashboard for routine work). Add **`SUPABASE_SERVICE_ROLE_KEY`** to `.env.local` and Vercel (Settings → API) so signed-in glossary/video submits work from Server Actions. Optional: **`RESEND_API_KEY`** + **`GLOSSARY_NOTIFY_EMAIL`** (and **`VIDEO_NOTIFY_EMAIL`**) for email-only suggestions if tables are not applied yet.
7. **Videos:** signed-in users can toggle a subscribe flag; guests are sent to sign-in. Suggestions persist as pending rows (or email-only if Resend is configured).

Auth UI: `/sign-in` (magic link + Google). Clients: `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (server). `proxy.ts` refreshes auth cookies when env is set.

## Database migrations

SQL in [`supabase/migrations/`](supabase/migrations/) is applied by the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started). History lives in `supabase_migrations.schema_migrations` (created by the CLI — do not invent a second table). Vercel deploys the Next.js app only; it does **not** run SQL.

**On merge to `main`:** [`.github/workflows/supabase-migrations.yml`](.github/workflows/supabase-migrations.yml) verifies every file on a fresh local Postgres, then runs `supabase db push` against production.

**Pull requests** that touch `supabase/` run the same local apply (`supabase db start`) so broken SQL fails before merge.

### One-time GitHub secrets

Repo **Settings → Secrets and variables → Actions**:

| Secret | Where to get it |
| ------ | --------------- |
| `SUPABASE_ACCESS_TOKEN` | [Account → Access Tokens](https://supabase.com/dashboard/account/tokens) |
| `PRODUCTION_PROJECT_ID` | Dashboard URL: `https://supabase.com/dashboard/project/<project-id>` |
| `PRODUCTION_DB_PASSWORD` | Project **Settings → Database** (the database password, not the service role key) |

Until these are set, the deploy job **skips** `db push` (the verify job still runs). After adding secrets, run **Actions → Supabase migrations → Run workflow** on `main`, or merge the next migration.

### Already applied in the SQL Editor?

The CLI only skips files recorded in `schema_migrations`. If you pasted a file by hand, mark **that version only** as applied so the first `db push` does not re-run it:

```bash
npx supabase login
npx supabase link --project-ref <project-id>
npx supabase migration list
# Example: glossary SQL already ran in the dashboard
npx supabase migration repair --status applied 20260818000000
```

Do **not** repair versions you never ran — `db push` (or the Action) should apply those. After repair (if needed): `npx supabase db push`.

### Local commands

```bash
npx supabase migration new short_description   # or npm run migration:new -- short_description
npx supabase db start                          # Docker: apply all files on a local Postgres
npx supabase db push                           # apply pending files to the linked remote
```

SQL Editor remains an emergency fallback only.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
