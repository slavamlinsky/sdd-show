# Feature spec — Course (`/course`)

## Intent

Sell the **idea** of an SDD course and collect **leads**; page is **substance + placeholder** until a real course exists.

Follow [spec-design-layout.md](./spec-design-layout.md): **responsive** sections, **airy** spacing, **clear blocks** (hero → who it’s for → syllabus → FAQ → form), **CTA** hierarchy, optional **placeholder images** for hero or module icons until final art.

Audience positioning aligns with [spec-main.md](./spec-main.md) (**Course audience**).

**Library taxonomy (v2):** when browse-by-topic ships, the course uses a **category** (one of **Product · Build · Quality · Design**, often **Build** or **Product**) and optional **tags** per [spec-taxonomy.md](./spec-taxonomy.md) — same vocabulary as blog and videos. Not required for MVP course page copy/structure.

---

## Phased rollout (content & UX)

| Phase | Scope | Status |
| ----- | ----- | ----- |
| **P0** | Hero, syllabus placeholder, lead form, trust row | Done (baseline). |
| **P1** | **“Who this course is for”** in course hero (bullets) + **Course FAQ** accordion | Implemented; copy can still be tuned. |
| **P2** | **Home**: optional compact **“Who it’s for”** band (see [spec-home](./spec-home.md)) | Optional / later. |

**P2 Home** should stay shorter than the course page; course remains the source of nuance.

---

## Page structure (MVP baseline + planned sections)

1. **Hero / pitch**
   - What learners get (bullet list).
   - Optional line: **who it’s for** (single sentence teaser linking down-page when P1 ships).
   - Optional **hero image** (placeholder OK) to match landing quality from the home page.
   - **Primary CTA:** scroll to lead form or in-page form section.

2. **Who this course is for**
   - **Detailed** audience block on `/course` (not the same length as optional Home band):
     - **Students:** software-related learning paths, bootcamps, self-taught builders — *narrow* from generic “students”.
     - **Developers:** **all levels** where the gap is **spec discipline**, not syntax.
     - **QA / test → dev or delivery:** wanting clearer acceptance and less last-minute scope fights.
     - **Product / technical PM types:** **faster MVP** through better specs and acceptance (not “PM 101” replacement).
     - **Entrepreneurs / founders:** small teams, scope control, validation — avoid implying formal enterprise-only process.
   - Short “**Not a fit if…**” (optional): e.g. only want raw coding drills with zero docs.

3. **Syllabus-style sections (dummy but plausible)**
   - **4–6** modules or weeks with title + one-line description each; present as **cards or stacked blocks** with breathing room.
   - Copy can say “coming soon” where honest.

4. **Course FAQ**
   - **Accordion** (same interaction pattern as Home FAQ for consistency).
   - **Intent:** objections, time commitment, level, career path, relationship to agile/tickets — **not** duplicating glossary definitions.
   - **Suggested buckets (draft questions — copy TBD):**
     - Do I need to be a developer already? *(levels)*
     - Is this for students / career switchers / QA? *(segments)*
     - How is this different from “writing tickets”? *(ties to SDD)*
     - I’m a founder with no team — does SDD apply? *(entrepreneurs)*
     - How much time per week? *(commitment — TBD with real syllabus)*
     - Will there be certificates / job support? *(honest: only what you will offer)*

5. **Lead form**
   - Fields: at minimum **email**; optional **name** (if included, keep optional or required consistently in one place).
   - **Submit:** MVP may `console.log`, show success toast, or POST to a Next.js Route Handler that returns 200 — real persistence via **Supabase** later (**spec-main**).
   - Optional: single checkbox “**I identify as:** student / developer / QA / product / founder” for segmentation — **only if** privacy copy is clear; else skip until analytics policy exists.

6. **Trust row (optional)**
   - Link back to `/blog` or `/videos` as “free resources”.

## Acceptance

- Page reads as a **landing-style** flow: distinct bands, not a single cramped column of text (see **spec-design-layout**).
- When P1 ships: **audience** + **FAQ** sections are scannable on mobile; no accordion-within-accordion confusion.
- Form has client-side validation for email format.
- Successful submit shows clear **success state** (message or inline).
- No dead links in syllabus (anchors can be non-interactive headings).

## Non-goals

- Checkout, pricing table, gated content, user accounts.
