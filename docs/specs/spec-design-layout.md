# Design & layout spec — sdd-show

Applies to **all routes** unless a feature spec narrows further. Visual direction is a **light, modern marketing / edu** feel with **clear hierarchy**, informed in part by contemporary product landing patterns (e.g. generous type, soft gradients, motion on scroll).

## Responsive behavior (required)

- **Mobile-first:** Base styles target small screens; add breakpoints for tablet and desktop.
- **Readable widths:** Main text columns use a comfortable max width (roughly `prose` / ~65ch) so lines do not span edge-to-edge on large screens.
- **Navigation:** Header uses **three regions**: **logo** (left, links home), **primary nav** (centered on `md+`; **Glossary, Videos, Courses, Blog** — no separate Home item), **Sign up** (right: **primary-colored border + text**, **taller control** `~h-10`, **Lucide `UserPlus`** icon + label, light shadow). Below `md`, primary links move into a **sheet**; **Sign up** stays visible beside the menu trigger. No horizontal scroll for the header chrome at common mobile widths (~375px).
- **Touch:** Primary taps (CTAs, cards, modal triggers) have adequate spacing; avoid **hover-only** affordances as the only way to complete a core action (provide focus / visible affordances).
- **Imagery:** Images scale within their containers (`next/image`); no fixed widths that break small viewports.
- **Sections:** Stack vertically on narrow viewports; multi-column grids from **`md`** / **`lg`** upward.

**Acceptance:** No horizontal page-level scroll at common mobile widths (except intentional full-bleed edge cases); spot-check `/`, `/course`, `/videos` at ~375px and desktop.

## Typography

- **Font:** A **smooth, contemporary sans** (e.g. **Plus Jakarta Sans** or equivalent via `next/font`) for UI and headings; monospace reserved for code contexts if needed.
- **Scale:** **Large display headings** on hero and primary page titles; clear step down for `h2` / `h3`. Avoid shrinking hero type too much on desktop — emphasis is part of the brand read.

## Motion & scroll

- **Scroll reveal:** Primary sections use **subtle entrance motion** when they enter the viewport (fade + short vertical travel). **Stagger** sibling cards modestly where it helps rhythm.
- **Reduced motion:** When `prefers-reduced-motion: reduce` is set, **do not** run scroll-driven movement; show content statically (respecting the user’s OS preference).
- **Page scroll:** Prefer `scroll-behavior: smooth` only when **not** `prefers-reduced-motion: reduce`.
- **Scroll-to-top:** A **floating control** appears after scrolling down; returns the user to the top with smooth scroll (or instant if reduced motion).

## Color, depth, and ornament

- **Background:** Soft off-white / warm neutrals — avoid flat pure white everywhere; use **very subtle radial gradients** in hero or page headers for depth (not heavy illustrations required).
- **Section atmosphere:** Major routes may use **`SectionBackdrop`** (shared component) with **tone presets** (`violet`, `sky`, `emerald`, `amber`, `rose`) — stacked soft radial washes, **low opacity**, never competing with body text. Different sections on the same page may use **different tones** to add rhythm (home FAQ band, course feature row, etc.).
- **Gradients on phrases:** Key words or short phrases may use a **text gradient** (e.g. violet → indigo → sky) for emphasis; use sparingly so sentences stay readable if gradients are removed.
- **Surfaces:** **Rounded blocks** (`2rem`-class corners or similar) for cards, bands, and feature panels; light **border + ring** or shadow for separation instead of harsh lines alone.

## Landing / page composition

- **Air (whitespace):** Generous vertical rhythm between sections; avoid dense “wall of text” on home and course.
- **Clear blocks:** Each major section reads as a **distinct band** (background shift, border, or rounded panel).
- **Hierarchy:** One primary idea per section; CTAs visible without hunting.

## UX practices (baseline)

- **Skip link:** First focusable control skips to **main content** (`#main-content`); main landmark is focusable after skip for keyboard users.
- **Focus:** Visible focus rings on interactive elements (buttons, links, sheet, dialog).
- **CTAs:** Primary vs secondary styles are distinct; primary routes to **Course** where specs require.

## CTAs (visual + placement)

- **Primary CTA** (Course): Filled / high-contrast; **hero + course page** at minimum.
- **Secondary CTAs:** Outline / ghost; must not outrank primary on the same row.
- **Consistency:** Reuse label patterns site-wide where possible.

## Images and illustration

- **Role:** Hero and key bands may use **one main image** plus optional spots; placeholders OK in `public/images/` until final assets (ChatGPT / FreePik / etc.).
- **Performance:** `next/image` with sensible `sizes`; avoid CLS.
- **Alt:** Meaningful `alt` for content images; decorative placeholders use empty `alt` where appropriate.

## Footer / chrome

- Footer stays minimal; same responsive constraints.

## Reference sites (non-binding)

- Inspiration may be drawn from modern marketing landings (**e.g. [meetami.ai](https://meetami.ai/)**): big type, soft gradients, rounded UI, motion — **adapt**, do not copy assets or proprietary branding.

## Future design handoff

- Optional **`design.md`** may add screenshots, palette tokens, and component tweaks. This spec remains the **contract** for responsive structure, motion/accessibility rules, and layout discipline.
