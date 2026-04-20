<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Git — before push

Run **`git fetch origin main`** (and merge or rebase onto `origin/main` when the branch should track `main`) **before** `git push`, so the local view of `main` is current and conflicts surface early.
