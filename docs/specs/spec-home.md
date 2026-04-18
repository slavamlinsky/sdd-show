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

2. **Q&A (or FAQ-style block)**
   - **3–5** questions and short answers (accordion or static blocks).
   - Topics: what SDD is, how it differs from “just tickets”, when it helps, tools optional.

3. **Blog preview**
   - Show **latest 3** posts (title, date, 1-line excerpt, link to `/blog/[slug]`).
   - Link to full `/blog` listing.

4. **Optional teaser row**
   - One line + link to `/videos` (if hero already pushes Course, this balances exploration).

5. **“Who it’s for” (course audience — compact)** — *phased; see [spec-course](./spec-course.md)*
   - **Small band** (not a wall of text): short heading (e.g. **Who this is for**) + **2–4 bullets or chips** mapping to [course audience in spec-main](./spec-main.md#course-audience) (students in software paths, developers any level, QA→dev, product/MVP, founders).
   - **Goal:** set expectations before `/course`; reinforce that SDD helps **shipping and alignment**, not one narrow job title.
   - **Optional:** **one** audience-related question may appear in the **mid-page Q&A** or **bottom FAQ** (e.g. “I’m a student — is this for me?”) pointing to `/course` for detail — avoid duplicating the full list in three places.

6. **Bottom FAQ (home only, below global footer)**
   - Extra **accordion FAQ** rendered **after** the site footer on `/` only (does not appear on other routes).
   - Content should complement the mid-page Q&A — e.g. where to start on the site, course notifications, open source, how SDD relates to TDD; **optional one-liner on course audience fit** — not a verbatim duplicate of the **Course** page FAQ ([spec-course](./spec-course.md)).
   - Landmark: optional `id` (e.g. `#bottom-faq`) for deep links.

## Acceptance

- Hero + Q&A + blog preview + video teaser are visible without relying on client-only rendering for core copy where feasible (SEO-friendly); bottom FAQ may use client accordion like other interactive blocks.
- CTAs match **spec-main** (primary → course) and **spec-design-layout.md** (visual hierarchy).
- **Responsive:** Sections stack with clear separation; hero image does not break layout at mobile and desktop widths.

## Non-goals

- Blog content authoring on this page; posts live under `/blog`.
