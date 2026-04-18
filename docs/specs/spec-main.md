# Main spec — sdd-show

## Purpose

A small public website that explains **spec driven development (SDD)** to **students and developers**, with clear navigation and room to grow content.

## Primary and secondary goals

- **Primary:** Drive visitors toward the **Course** page (subscribe / lead form; real course later).
- **Secondary:** Let visitors **explore** glossary, blog, and curated videos.

## Audience (site)

Visitors who want **clearer specs and less rework** — primarily **learners and builders** (see **Course target audience** below for the paid/free course positioning).

## Course audience

The course is for people who **benefit from writing and reading specs** before or while shipping (“who is this for?”). Segments (not mutually exclusive — copy should welcome overlap):

| Segment | Positioning (draft) |
| -------- | ---------------------- |
| **Students** | CS / software-engineering / design programs, **bootcamp grads**, or **serious self-learners** building a portfolio — *not* “anyone in school”; narrow to people who will ship code or technical artifacts. |
| **Developers** | **Any level** for *habit change* (specs first): juniors learning discipline; mids/seniors who want less churn. Optional signpost: “junior-friendly, senior-useful.” |
| **QA / test engineers** | Moving toward **delivery or automation engineering**, or who want specs that actually match what ships. |
| **Product / PM / technical ICs** | Who need **faster MVPs** with fewer misunderstood requirements — emphasis on **shared acceptance**, not replacing engineering. |
| **Founders / entrepreneurs** | **Solo or tiny teams** validating ideas; language: **scope discipline** and **cheap experiments**, not enterprise process. |

**Explicit non-goals for positioning:** do not promise certifications, job placement, or “replace your PM” — keep promises aligned with **spec fluency** and **delivery quality**.

**Where messaging lives:** summarized on **Home** ([spec-home](./spec-home.md)); expanded on **Course** ([spec-course](./spec-course.md)) + **Course FAQ** there — see phased rollout in **spec-course**.

## Technical stack (fixed for MVP)

| Layer | Choice |
| ----- | ------ |
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Hosting | Vercel |
| Repo | GitHub |
| Backend / DB | None for MVP; **Supabase** allowed later (e.g. lead form persistence) |
| Git / deploy / tests | See [spec-workflow-ci.md](./spec-workflow-ci.md) (branching, Vercel timing, Playwright + Vitest/Jest) |

## Routes (MVP)

| Path | Page |
| ---- | ---- |
| `/` | Home |
| `/glossary` | Term definitions (SDD + related terms) |
| `/blog` | Article listing |
| `/blog/[slug]` | Single article |
| `/videos` | Curated YouTube list with in-site playback |
| `/course` | Course CTA + structured placeholder + lead form |
| `/sign-in` | Stub page (“coming soon”) until auth — linked from header only |

## Global layout

- **Header:** **Site title / logo** (links to `/`); **primary nav** lists content routes only — **no duplicate “Home” link**; nav is **centered** on `md+` between logo and actions; **“Sign in”** (outline control, top-right) links to `/sign-in` (stub until auth). **Mobile:** sheet menu for nav + Sign in remains visible next to menu trigger.
- **Footer:** Short note + optional link to repo or contact (optional for MVP).
- **Design:** Light, simple, modern (AI-tool / edu style). **Responsive layout, spacing (“air”), structured blocks, CTAs, and image rules** are defined in [spec-design-layout.md](./spec-design-layout.md). Optional visual references may live in a future **`design.md`** — not blocking MVP.

## Content storage (MVP)

Implementations may use:

- Markdown or MDX files with frontmatter under `content/` (recommended), or
- TypeScript modules exporting structured data.

Choose one approach and use it consistently for blog posts, glossary entries, and video metadata.

**v2:** topic browse — **categories and tags** (filters, badges) follow [spec-taxonomy.md](./spec-taxonomy.md) (shared across blog, videos, and course positioning). Not required for MVP.

## SEO baseline

- Per-route `metadata` (title, description).
- Sensible defaults for `/blog/[slug]` from post frontmatter.

## Out of scope (MVP)

- **Topic taxonomy UX** — category/tag filters, browse-by-topic, listing badges per [spec-taxonomy.md](./spec-taxonomy.md) — **v2** (data-only prep optional)
- Search (glossary / blog) — **v2**
- Full accessibility audit — no formal bar for MVP; still prefer semantic HTML and shadcn defaults
- **Automated E2E (Playwright) and CI test gates** — add post-MVP per [spec-workflow-ci.md](./spec-workflow-ci.md); optional Vitest/Jest for units when useful
- Real payments or course delivery
- CMS, auth, comments

## Success criteria (MVP)

- Layout meets [spec-design-layout.md](./spec-design-layout.md) (responsive, block structure, CTA hierarchy, images/placeholders).
- All routes render without errors; nav highlights current section where practical.
- Blog: **3** short articles published in-repo.
- Glossary: **10–15** terms.
- Videos: list with **title + cover**; **modal** plays embedded video on-site.
- Course: believable structure + **lead form** (submit behavior can be stub until Supabase or external endpoint).
- `npm run build` passes on Vercel.

## Glossary (this project)

| Term | Meaning here |
| ---- | ------------- |
| SDD | Spec driven development — defining specifications before implementation and using them to drive delivery. |
| MVP | First shippable version described in this document. |
