# Design & layout spec — sdd-show

Applies to **all routes** unless a feature spec narrows further. Visual direction is a **light, modern marketing / edu** feel with **clear hierarchy**, informed in part by contemporary product landing patterns (e.g. generous type, soft gradients, motion on scroll).

## App shell (root layout)

- **Shared horizontal shell:** Root `app/layout.tsx` wraps the site chrome only (`SiteHeader`, `main`, footer). Inside `main`, **route-group layouts** apply **`PageShellPadded`** or **`PageShellFlush`** from `components/page-shell.tsx`: both use **`page-shell`** + `mx-auto max-w-6xl px-4 sm:px-6`. **`PageShellPadded`** adds **`py-16 sm:py-24`** (article-style pages, stubs). **`PageShellFlush`** omits vertical padding so full-bleed heroes and backdrops can sit flush under the header (home, course, blog index, glossary, videos). New top-level routes pick the segment that matches their first-band layout.
- **Full-bleed bands:** Marketing sections whose background or borders should span the **viewport** (hero, some bordered bands, `SectionBackdrop` pages) use a shared **`full-bleed`** utility: break out of the shell horizontally, then use an inner `mx-auto max-w-6xl px-4 sm:px-6` (or narrower when specified) so text aligns with the shell.
- **Default page title (`h1`):** Primary titles use a shared base style — `font-heading`, `text-4xl` / `sm:text-5xl`, `font-semibold`, `tracking-tight` — scoped with **`:where(.page-shell) h1`** in global CSS so route-level utilities can override size (e.g. `text-2xl` on `/sign-in`, larger `lg:` display on heroes).

## Responsive behavior (required)

- **Mobile-first:** Base styles target small screens; add breakpoints for tablet and desktop.
- **Readable widths:** Main text columns use a comfortable max width (roughly `prose` / ~65ch) so lines do not span edge-to-edge on large screens.
- **Navigation:** Header uses **three regions**: **logo** (left, links home), **primary nav** (centered on `md+`; **Glossary, Videos, Courses, Blog** — no separate Home item), **Sign in** (right: **primary-colored border + text**, **taller control** `~h-10`, **Lucide `LogIn`** icon + label, light shadow). Below `md`, primary links move into a **sheet**; **Sign in** stays visible beside the menu trigger. No horizontal scroll for the header chrome at common mobile widths (~375px).
- **Touch:** Primary taps (CTAs, cards, modal triggers) have adequate spacing; avoid **hover-only** affordances as the only way to complete a core action (provide focus / visible affordances).
- **Imagery:** Images scale within their containers (`next/image`); no fixed widths that break small viewports.
- **Sections:** Stack vertically on narrow viewports; multi-column grids from **`md`** / **`lg`** upward.

**Acceptance:** No horizontal page-level scroll at common mobile widths (except intentional full-bleed edge cases); spot-check `/`, `/course`, `/videos` at ~375px and desktop.

## Typography

- **Font:** A **smooth, contemporary sans** (e.g. **Plus Jakarta Sans** or equivalent via `next/font`) for UI and headings; monospace reserved for code contexts if needed.
- **Scale:** **Large display headings** on hero and primary page titles; clear step down for `h2` / `h3`. Avoid shrinking hero type too much on desktop — emphasis is part of the brand read.

## Naming & capitalization

**Default: sentence case** for almost all reader-facing and UI copy — capitalize the first word and proper elements only; avoid “Title Case Everywhere.”

Apply sentence case to:

- **Page and section headings** (`h1`–`h3`), **FAQ questions**, **card titles** (except where a title is a single taxonomy label; see below).
- **Blog frontmatter** `title` (SEO), `name` (cards / links), `heading` (article `<h1>`), **`anons`**, and **body `##` headings**.
- **Site chrome** strings from `siteConfig` (e.g. browser title, footer brand line) unless a legal or partner string dictates otherwise.

**Reserve non–sentence-case styling for:**

- **Named methods and phrases** when you mean the formal idea: e.g. **Spec-Driven Development (SDD)**, **Intent-Driven Engineering** (and **IDE** when the copy defines it that way). In running prose after the first clear mention, **spec-driven development** / **intent-driven engineering** may stay lowercase unless emphasis needs bold.
- **Acronyms** in standard form: SDD, TDD, API, UI, QA, PRD, etc.
- **Proper nouns** (products, companies, people): Jira, GitHub, Next.js, YouTube, etc.
- **Taxonomy pillar labels** on chips, badges, and filters: **Product**, **Design**, **Build**, **Quality** — fixed labels per [spec-taxonomy.md](./spec-taxonomy.md) (short shelf names, not full sentences).
- **Code identifiers**, routes, and UI that mirror technical literals (e.g. `Done`, branch names) — match the source of truth.

**Hyphenation:** Use hyphens in **compound modifiers** before a noun: *AI-driven*, *spec-driven*, *test-driven*, *requirement-driven* (e.g. “AI-driven blog”, “spec-driven development workflow”).

**Alt text and captions:** Same rules — sentence case; don’t shout with Title Case unless the visible label in the image is styled that way.

**Acceptance:** New copy and content edits are reviewed against this section so headings and cards stay calm and scannable; coined terms stay recognizable.

## Motion & scroll

- **Implementation — Framer Motion:** Animate **block- and element-level appearance** with **[Framer Motion](https://www.framer.com/motion/)** — e.g. **`motion.div`** (or other `motion.*` elements) with **`whileInView`**, **`initial` / `animate`**, and optional **`variants`** for parent/child stagger. Use for **primary sections**, **cards**, **hero copy/media**, and other marketing blocks where a subtle entrance improves rhythm. Prefer **once** (or bounded) viewport triggers so motion does not loop distractingly on re-scroll unless a spec calls for it.
- **Scroll reveal (behavior):** Entrances stay **subtle** — typically **opacity + short vertical offset** (or equivalent), modest **duration** and **easing**, and **staggered** siblings (lists, grids) only where it aids scanability — not flashy or long-running.
- **Reduced motion:** When `prefers-reduced-motion: reduce` is set, **skip** scroll-driven transforms and opacity ramps (Framer’s **`useReducedMotion`** or equivalent); render **static** final styles. Respect the same rule for any non–Framer Motion fallbacks.
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
