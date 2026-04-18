# Feature spec — Home (`/`)

## Intent

Orient visitors, explain SDD in one screenful, and funnel toward **Course** while surfacing **Glossary**, **Blog**, and **Videos**.

Follow [spec-design-layout.md](./spec-design-layout.md) for **responsive bands**, **spacing**, **CTA styling**, and **images** (MVP placeholders OK).

## Sections (MVP)

1. **Hero**
   - Headline: what SDD is in plain language (one line + optional subline).
   - Short supporting text (2–4 sentences max).
   - **Visual:** Hero **image or illustration** on desktop (side-by-side or tasteful background treatment); stack **image above or below** copy on mobile. Use **placeholder** art until final assets (ChatGPT / FreePik / etc.).
   - **Primary CTA:** button/link to `/course`.
   - **Secondary CTA:** button/link to `/glossary` or “Explore” anchored to the next section (either is fine; pick one implementation).

2. **Q&A (single FAQ block on home)**
   - **3–5** questions and short answers (accordion or static blocks).
   - Topics: what SDD is, how it differs from “just tickets”, when it helps, tools optional.
   - **Do not** duplicate a second full FAQ below the footer; **course-specific** FAQ lives on **`/course`** ([spec-course](./spec-course.md)).

3. **Blog preview**
   - Show **latest 3** posts (title, date, 1-line excerpt, link to `/blog/[slug]`).
   - Link to full `/blog` listing.

4. **Optional teaser row**
   - One line + link to `/videos` (if hero already pushes Course, this balances exploration).

5. **“Who it’s for” (course audience — compact)** — *optional / phased; see [spec-course](./spec-course.md)*
   - **Small band** on home (optional): short heading + **2–4 bullets or chips** mapping to [course audience in spec-main](./spec-main.md#course-audience). Full detail and bullets may live primarily on **`/course`** hero.

## Acceptance

- Hero + Q&A + blog preview + video teaser are visible without relying on client-only rendering for core copy where feasible (SEO-friendly).
- CTAs match **spec-main** (primary → course) and **spec-design-layout.md** (visual hierarchy).
- **Responsive:** Sections stack with clear separation; hero image does not break layout at mobile and desktop widths.

## Non-goals

- Blog content authoring on this page; posts live under `/blog`.
