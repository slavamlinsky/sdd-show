This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Supabase (P1)

Postgres + Auth live in a [Supabase](https://supabase.com) project. Spec: [`docs/specs/spec-data-auth.md`](docs/specs/spec-data-auth.md).

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Copy **Project URL** and **publishable** (anon) key from **Project Settings → API** (or **Connect**).
3. `cp .env.example .env.local` and paste those values.
4. Restart `npm run dev`. The app still builds **without** env vars; clients throw only when called without config.
5. **Auth (P2):** In Supabase → **Authentication → URL configuration**, set **Site URL** to `http://localhost:3000` and add **Redirect URLs**: `http://localhost:3000/auth/callback` (plus your Vercel URL when deploying). Enable **Google** and **LinkedIn (OIDC)** under **Providers** if you want those buttons to work. Magic links use **Authentication → Email**.

Auth UI: `/sign-in` (magic link + Google + LinkedIn). Clients: `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (server). `proxy.ts` refreshes auth cookies when env is set.

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
