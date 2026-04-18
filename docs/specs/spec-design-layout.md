# Design & layout spec — sdd-show

Applies to **all routes** unless a feature spec narrows further. Works with **spec-main** (light, simple, edu / modern product feel).

## Responsive behavior (required)

- **Mobile-first:** Base styles target small screens; add breakpoints for tablet and desktop.
- **Readable widths:** Main text columns use a comfortable max width (roughly `prose` / ~65ch) so lines do not span edge-to-edge on large screens.
- **Navigation:** Header nav collapses to a **mobile pattern** (hamburger / sheet / dropdown — whichever fits shadcn patterns) so links remain usable without horizontal scroll.
- **Touch:** Primary taps (CTAs, cards, modal triggers) have adequate spacing; no reliance on hover-only affordances for core actions.
- **Imagery:** Images scale within their containers (`next/image` or equivalent); no fixed widths that break small viewports.
- **Sections:** Stack vertically on narrow viewports; use multi-column grids only from **`md`** / **`lg`** upward where it improves scanability.

**Acceptance:** No horizontal page-level scroll at common mobile widths (except intentional full-bleed edge cases); spot-check `/`, `/course`, `/videos` at ~375px and desktop.

## Landing / page composition

- **Air (whitespace):** Generous vertical rhythm between sections (`padding` / `gap` scale — consistent token usage via Tailwind). Avoid dense “wall of text” on the home and course pages.
- **Clear blocks:** Each major section reads as a **distinct band** (optional subtle background alternation or borders — keep light). Section headings + short intro line where it helps orientation.
- **Hierarchy:** One primary idea per section; supporting text and actions grouped so the eye finds CTA before fine print.

## CTAs (visual + placement)

- **Primary CTA** (Course): Visually dominant button (filled); appears in hero and/or persistent header only if it does not crowd nav — at minimum **hero + course page**.
- **Secondary CTAs** (Explore, Glossary, Blog, Videos): Outline or ghost style; must not outrank primary on the same row.
- Reuse the same label conventions site-wide (e.g. “View course” vs “Get updates” — pick once in implementation).

## Images and illustration

- **Role:** Hero and key bands may use **one main illustration or image** plus optional smaller spot images for sections (e.g. Q&A, course modules) to support scanning and trust.
- **MVP placeholders:** Use **temporary** assets (neutral geometric shapes, gradient placeholders, or stock-style placeholders in `public/images/`) until final art exists.
- **Final assets:** May be produced in **ChatGPT image**, **FreePik**, or similar; replace placeholders without URL or layout changes when swapping files.
- **Performance:** Prefer **`next/image`** with explicit `width`/`height` or fill + aspect-ratio containers to limit CLS.
- **Alt text:** Short descriptive `alt` for meaningful images; decorative placeholders use empty alt or `role="presentation"` as appropriate.

## Footer / chrome

- Footer stays minimal; same responsive constraints (stack on small screens).

## Future design handoff

- A separate **`design.md`** (repo root or `docs/`) may add **reference screenshots**, exact palettes, and component-level tweaks. This spec remains the **contract** for responsive structure, spacing discipline, and CTA/image rules.
