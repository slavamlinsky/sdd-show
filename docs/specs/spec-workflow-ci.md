# Workflow, Git, Vercel, and testing

Complements [spec-main.md](./spec-main.md). This file is the **default team contract** for how work lands in the repo.

## Git branching (default: PR to `main`)

- **`main`** is **protected in practice**: production on Vercel should track it. **Do not treat `main` as a scratch pad** for multi-file features once previews and collaborators exist.
- **Preferred flow for any non-trivial change:**
  1. **`git checkout main && git pull`**
  2. **`git checkout -b feat/short-description`** (or `fix/…`, `docs/…` — see table below).
  3. Commit on the branch; **`git push -u origin your-branch-name`**
  4. Open a **Pull Request** into `main` on GitHub (review yourself if solo — still gives history + preview URL).
  5. Merge when green (see checks below).

**Branch naming (examples):**

| Prefix | Use for |
| ----- | -------- |
| `feat/` | New user-facing behavior or pages |
| `fix/` | Bugfixes |
| `docs/` | Specs, README, comments only |
| `chore/` | Tooling, deps, config with no user-visible change |

**Direct push to `main`** is acceptable only for **tiny** hotfixes (one-liner, urgent typo) when a branch feels heavier than the change. Default assumption: **use a branch + PR**.

## Pull requests

- **Title:** Imperative, concise (e.g. `feat: add scroll-to-top on home`).
- **Body:** What changed, why; link to spec section if relevant (`docs/specs/...`).
- **Checks before merge:** `npm run lint` and **`npm run build`** pass locally (or via CI when added).
- **Merge:** Squash merge is fine for a linear history; merge commit is OK if you prefer preserving branch commits.

## Vercel deployment — when to connect

- **Connect early:** Import the GitHub repo in Vercel as soon as the app **`next build`** succeeds locally.
- **Production:** Deploy **production** from **`main`** (Vercel default).
- **Previews:** Enable **preview deployments for pull requests** so every **`feat/*`** PR gets a **unique preview URL** before merging — highly recommended once development is active.
- **Environment variables:** Document in README or Vercel project when Supabase or other secrets are added later.

Nothing in the specs requires “push only from CI”; developers push **branches**; `main` updates via **merge**.

## Testing strategy

| Layer | Tool (target) | MVP |
| ----- | ------------- | --- |
| **E2E** | **Playwright** | Not required for MVP; **add after** core pages ship — smoke paths (home, nav, key routes, course form happy path). |
| **Unit / integration** | **Vitest** or **Jest** | Optional for utilities, parsers, form validation — add when code benefits from fast feedback. Vitest pairs well with modern Next setups; Jest is fine if preferred. |

**Clarification:** **Playwright** is for **browser E2E** (real pages). **Vitest / Jest** are for **unit or integration** tests, not a substitute for E2E. Do not conflate them.

## CI (later)

- **GitHub Actions** (or Vercel checks): run `npm run lint`, `npm run build`, and eventually **`playwright test`** on **pull requests** targeting `main`.
- Playwright in CI usually needs **browser install** step and can run against **Vercel preview URL** or **local `next start`** — choose one approach when implementing.

## What to add to the repo when E2E lands

- `playwright.config.ts` (or official Next + Playwright pattern).
- Tests under e.g. `e2e/` with a minimal **smoke suite** first; expand coverage incrementally.
- Optional: `npm run test:e2e` script in `package.json`.

## Out of scope (MVP)

- Automated E2E or Playwright in CI **blocking** merges.
- Full cross-browser matrix beyond what Playwright + Chromium provides in CI unless explicitly needed later.
