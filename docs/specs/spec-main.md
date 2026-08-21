# Main spec — sdd-show

## Purpose

A small public website that explains **spec driven development (SDD)** to **students and developers**, with clear navigation and room to grow content.

**Copy convention:** Headings, marketing lines, and blog metadata follow **sentence case**; formal terms, acronyms, proper nouns, and fixed taxonomy labels are exceptions — see [spec-design-layout.md — Naming & capitalization](./spec-design-layout.md#naming--capitalization).

## Primary and secondary goals

- **Primary:** Drive visitors toward the **Course** page (subscribe / lead form; real course later).
- **Secondary:** Let visitors **explore** glossary, blog, and curated videos.

## Audience (site)

Visitors who want **clearer specs and less rework** — primarily **learners and builders** (see **Course target audience** below for the paid/free course positioning).

## Course audience

The course (**Become an Intent-Driven Engineer**) is for people who **direct AI agents with written intent** and still want **engineering rigor**. **Four roles** on `/course` (overlap is fine):


| Segment | Positioning |
| ------- | ----------- |
| **Solo founders** | You are the whole company. Specs let one human stay fast with agents. |
| **Full-stack & lead developers** | The one-person army. A tight spec is the force multiplier in the AI age. |
| **Technical leads** | Shared source of truth so AI work stays reviewable, scoped, and safe to merge. |
| **Product / PM** | Precision on system behavior — **intent contracts**, not “PM 101”. |

Architects and senior ICs map onto those seats. **Not the lead story:** intro-to-coding, certificates, or prompt-trick lists.

**Explicit non-goals:** do not promise certifications, job placement, or “replace your PM”.

**Where messaging lives:** summarized on **Home** ([spec-home](./spec-home.md)); expanded on **Course** ([spec-course](./spec-course.md)).

## Technical stack (fixed for MVP)


| Layer                | Choice                                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| Framework            | Next.js (App Router)                                                                                  |
| Styling              | Tailwind CSS                                                                                          |
| Components           | shadcn/ui                                                                                             |
| Hosting              | Vercel                                                                                                |
| Repo                 | GitHub                                                                                                |
| Backend / DB         | **v2+:** **Supabase** (Postgres + **Supabase Auth**) — [spec-data-auth.md](./spec-data-auth.md). MVP had no DB. |
| Git / deploy / tests | See [spec-workflow-ci.md](./spec-workflow-ci.md) (branching, Vercel timing, Playwright + Vitest/Jest) |


## Routes (MVP)


| Path           | Page                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------- |
| `/`            | Home                                                                                                |
| `/ecosystem`   | Map of tools, approaches, and standards ([spec-ecosystem.md](./spec-ecosystem.md))                  |
| `/glossary`    | Term definitions (SDD + related terms)                                                              |
| `/blog`        | Article listing                                                                                     |
| `/blog/[slug]` | Single article                                                                                      |
| `/videos`      | Curated YouTube list with in-site playback                                                          |
| `/course`      | Course CTA + structured placeholder + lead form                                                     |
| `/sign-in`     | Auth: **magic link** + **Google** when [spec-data-auth.md](./spec-data-auth.md) **P2** ships. No email/password. Header **Sign in**. |
| `/sign-up`     | Redirect to `/sign-in` (first magic link or Google sign-in creates the account). |


## Global layout

- **Header:** **Site title / logo** (links to `/`); **primary nav** order: **Glossary → Ecosystem → Videos → Course → Blog** (no duplicate “Home”); nav **centered** on `md+` between logo and actions; **logged out:** **“Sign in”** (primary border + primary text, top-right, **Lucide `LogIn`**) → `/sign-in`. **Logged in (auth P2):** account affordance + **Sign out**. **Mobile:** sheet menu for nav; Sign in / account stays reachable next to the menu trigger.
- **Footer:** Short note + optional link to repo or contact (optional for MVP).
- **App shell:** **Main content** uses one shared wrapper (max width, horizontal + vertical padding, default `h1` styling) in the root layout; routes use `full-bleed` only where a section must span the viewport. See **App shell (root layout)** in [spec-design-layout.md](./spec-design-layout.md).
- **Design:** Light, simple, modern (AI-tool / edu style). **Responsive layout, spacing (“air”), structured blocks, CTAs, and image rules** are defined in [spec-design-layout.md](./spec-design-layout.md). Optional visual references may live in a future `design.md` — not blocking MVP.

## Content storage (MVP)

Implementations may use:

- Markdown or MDX files with frontmatter under `content/` (recommended), or
- TypeScript modules exporting structured data.

Choose one approach and use it consistently for blog posts, glossary entries, and video metadata.

**v2:** topic browse — **categories and tags** (filters, badges) follow [spec-taxonomy.md](./spec-taxonomy.md) (shared across blog, videos, and course positioning). Not required for MVP.

**v2:** **Database + auth** — [spec-data-auth.md](./spec-data-auth.md) (Supabase Postgres + Supabase Auth). **Blog** listing/detail from DB when P4 ships — [spec-blog.md](./spec-blog.md).

**v3:** **Blog** — home **carousel** (5–7 posts) with **pillar category** strip; article foot **Join Us CTA** + **two related posts** (same category: newest + popular rule) — [spec-blog.md](./spec-blog.md).

## SEO baseline

Full contract: [spec-seo-meta.md](./spec-seo-meta.md) (Phase 1 metadata + Phase 2 keyword/content plan). Cursor: [`.cursor/rules/seo-meta.mdc`](../../.cursor/rules/seo-meta.mdc).

- Per-route metadata from `lib/seo-page-meta.ts` (title, description, canonical, Open Graph, Twitter).
- Sensible defaults for `/blog/[slug]` from post frontmatter (**Open Graph / Twitter** preview: `**socialImage`**, else first body image, else `**siteConfig.defaultBlogShareImage**` — see [spec-blog.md — Share preview](./spec-blog.md#share-preview-open-graph-and-social-links)).
- **Article JSON-LD** on `/blog/[slug]` (`schema.org/Article`) plus **BreadcrumbList** (Home → Blog → article in structured data; **visible** trail is **Blog →** article — no Home crumb, logo already links `/`; see [spec-blog.md](./spec-blog.md)); **WebSite** JSON-LD in the root layout.
- **`/sitemap.xml`** (`app/sitemap.ts`) lists public pages and posts. **`/robots.txt`** allows search and AI crawlers (GPTBot, Google-Extended, ClaudeBot, PerplexityBot, Applebot-Extended, CCBot) and disallows `/sign-in`, `/account`, `/auth/`.
- **`/llms.txt`** lists primary URLs and blog posts for humans and LLM crawlers (`lib/llms-txt.ts`).
- In-article markdown should include **1–2 contextual links** to `/glossary`, `/ecosystem`, and `/course` where the sentence already fits. Homepage (`/`) is optional and last, not a keyword dump.

## Out of scope (MVP)

- **Topic taxonomy UX** — category/tag filters, browse-by-topic, listing badges per [spec-taxonomy.md](./spec-taxonomy.md) — **v2** (data-only prep optional)
- Search (glossary / blog) — **v2**
- **Glossary suggest a term** (form → Supabase `glossary_terms` pending) — **v2**; see [spec-glossary.md](./spec-glossary.md)
- **Glossary pillar filter** (four multi-check toggles, default all on; `/glossary?pillars=design` and `/glossary#design`) — **v2**; see [spec-glossary.md](./spec-glossary.md)
- Full accessibility audit — no formal bar for MVP; still prefer semantic HTML and shadcn defaults
- **Automated E2E (Playwright) and CI test gates** — add post-MVP per [spec-workflow-ci.md](./spec-workflow-ci.md); optional Vitest/Jest for units when useful
- Real payments or course delivery
- CMS, comments (auth + DB: [spec-data-auth.md](./spec-data-auth.md), not MVP)

## Success criteria (MVP)

- Layout meets [spec-design-layout.md](./spec-design-layout.md) (responsive, block structure, CTA hierarchy, images/placeholders).
- All routes render without errors; nav highlights current section where practical.
- Blog: **3** short articles published in-repo.
- Glossary: **10–15** terms.
- Videos: list with **title + cover**; **modal** plays embedded video on-site.
- Course: believable structure + **lead form** (submit behavior can be stub until Supabase or external endpoint).
- `npm run build` passes on Vercel.

## Glossary (this project)


| Term | Meaning here                                                                                              |
| ---- | --------------------------------------------------------------------------------------------------------- |
| SDD  | Spec-driven development — defining specifications before implementation and using them to drive delivery. |
| MVP  | First shippable version described in this document.                                                       |
