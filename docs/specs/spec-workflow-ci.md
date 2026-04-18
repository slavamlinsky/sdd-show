# Workflow, Git, Vercel, and testing

Complements [spec-main.md](./spec-main.md). Not every practice below is mandatory for solo MVP; this records **defaults** and **what to add later**.

## Git branching

- **`main`** is the **default branch** and the intended **production** line once Vercel deploys from it.
- **Pushing everything directly to `main`** is acceptable for **small, solo** changes (docs-only, tiny fixes). For **features** or anything risky, use **short-lived branches** (e.g. `feat/home-layout`, `fix/nav`) and merge via **pull request** so history stays reviewable and optional CI can run on PRs.
- **Feature branches are recommended** when more than one change is in flight, or when you want GitHub PR review or Vercel **preview deployments** per branch/PR — not strictly required for a one-person MVP with careful commits.

## Vercel deployment — when to connect

- **Connect early:** Import the GitHub repo in Vercel as soon as the app **`next build`** succeeds locally. Typical moment: **after the project exists on GitHub and has a minimal runnable app** (even before content is finished).
- **Production:** Deploy **production** from **`main`** (Vercel default).
- **Previews:** Enable **preview deployments** for PRs when using feature branches (optional but useful).
- **Environment variables:** Document in README or Vercel project when Supabase or other secrets are added later.

Nothing in the specs requires “push only from CI”; direct `git push origin main` remains valid.

## Testing strategy

| Layer | Tool (target) | MVP |
| ----- | ------------- | --- |
| **E2E** | **Playwright** | Not required for MVP; **add after** core pages ship — smoke paths (home, nav, key routes, course form happy path). |
| **Unit / integration** | **Vitest** or **Jest** | Optional for utilities, parsers, form validation — add when code benefits from fast feedback. Vitest pairs well with modern Next setups; Jest is fine if preferred. |

**Clarification:** **Playwright** is for **browser E2E** (real pages). **Vitest / Jest** are for **unit or integration** tests, not a substitute for E2E. Do not conflate them.

## CI (later)

- **GitHub Actions** (or Vercel checks): run `npm run lint`, `npm run build`, and eventually **`playwright test`** on PRs or on merge to `main`.
- Playwright in CI usually needs **browser install** step and can run against **Vercel preview URL** or **local `next start`** — choose one approach when implementing.

## What to add to the repo when E2E lands

- `playwright.config.ts` (or official Next + Playwright pattern).
- Tests under e.g. `e2e/` with a minimal **smoke suite** first; expand coverage incrementally.
- Optional: `npm run test:e2e` script in `package.json`.

## Out of scope (MVP)

- Automated E2E or Playwright in CI **blocking** merges.
- Full cross-browser matrix beyond what Playwright + Chromium provides in CI unless explicitly needed later.
