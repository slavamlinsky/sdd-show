# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Implemented agents (in this repository)

**None.** There is no orchestrator, `AgentManager`, or `cli:agent:*` in this tree—only a **Next.js** app. Prose about “agents” (e.g. under [`content/blog/`](./content/blog/), [`lib/glossary-data.ts`](./lib/glossary-data.ts)) is **copy**, not runnable code.

When you add a real agent, document it in a **subsection** using:

- **Name**
- **Purpose** (short)
- **Scope / inputs / outputs**
- **Known constraints / limitations**
- **Owner / maintainer**
- **Entry points** — link to **real** symbols: module path, exported `function` / `class`, or `package.json` script (e.g. `"my-agent": "node ./scripts/my-agent.mjs"`)

### Related: how tools use this repo (not agents)

- **Cursor / IDE:** [`CLAUDE.md`](./CLAUDE.md) defers to this file (`@AGENTS.md`); implementation lives in the IDE, not in this codebase.
- **Scripts:** [`package.json`](./package.json) → `scripts`: `dev` → `next dev`, `build` → `next build`, `start` → `next start`, `lint` → `eslint`.
- **Team Git / CI:** [`docs/specs/spec-workflow-ci.md`](./docs/specs/spec-workflow-ci.md).

## Git — before push / before merge

**Contract:** [docs/specs/spec-workflow-ci.md](./docs/specs/spec-workflow-ci.md) (branching, PRs, **Keep the feature branch current before merge**).

Before `git push` or treating a branch as **ready to merge** into `main`: run `git fetch origin main` so `origin/main` is current. If the feature branch is **behind** `main`, `git merge origin/main` or `git rebase origin/main`, resolve conflicts on the branch, then push — so conflicts surface early and the PR matches latest `main`.