# Feature spec — Home (`/`)

## Intent

Orient visitors, explain SDD in one screenful, and funnel toward **Course** while surfacing **Glossary**, **Ecosystem**, **Blog**, and **Videos**.

Follow [spec-design-layout.md](./spec-design-layout.md) for **responsive bands**, **spacing**, **CTA styling**, **images** (MVP placeholders OK), and **[naming & capitalization](./spec-design-layout.md#naming--capitalization)** (sentence case for hero, FAQ, and cards; taxonomy pillar labels unchanged).

## Sections (MVP)

1. **Hero**
  - Headline: what SDD is in plain language (one line + optional subline).
  - Short supporting text (2–4 sentences max).
  - **Visual:** Hero **image or illustration** on desktop (side-by-side or tasteful background treatment); stack **image above or below** copy on mobile. Use **placeholder** art until final assets (ChatGPT / FreePik / etc.).
  - **Primary CTA:** button/link to `/course`.
  - **Secondary CTA:** button/link to `/glossary` or “Explore” anchored to the next section (either is fine; pick one implementation).
2. **Four pillars of intent**
  - Short band: heading + **four cards** (title, Lucide icon, one-line description) — outcome clarity, success metrics, constraints, delegation — responsive **2×2** from `sm` up, **single column** on the smallest widths. Card titles link to matching anchors on `/glossary` where terms exist.
3. **Evolution timeline**
  - **Vertical** band (full-bleed): copy explains progression **from manual friction to AI-driven speed**. Five **eras** (2018–20 → 2026+) with **process** and optional **friction/challenge/issue** lines. **Desktop:** centered axis with **alternating** cards (first era on the **right**); **mobile:** left rail with dots and stacked cards.
4. **Q&A (single FAQ block on home)**
  - **3–5** questions and short answers (accordion or static blocks).
  - Topics: what SDD is, how it differs from “just tickets”, when it helps, tools optional.
  - **Do not** duplicate a second full FAQ below the footer; **course-specific** FAQ lives on `/course` ([spec-course](./spec-course.md)).
5. **Blog preview**
   - **MVP:** **Carousel** of up to **4** newest posts (title, date, reading time, excerpt, **cover** from post `**socialImage**` or first local inline figure). **Layout:** about **one** card on **&lt; md**, **two** from **`md`** up to **`lg`**, **three** from **`lg`** (viewport breakpoints so tablets stay two-up; horizontal snap + arrows + dot indicators). Entire **card** is one link to `/blog/[slug]`; **All articles** → `/blog`.
   - **v3:** Optional **pillar category** strip between header and carousel; richer related rules on `/blog` — see [spec-blog.md](./spec-blog.md).
6. **Video library strip**
   - Same band pattern as blog preview: **heading** (e.g. **Fresh from our** + gradient **video library**) + short description + **All videos** → `/videos`.
   - **Carousel** of up to **four** curated entries (the **`videos`** list **after** the hero featured item): same snap / arrows / dots behavior as the blog carousel; **one** slide on **&lt; md**, **two** from **`md`** to **`lg`**, **three** from **`lg`** (viewport breakpoints). Each **card**: YouTube poster, title, optional category + channel; **tap** opens in-site **modal player** (same as `/videos`).
7. **“Who it’s for” (course audience — compact)** — *optional / phased; see [spec-course](./spec-course.md)*
  - **Small band** on home (optional): short heading + **2–4 bullets or chips** mapping to [course audience in spec-main](./spec-main.md#course-audience). Full detail and bullets may live primarily on `/course` hero.
8. **Explore the ecosystem** — *P1; see [spec-ecosystem.md](./spec-ecosystem.md)*
  - Heading + lead: understand the tools, approaches, and standards shaping intent-driven engineering.
  - Three links: **Tools** (What can I use?) · **Approaches** (How should I work?) · **Standards** (How does it fit together?) → `/ecosystem#…`.

## Acceptance

- Hero + Q&A + blog preview + video teaser are visible without relying on client-only rendering for core copy where feasible (SEO-friendly).
- CTAs match **spec-main** (primary → course) and **spec-design-layout.md** (visual hierarchy).
- **Responsive:** Sections stack with clear separation; hero image does not break layout at mobile and desktop widths.
- **Motion:** Home bands (hero, pillars, timeline, blog row, etc.) follow **spec-design-layout.md** — **Framer Motion** for block/element entrance where used, with `prefers-reduced-motion` respected.
- **v3 (when shipped):** Blog band matches [spec-blog.md](./spec-blog.md) (carousel, category strip, related rules on article pages are blog spec).

## Non-goals

- Blog content authoring on this page; posts live under `/blog`.

