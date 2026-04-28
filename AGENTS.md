# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Git — before push / before merge

**Contract:** [docs/specs/spec-workflow-ci.md](./docs/specs/spec-workflow-ci.md) (branching, PRs, **Keep the feature branch current before merge**).

Before **`git push`** or treating a branch as **ready to merge** into `main`: run **`git fetch origin main`** so `origin/main` is current. If the feature branch is **behind** `main`, **`git merge origin/main`** or **`git rebase origin/main`**, resolve conflicts on the branch, then push — so conflicts surface early and the PR matches latest `main`.