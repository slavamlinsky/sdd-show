# Feature spec — Home (`/`)

## Intent

Orient visitors, explain SDD in one screenful, and funnel toward **Course** while surfacing **Glossary**, **Blog**, and **Videos**.

## Sections (MVP)

1. **Hero**
   - Headline: what SDD is in plain language (one line + optional subline).
   - Short supporting text (2–4 sentences max).
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

## Acceptance

- Hero + Q&A + blog preview are visible without relying on client-only rendering for core copy (SEO-friendly).
- CTAs match **spec-main** (primary → course).
- Layout works on mobile (single column stack).

## Non-goals

- Blog content authoring on this page; posts live under `/blog`.
