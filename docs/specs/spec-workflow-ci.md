# Workflow, Git, Vercel, and testing

Complements [spec-main.md](./spec-main.md). This file is the **default team contract** for how work lands in the repo.

## Git branching (`main` only via approved PRs)

- `**main`** is the **production line** (Vercel deploys from it). **New work does not land on `main` via direct push** — it lands via a **feature branch** → **Pull Request** → **merge** (after review/approval as configured below).
- **Every new commit** (features, fixes, docs) should be created on a **branch**, pushed there, and merged into `main` **through GitHub** — not by pushing local commits straight to `main`.

**Standard flow:**

1. `**git checkout main && git pull origin main`** — start from up-to-date `main`.
2. `**git checkout -b feat/short-description`** — use an informative slug; see naming table (e.g. `docs/update-workflow`, `fix/nav-zindex`).
3. Implement, `**git commit`**, `**git push -u origin your-branch-name**`.
4. Open a **Pull Request** on GitHub: **base = `main`**, compare = your branch.
5. **Review:** at least one **approval** before merge when branch protection is on (see below). Solo maintainer may self-approve if policy allows.
6. **Merge** on GitHub when checks pass; then locally: `**git checkout main && git pull origin main`**.

**Do not** `git push origin main` for normal changes — that bypasses PR and (if enabled) required reviews.

### Keep the feature branch current before merge

- Run `**git fetch origin main`** (or `git fetch origin`) **before** you treat the branch as ready to merge — so your local view of `**origin/main`** matches GitHub and you are not guessing whether `main` moved.
- If your branch **does not** already contain the latest `**origin/main`** (GitHub shows the PR as behind `main`, or `git merge-base --is-ancestor origin/main HEAD` fails), **integrate before merge**: `**git merge origin/main`** or `**git rebase origin/main`** on your feature branch, then **push** again. Resolve conflicts **on the branch**, not only at merge time on GitHub, so integration issues surface early.
- **Rebase** yields a linear history; **merge** preserves a merge commit — either is fine; pick one convention per team and stay consistent.

This is **required before merging the PR into `main`** whenever `main` has advanced; it is not required before every casual push if you are already up to date.

**Branch naming (examples):**


| Prefix   | Use for                                           |
| -------- | ------------------------------------------------- |
| `feat/`  | New user-facing behavior or pages                 |
| `fix/`   | Bugfixes                                          |
| `docs/`  | Specs, README, comments only                      |
| `chore/` | Tooling, deps, config with no user-visible change |


**Emergencies only:** direct `git push origin main` for **critical** hotfixes (e.g. prod down, revert broken deploy) — still prefer a **branch + fast PR** when possible. Do not use direct pushes for routine docs or features.

### GitHub: enforce PR + approvals (recommended)

In **Settings → Rules → Rulesets** (or **Branches → Branch protection**) for `**main`**:

- Require **Pull request** before merging.
- Require **approvals** (`1` or more) before merge — even solo teams often use **1** so merges stay intentional; you can self-approve if GitHub allows for repo admins.
- Optional: **Require status checks** (CI) before merge when Actions exist.

This matches **“update `main` through PR approvals”** and prevents accidental direct pushes if **“Do not allow bypassing”** is set appropriately.

## Pull requests

- **Title:** Imperative, concise (e.g. `feat: add scroll-to-top on home`).
- **Body:** What changed, why; link to spec section if relevant (`docs/specs/...`).
- **Checks before merge:** Branch includes latest `**origin/main`** (per **Keep the feature branch current before merge** above); `npm run lint` and `**npm run build`** pass locally (or via CI when added).
- **Approval:** Per branch protection; do not merge your own PR until required reviews pass (unless policy explicitly allows admin bypass for solo work).
- **Merge:** Squash merge is fine for a linear history; merge commit is OK if you prefer preserving branch commits.

## Vercel deployment — when to connect

- **Connect early:** Import the GitHub repo in Vercel as soon as the app `**next build`** succeeds locally.
- **Production:** Deploy **production** from `**main`** (Vercel default).
- **Previews:** Enable **preview deployments for pull requests** so every `**feat/*`** PR gets a **unique preview URL** before merging — highly recommended once development is active.
- **Environment variables:** Document in README or Vercel project when Supabase or other secrets are added later.

Nothing in the specs requires “push only from CI”; developers push **branches**; `main` updates via **merge**.

## Testing strategy


| Layer                  | Tool (target)          | MVP                                                                                                                                                                 |
| ---------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **E2E**                | **Playwright**         | Not required for MVP; **add after** core pages ship — smoke paths (home, nav, key routes, course form happy path).                                                  |
| **Unit / integration** | **Vitest** or **Jest** | Optional for utilities, parsers, form validation — add when code benefits from fast feedback. Vitest pairs well with modern Next setups; Jest is fine if preferred. |


**Clarification:** **Playwright** is for **browser E2E** (real pages). **Vitest / Jest** are for **unit or integration** tests, not a substitute for E2E. Do not conflate them.

## CI (later)

- **GitHub Actions** (or Vercel checks): run `npm run lint`, `npm run build`, and eventually `**playwright test`** on **pull requests** targeting `main`.
- Playwright in CI usually needs **browser install** step and can run against **Vercel preview URL** or **local `next start`** — choose one approach when implementing.

## What to add to the repo when E2E lands

- `playwright.config.ts` (or official Next + Playwright pattern).
- Tests under e.g. `e2e/` with a minimal **smoke suite** first; expand coverage incrementally.
- Optional: `npm run test:e2e` script in `package.json`.

## Out of scope (MVP)

- Automated E2E or Playwright in CI **blocking** merges.
- Full cross-browser matrix beyond what Playwright + Chromium provides in CI unless explicitly needed later.