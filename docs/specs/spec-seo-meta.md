# Feature spec — SEO and meta

**Status:** Phase 1 (this branch) ships **page metadata**, **keyword clusters**, and crawler files already on `main` (sitemap, robots, `llms.txt`, JSON-LD). **Phase 2** is a **3–6 month** content and landing plan.

Copy and titles follow **sentence case** per [spec-design-layout.md — Naming & capitalization](./spec-design-layout.md#naming--capitalization), except coined terms (**SDD**, **Spec Kit**, product names). Document **`<title>`** sounds **human** (varied openers, **50–58 characters**) and **ends with a period**. **Meta description** is **140–155 characters** and matches the title. No brand suffix.

Agent rules: [`.cursor/rules/seo-meta.mdc`](../../.cursor/rules/seo-meta.mdc). Source of truth for strings: `lib/seo-page-meta.ts` and `lib/seo-keywords.ts`.

## Intent

Help people who search for **spec-driven development**, **SDD tools**, and **intent-driven engineering** land on the right page, with honest titles and share previews. Do not keyword-stuff body copy or the homepage.

## Keyword clusters

Use **one or two primary clusters per URL**. Hyphenated and unhyphenated SDD queries both appear because people type both.

| Cluster id (`lib/seo-keywords.ts`) | Role | Example queries |
| ---------------------------------- | ---- | --------------- |
| `sddCore` | Definition and named practice | spec-driven development, spec driven development, SDD, what is spec driven development, living specification, acceptance criteria |
| `intent` | Layer above SDD | intent-driven engineering, intent-driven engineer, software intent, intent contracts |
| `ticketsAndSpecs` | Tracking vs meaning | tickets vs specs, specs vs user stories, Jira tickets vs specifications |
| `practice` | How to run it | spec driven development workflow, SDD for small teams, delivery alignment |
| `tools` | Kits and products | spec-driven development tools, SDD frameworks, GitHub Spec Kit, OpenSpec, Kiro |
| `agents` | AI in the loop | directing AI agents, prompt engineering vs specs, spec for AI coding |
| `course` | Learning / lead | SDD course, become an intent-driven engineer |
| `ecosystem` | Map and standards | SDD ecosystem, MCP, A2A |

`<meta name="keywords">` is **not** a ranking lever. Keep the list short and aligned with the page. Rankings come from **titles, H1, body, links, and crawlability**.

## Phase 1 — page meta contract

Root layout (`app/layout.tsx`):

- `metadataBase` = `siteConfig.url`
- `title` default = `siteConfig.title` (home query; **no** `%s · brand` template)
- Fallback description, Open Graph, and Twitter for child routes that omit them

Hub pages export `metadataFromPageSeo(pageSeo.<id>)`. **Do not** duplicate title/description strings in the route file. **`<title>`:** human, varied, **50–58 characters**, **ends with a period**. **Description:** 140–155 characters. **Auth** pages (`/sign-in`, `/account`) stay **`noindex`**; titles still **end with a period** and name the **Intent-Driven Community** (the 50–58 / 140–155 rules do not apply).

| Path | Title | OG image |
| ---- | ----- | -------- |
| `/` | Intent-driven engineering: write the outcome, then build. | `/images/og-home.png` |
| `/course` | Become an intent-driven engineer - course for developers. | `/images/og-course.png` |
| `/blog` | Essays on specs, tickets, SDD workflows, and tools. | `/images/og-blog.png` |
| `/ecosystem` | A field guide to Spec Kit, OpenSpec, Kiro, and MCP. | `/images/og-ecosystem.png` |
| `/glossary` | A short glossary for SDD, specs, and software intent. | `/images/og-glossary.png` |
| `/videos` | Talks and walkthroughs on AI-driven development work. | `/images/og-videos.png` |
| `/tests` | Short self-checks on SDD, specs, and software intent. | `siteConfig.defaultShareImage` until `/images/og-tests.png` exists |
| `/blog/[slug]` | Frontmatter `title` (ends with a period) + `description` (140–155) | `socialImage` → body image → `/images/og-default.png` |
| `/sign-in` | Sign in to the Intent-Driven Community. | `noindex` |
| `/account` | Your Intent-Driven Community account. | `noindex` |

Do **not** use `public/logo-ai-driven.png` as `og:image`. Hub share art is the `og-*.png` set. Article figures can stay as in-body art; only use them for OG when they crop well in **16:9**.

Every **indexable** page sets `alternates.canonical`, `openGraph` (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`), and Twitter `summary_large_image`.

Blog posts also keep **Article JSON-LD** and breadcrumbs per [spec-blog.md](./spec-blog.md).

## Phase 2 — next 3–6 months

Ship **one primary URL per primary query**. Do not create thin tag pages. Prefer **articles** and **one comparison hub** over many near-duplicate posts.

### Months 1–2 — capture definition and comparison demand

| Priority | Primary keyword / cluster | URL to add or strengthen | Format |
| -------- | ------------------------- | ------------------------ | ------ |
| P0 | what is spec driven development (`sddCore`) | Keep `/blog/what-is-spec-driven-development` as the definition URL; refresh title/H2s if Search Console shows a better query | Article (existing) |
| P0 | spec driven development tools / Spec Kit vs OpenSpec vs Kiro (`tools`) | Keep `/blog/sdd-tools-and-frameworks` + `/ecosystem` | Article + hub (existing) |
| P1 | tickets vs specs (`ticketsAndSpecs`) | Keep `/blog/tickets-vs-specs`; add a glossary **See also** if missing | Article (existing) |
| P1 | spec driven development workflow (`practice`) | Keep `/blog/sdd-workflow-for-small-teams`; add a short “solo founder” variant **or** a new post if the existing piece cannot rank for both | Article |
| P1 | GitHub Spec Kit tutorial (`tools`) | **New** `/blog/github-spec-kit` (or similar slug): specify → plan → tasks, constitution, when not to use it | Article |
| P1 | OpenSpec brownfield (`tools`) | **New** `/blog/openspec-existing-codebase`: delta specs, propose → apply | Article |

### Months 3–4 — intent, agents, and course

| Priority | Primary keyword / cluster | URL to add or strengthen | Format |
| -------- | ------------------------- | ------------------------ | ------ |
| P1 | intent-driven engineering (`intent`) | Keep `/blog/intent-driven-engineering`; consider a shorter **definition** section that can be cited | Article (existing) |
| P1 | prompt engineering vs specs (`agents`) | **New** `/blog/prompt-engineering-vs-specs` | Article |
| P1 | acceptance criteria for AI agents (`sddCore` + `agents`) | **New** `/blog/acceptance-criteria-for-agents` | Article |
| P2 | become an intent-driven engineer (`course`) | Strengthen `/course` (FAQ, syllabus modules as H2s that match queries); do **not** spin a second course URL | Page (existing) |
| P2 | directing AI agents / spec for AI coding (`agents`) | Optional **new** `/blog/specs-for-coding-agents` if the prompt-vs-specs post cannot cover both | Article |

### Months 5–6 — landings and ecosystem depth

| Priority | Primary keyword / cluster | URL to add or strengthen | Format |
| -------- | ------------------------- | ------------------------ | ------ |
| P2 | Kiro spec-driven development (`tools`) | **New** `/blog/kiro-spec-driven-development` **or** a section + jump link on the frameworks post if overlap is high | Article or expand existing |
| P2 | MCP + specs (`ecosystem`) | **New** `/blog/mcp-and-spec-driven-development` plus ecosystem `#` anchor | Article |
| P2 | living specification (`sddCore`) | New glossary depth **or** `/blog/living-specs-in-git` | Glossary + article |
| P3 | Comparison hub | **New** `/ecosystem/compare` **or** keep a single `/ecosystem` with in-page H2s (Spec Kit vs OpenSpec vs Kiro) — prefer **one** hub unless traffic justifies a split | Page |
| P3 | Glossary term URLs | Per-term routes (`/glossary/[slug]`) only if Search Console shows term queries we cannot satisfy with `#` anchors | Feature (depends on [spec-glossary.md](./spec-glossary.md)) |

### Cadence and quality bar

- About **one substantial article per month** (plus meta/internal links), not a burst of thin posts.
- Each new post: unique `title` / `description` / `heading` / `anons`; `socialImage`; **1–2** contextual links to `/glossary`, `/ecosystem`, `/course`; clusters in `clustersForPostSlug`.
- After publish: add the URL to `llms.txt` (automatic via `getAllPosts`) and spot-check OG with a debugger.
- Use Search Console (when the property exists) to **promote or merge** posts; do not keep two URLs for the same query.

### Explicitly out of Phase 2

- Buying backlinks, doorway pages, or title spam.
- A separate marketing domain or language versions (until there is a real localization spec).
- Ranking for generic “software engineering” or “agile” without an SDD angle.

## Acceptance (Phase 1)

- Public routes have unique title + description + OG image.
- View-source (or rich-results test) shows `og:title`, `og:description`, `og:image`, canonical on indexable pages.
- Auth routes remain `noindex`.
- `npm run lint` and `npm run build` pass.
