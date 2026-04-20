# Feature spec — Blog (`/blog`, `/blog/[slug]`)

**Revisions:** **MVP** is the baseline. **v2** sections extend the home blog band and article detail page; they depend on **primary `category`** per [spec-taxonomy.md](./spec-taxonomy.md).

## Intent

Publish **short, educational articles** about SDD; start with **3** posts, add more later as files in the repo.

## Post schema (frontmatter or equivalent)

| Field | Required | Notes |
| ----- | -------- | ----- |
| `title` | yes | |
| `slug` | yes | URL segment: `/blog/[slug]` |
| `date` | yes | ISO date string |
| `description` | yes | For listing + meta description |
| `author` | no | Omit or static “Slava” for MVP |
| `category` | **v2** | **Exactly one** of **Product \| Design \| Build \| Quality** — required for v2 home filters and related-articles rules; optional in MVP for data prep only |
| `readingTimeMinutes` | no | **v2** nice-to-have on cards; may be computed from body length |
| `editorsPick` | no | **v2** optional boolean — used to pick the **“popular”** related-articles slot when analytics are absent (see below) |

Body: MD/MDX supported by the chosen content pipeline.

## Listing page (`/blog`)

- Reverse chronological (newest first).
- Card or row per post: title, date, description excerpt, “Read more” → `/blog/[slug]`.

## Detail page (`/blog/[slug]`)

- Render full article.
- `metadata` from title + description (+ optional OG later).

## MVP content

- **3** articles, not large (rough target: **500–1200 words** each unless shorter fits better).
- Topics can cover: what SDD is, workflow outline, comparison to TDD/agile docs — author’s choice.

## Acceptance

- Exactly **3** slugs published for launch; adding a 4th post is adding one file + no code change (ideal).
- Invalid `slug` returns Next.js `notFound()`.

## Non-goals

- RSS (optional nice-to-have), comments.

## Taxonomy (v2)

**Categories** and **tags** — filters, chips, and listing badges — follow **[spec-taxonomy.md](./spec-taxonomy.md)** (same model as videos and course). **Not in MVP.** Optional `category` / `tags` in frontmatter before v2 only if the team wants data prep; no UI requirement until v2.

---

## v2 — Home page blog band (`/`)

**Reference pattern:** Marketing “resources” bands — **headline row** + **secondary CTA**, a **row of small category links** under the header, then a **horizontal carousel** of article cards with **prev/next** (and touch swipe where appropriate).

### Layout & behavior

1. **Section header**
   - **Headline** (two lines or one strong line — follow [spec-design-layout.md](./spec-design-layout.md) type rhythm).
   - **Secondary control:** text or outline button **“See all articles”** / **“All posts”** → **`/blog`** (full listing).

2. **Category strip (between header and carousel)**
   - A horizontal row of **small badge-style links or toggle chips** — one per **primary pillar**: **Product**, **Design**, **Build**, **Quality**, plus an **All** (or equivalent) that clears the filter.
   - Labels and slugs match **[spec-taxonomy.md](./spec-taxonomy.md)**.
   - **Client-side filter:** clicking a pillar restricts the carousel to posts whose frontmatter **`category`** matches; **All** shows every post in the carousel pool. Active chip state is visually obvious.

3. **Carousel**
   - **5–7** article cards in the **horizontal** scroller (target **at least 5** once content exists; if the repo has fewer posts, show all available without breaking layout).
   - **Card contents:** visual top (cover image, gradient placeholder, or simple illustration), **small category badge** on the card (matches post `category`; may **deep-link** to the same filter state as the strip, e.g. by updating selection + scroll), **title**, **date**, **reading time** when available, whole card links to **`/blog/[slug]`**.
   - **Navigation:** **Previous / next** affordances (icon buttons); keyboard-friendly where feasible; **touch swipe** on small viewports.
   - **Motion:** optional smooth scroll / Framer Motion per [spec-design-layout.md](./spec-design-layout.md); honor **`prefers-reduced-motion`**.

4. **Data**
   - Same source as **`/blog`** index (files in repo). Default pool order: **newest first** before pillar filter is applied.

### Acceptance (home blog v2)

- Headline + **See all** → `/blog` are present.
- **Category strip** sits **between** header and carousel; filtering is **client-side** and matches post **`category`**.
- Carousel shows up to **5–7** posts with **arrow** (and swipe) navigation; cards match the described structure.

---

## v2 — Article detail extras (`/blog/[slug]`)

Applies **below** the main markdown body, **above** the site footer chrome.

### Join Us CTA banner

- **Placement:** Immediately **after** the article content, **before** related articles.
- **Purpose:** Conversion / community — e.g. **Join us**, **Stay in the loop**, or **Start the course** (final copy TBD). At least **one primary** CTA (e.g. **`/course`**, newsletter stub, or **`/sign-in`** when relevant).
- **Visual:** Full width of the article column (`max-w-3xl` alignment with prose), reads as a **distinct band** (background, border, or rounded panel) — not part of the essay body.

### Related articles

- **Count:** Exactly **two** cards side by side on **`md+`**, stacked on small screens.
- **Eligibility:** Both must share the current post’s **primary `category`** (v2 frontmatter). If the current post has **no** `category` in v2, **omit** the related block or show two **latest** posts excluding current (implementation choice — prefer **requiring `category`** for v2 posts).
- **Slot A — New in category:** The **single newest** other post in the same category by **`date`**, excluding the current slug.
- **Slot B — Popular in category:** Another post in the same category, **excluding** the current article and **excluding** the Slot A article. **“Popular” without analytics:** prefer a post with **`editorsPick: true`** (if multiple, take the **most recent** by `date`); if **none** flagged, use the **second-newest** by `date` among remaining posts in that category. When real engagement metrics exist later, this rule may be replaced by metric-based ranking without changing the **two-slot** layout.
- **Card UI:** Title, date, optional one-line excerpt, link to **`/blog/[slug]`**; optional category badge.

### Acceptance (detail v2)

- **Join Us** CTA banner renders after every article body where v2 is enabled.
- **Related** block shows **two** posts per the **New** + **Popular** rules when category data is present.

---

## Content note (v2 home carousel)

- To fill **5–7** slots comfortably, plan **≥5** published posts over time; until then, the carousel shows however many exist without layout breakage.
