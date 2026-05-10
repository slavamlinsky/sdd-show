# Feature spec — Blog (`/blog`, `/blog/[slug]`)

**Revisions:** **MVP** is file-backed markdown under `content/blog/`. **v2** introduces a **database** as the runtime source for published posts (listing + detail) and **small UI polish** on `/blog` and `/blog/[slug]`. **v3** adds the **home** carousel + **pillar category** strip and **article-foot** extras (Join Us CTA + category-based related posts); those depend on **primary `category`** per [spec-taxonomy.md](./spec-taxonomy.md).

## Intent

Publish **short, educational articles** about SDD; start with **3** posts. **MVP** authors in-repo markdown; **v2** keeps the same editorial shape but **production** reads from a **database** (see below).

## Post schema (frontmatter or equivalent)


| Field                | Required | Notes                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`              | yes      | **SEO:** `<title>` / Open Graph — can be longer and keyword-oriented. Use **sentence case** per [spec-design-layout.md — Naming & capitalization](./spec-design-layout.md#naming--capitalization); keep **SDD** / **Spec-Driven Development** (etc.) as named terms when needed.                                                                                        |
| `slug`               | yes      | URL segment: `/blog/[slug]`                                                                                                                                                                                                                                                                                                                                             |
| `date`               | yes      | ISO date string                                                                                                                                                                                                                                                                                                                                                         |
| `description`        | yes      | **SEO:** meta description (`generateMetadata`). Not required to double as on-page copy when `anons` is set.                                                                                                                                                                                                                                                             |
| `name`               | no       | **Card / link label:** short title on home + `/blog` cards and “Read article” context. Defaults to `title` if omitted (legacy posts). **Sentence case** per design spec.                                                                                                                                                                                                |
| `anons`              | no       | **Reader teaser:** one or two sentences on cards and under the article `<h1>`. Defaults to `description` if omitted so older posts keep a deck line. Prefer distinct copy from SEO `description` for new posts. **Sentence case** per design spec.                                                                                                                      |
| `heading`            | no       | **On-page `<h1>`** on `/blog/[slug]`. Defaults to `name`, then `title`. Lets SEO `title` differ from the headline readers see. **Sentence case** per design spec.                                                                                                                                                                                                       |
| `socialImage`        | no       | **Link previews only** (site-root path): `**og:image`** / `**twitter:image**` via `**blogShareImagePath**`. **Not** rendered as a hero above the article—illustrations live in the markdown body. If omitted, previews use the **first** local inline image, then `**defaultBlogShareImage`**. Also used as the preferred thumb in **similar-articles** cards when set. |
| `author`             | no       | Omit or static “Slava” for MVP                                                                                                                                                                                                                                                                                                                                          |
| `category`           | no       | **Exactly one** of **Product | Design | Build | Quality** when present — **required** for v3 home filters and related-articles rules; optional in MVP / v2 for forward-compatible columns or frontmatter                                                                                                                                                                |
| `readingTimeMinutes` | no       | Optional **override** (positive integer). If omitted, **reading time is estimated** from the markdown body via `lib/blog.ts` (**~200 wpm** baseline × `**READING_TIME_DISPLAY_MULTIPLIER`**, currently **2**, so the shown minutes are **~twice** naive word-count ÷ 200), displayed as a **small clock icon + “Nmin”** — see `**BlogReadingTime`**.                    |
| `editorsPick`        | no       | **v3** optional boolean — used to pick the **“popular”** related-articles slot when analytics are absent (see v3 below)                                                                                                                                                                                                                                                 |


Body: MD/MDX supported by the chosen content pipeline. Start body with `## …` sections; do not repeat the page `heading` as `#` in markdown unless you intentionally want two titles (avoid duplication). Section headings in the body use **sentence case**; use **bold** or the full coined phrase for formal terms (**Spec-Driven Development (SDD)**, **Intent-Driven Engineering**, …) per [spec-design-layout.md — Naming & capitalization](./spec-design-layout.md#naming--capitalization).

**Implementation:** `lib/blog.ts` exposes `blogCardTitle`, `blogCardAnons`, `blogPageHeading`, `blogCardPreviewImage`, `blogShareImagePath`, `firstMarkdownImageSrc`, `getSimilarPosts`, `blogReadingTimeMinutes`, and `estimateReadingMinutesFromMarkdown`. UI uses `**components/blog-reading-time.tsx`** (`BlogReadingTime`) and `**components/blog-similar-articles.tsx**` (`BlogSimilarArticles`).

## Listing page (`/blog`)

- Reverse chronological (newest first).
- Card or row per post: **`name`** (link text), **`anons`** (excerpt), date, **reading time** (clock icon + **Nmin**), “Read more” → `/blog/[slug]`. Falls back to `title` / `description` when `name` / `anons` absent.
- **v2:** **Left cover** when **`blogCardPreviewImage`** resolves to an image; otherwise **no** thumbnail column (text-only row). **No** large outer tinted/bordered wrapper around the whole list — see **v2** below; **Implementation status** marks what is **Done** in this repo vs DB work still **Not started**.

## Detail page (`/blog/[slug]`)

- Render full article.
- `**generateMetadata`:** `title` + `description` for `<title>` / basic meta; also `**openGraph`** / `**twitter**` with preview image from `**blogShareImagePath**` (`**socialImage**` → first local inline image → `**defaultBlogShareImage**`). `**alternates.canonical**` uses `metadataBase` from the root layout for absolute URLs.
- **Header:** Meta row (date + reading time); `**<h1>`** from `**heading**` (then `name`, then `title`); lead from `**anons**` (then `description`). **No** full-bleed hero image in the header—figures appear only inside the article markdown body.
- **Similar articles (MVP / v2):** Immediately **after** the `</article>` body, render `**BlogSimilarArticles`**: up to **two** other posts, **newest first**, excluding the current slug (`getSimilarPosts` in `**lib/blog.ts`**). Cards: optional cover thumb, date, `**BlogReadingTime**`, title, one-line `**anons**`, whole card links to `/blog/[slug]` — internal links for UX + SEO. **Hover:** **~8px** upward translate (`**-translate-y-2`**) + border emphasis; **no** shadow lift (`**shadow-none`** on the link). **v3** may replace this rail with category-based **Related** rules (below) where `category` exists.

## Share preview (Open Graph and social links)

- **Goal:** Pasting an article URL in Slack, LinkedIn, iMessage, X, etc. should unfurl **title**, **description**, and a **preview image**—not a bare link.
- **Image source:** `**socialImage`** in frontmatter when you want an explicit preview asset (can match a key inline figure path). `**blogShareImagePath**` resolves `**socialImage**` → first local `**![...](...)**` in the body → `**defaultBlogShareImage**`, absolute via `**metadataBase**`. Previews are independent of layout: the article itself has **no** duplicate hero band above `**<h1>`**.
- **Checklist before publish:** Set `**socialImage`** when the first inline image is not the best crop for cards; after deploy, spot-check with a link debugger (e.g. [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/), [opengraph.xyz](https://www.opengraph.xyz/), or platform-specific card validators).

## Inline figures (markdown)

- **Default:** Images in post bodies use a shared **figure frame** in `components/markdown-content.tsx`: **~16:9** aspect, `**object-cover`**, rounded border — suitable for diagrams and hero art on most posts.
- **What is SDD article (`what-is-spec-driven-development`):** Assets:
  - **`/images/what-is-sdd-cover.png`** — **`socialImage`** / link-preview art; not shown as a header hero.
  - **`/images/what-is-sdd-spec-hub.png`** — after “What spec-driven development means in practice”; article-only hub diagram (spec as source). Default blog figure aspect.
  - **`/images/tickets-vs-specs-visual.png`** — after “How tickets and specs differ”; contrast illustration. Default blog figure aspect.
- **SDD workflow article (`sdd-workflow-for-small-teams`):** Inline assets:
  - `**/images/sdd-rhythm-loop.png`** — after the intro, before “Frame the problem” (five-step rhythm diagram). Default blog figure aspect.
  - `**/images/sdd-acceptance-contrast.png**` — after “Draft acceptance criteria” (chaos vs clarity). Default blog figure aspect.
  - `**/images/sdd-lean-living-doc.png**` — after “Demo and prune” (before vs after doc). Default blog figure aspect.
- **Intent-driven article (`intent-driven-engineering`):** Inline assets:
  - `**/images/intent-driven-user.png`** — after “The evolution of the lifecycle” (human / intent-architect framing). **16:9** in the frame.
  - `**/images/intent-driven-schema.png`** — after “Where does control live?” (workflow / guardrails schema). **16:9** in the frame.
  - `**/images/intent-driven-role-shift.jpg`** — after the ambiguity line in “From scribe to architect” (upstream role metaphor). Uses the **default ~16:9** blog figure aspect unless a future change aligns it to 16:9.
- **Implementation:** Paths `**intent-driven-user`** and `**intent-driven-schema**` use `**aspect-video` (16:9)** in the markdown renderer; other post images (including `**intent-driven-role-shift`**) keep **~16:9**. Export **user** and **schema** at **16:9** for predictable crops.

## MVP content

- **3** articles, not large (rough target: **500–1200 words** each unless shorter fits better).
- Topics can cover: what SDD is, workflow outline, comparison to TDD/agile docs — author’s choice.

## Acceptance

- Exactly **3** slugs published for launch; adding a 4th post is adding one file + no code change (ideal).
- Invalid `slug` returns Next.js `notFound()`.

## Non-goals

- RSS (optional nice-to-have), comments.

## Taxonomy (v3)

**Categories** and **tags** — filters, chips, and listing badges on the **home carousel** and elsewhere — follow **[spec-taxonomy.md](./spec-taxonomy.md)** (same model as videos and course). **Not in MVP or v2.** Optional `category` / `tags` in frontmatter (or DB columns) before v3 only if the team wants data prep; **no taxonomy UI** until v3.

---

## v2 — Database-backed posts and list / detail UI

### Data

- **Runtime source:** Published blog posts are **read from a database** (connection string / client in the app — e.g. Postgres via Supabase or the stack the project adopts). `/blog` and `/blog/[slug]` load **metadata and markdown body** from the DB, not only from files under `content/blog/` on each request.
- **Fields:** Persist the same concepts as the MVP schema (at minimum `slug`, `title`, `date`, `description`, markdown body, and optional `name`, `anons`, `heading`, `socialImage`, `readingTimeMinutes`, `author`; optional `category`, `editorsPick`, `tags` for forward compatibility with v3).
- **Authoring / sync:** How posts get **into** the DB (migration from repo files, admin tool, CI job) is implementation-defined; v2 only requires that **production** listing and detail use DB reads. Development may keep a file fallback until cutover if documented.

### UI (small improvements)

- **`/blog` listing**
  - **Cover thumbnail (left):** When **`blogCardPreviewImage`** resolves to an image (`socialImage` or first local inline in the body), show a **small cover on the left** and text + actions on the right (responsive: may stack on narrow viewports). If there is **no** image, **omit** the thumbnail column entirely — **no** empty placeholder block. Use a modest fixed aspect (e.g. ~**4:3** on small screens) and cropped (`object-cover`) so the column stays calm; not a full-bleed hero.
  - **Listing shell:** Remove the MVP pattern of a **single large tinted/bordered wrapper** around the entire post `<ul>` (the rose-tint gradient + heavy radius “card around all items”). Prefer a **plain vertical stack** (gap between items) or **light dividers**; keep per-post cards/rows as the main surface. No second “outer card” framing the list of article links.
  - Otherwise: clearer hierarchy, spacing and typography per [spec-design-layout.md](./spec-design-layout.md), sensible hover/focus, **empty and error** states if the DB is unavailable — **reverse chronological** and same content fields as MVP (title, excerpt, date, reading time, link).
- **`/blog/[slug]`:** Minor alignment with layout tokens and meta row; no **Join Us** band or **category-based related** slots (those are **v3**).

### Implementation status (this repo)

What matches **v2 UI** today vs what remains **v2 data** work:

| Area | Status |
|------|--------|
| **`/blog`:** left cover from **`blogCardPreviewImage`** when present; **no** thumbnail column (and **no** placeholder) when there is no image | **Done** — `app/(shell-flush)/blog/page.tsx` |
| **`/blog`:** plain vertical list (**no** outer rose/tint bordered wrapper around the post `<ul>`) | **Done** |
| **`/blog` + `/blog/[slug]`:** runtime reads from **DB** in production | **Not started** — posts still load from `content/blog` via `getAllPosts()` |

### Non-goals (v2)

- Home **carousel**, **category strip**, **Join Us** CTA, and **two-slot related** rules (all **v3**).
- Full **CMS** or in-browser authoring (optional later).

### Acceptance (v2)

- **Repo today:** Listing **UI** (left cover + plain list shell) is **Done**; **DB** runtime is **Not started** — see **Implementation status** above.
- **Target — data:** In **production**, every post shown on `/blog` and `/blog/[slug]` is backed by **DB rows** (not direct file reads for published content).
- **Target — behavior:** Listing and detail behavior matches MVP semantics (ordering, fallbacks for `name` / `anons`, reading time, share preview, **similar-articles** rail) unless explicitly superseded by a follow-up spec note.
- **Target — listing:** Rows with a preview image include a **left cover** per **`blogCardPreviewImage`**; rows **without** an image are **text-only** (no placeholder). The list is **not** wrapped in a large tinted outer panel — only per-post surfaces + normal page padding.
- Listing UI otherwise satisfies the **small improvements** bullets above.

---

## v3 — Home page blog band (`/`)

**Reference pattern:** Marketing “resources” bands — **headline row** + **secondary CTA**, a **row of small category links** under the header, then a **horizontal carousel** of article cards with **prev/next** (and touch swipe where appropriate).

### Layout & behavior

1. **Section header**
  - **Headline** (two lines or one strong line — follow [spec-design-layout.md](./spec-design-layout.md) type rhythm).
  - **Secondary control:** text or outline button **“See all articles”** / **“All posts”** → `/blog` (full listing).
2. **Category strip (between header and carousel)**
  - A horizontal row of **small badge-style links or toggle chips** — one per **primary pillar**: **Product**, **Design**, **Build**, **Quality**, plus an **All** (or equivalent) that clears the filter.
  - Labels and slugs match **[spec-taxonomy.md](./spec-taxonomy.md)**.
  - **Client-side filter:** clicking a pillar restricts the carousel to posts whose stored **`category`** (DB or frontmatter, same value) matches; **All** shows every post in the carousel pool. Active chip state is visually obvious.
3. **Carousel**
  - **5–7** article cards in the **horizontal** scroller (target **at least 5** once content exists; if the repo has fewer posts, show all available without breaking layout).
  - **Card contents:** visual top (cover image, gradient placeholder, or simple illustration), **small category badge** on the card (matches post `category`; may **deep-link** to the same filter state as the strip, e.g. by updating selection + scroll), **title**, **date**, **reading time** (estimated or from frontmatter), whole card links to `/blog/[slug]`.
  - **Navigation:** **Previous / next** affordances (icon buttons); keyboard-friendly where feasible; **touch swipe** on small viewports.
  - **Motion:** optional smooth scroll / Framer Motion per [spec-design-layout.md](./spec-design-layout.md); honor **`prefers-reduced-motion`**.
4. **Data**
  - Same source as `/blog` index (by v3, **DB** per v2; consumer reads the same post list the listing page uses). Default pool order: **newest first** before pillar filter is applied.

### Acceptance (home blog v3)

- Headline + **See all** → `/blog` are present.
- **Category strip** sits **between** header and carousel; filtering is **client-side** and matches post `category`.
- Carousel shows up to **5–7** posts with **arrow** (and swipe) navigation; cards match the described structure.

---

## v3 — Article detail extras (`/blog/[slug]`)

Applies **below** the main markdown body, **above** the site footer chrome.

### Join Us CTA banner

- **Placement:** Immediately **after** the article content, **before** related articles.
- **Purpose:** Conversion / community — e.g. **Join us**, **Stay in the loop**, or **Start the course** (final copy TBD). At least **one primary** CTA (e.g. `/course`, newsletter stub, or `/sign-in` when relevant).
- **Visual:** Full width of the article column (`max-w-3xl` alignment with prose), reads as a **distinct band** (background, border, or rounded panel) — not part of the essay body.

### Related articles

- **Count:** Exactly **two** cards side by side on `md+`, stacked on small screens.
- **Eligibility:** Both must share the current post’s **primary `category`** (v3 data). If the current post has **no** `category` in v3, **omit** the related block or show two **latest** posts excluding current (implementation choice — prefer **requiring `category`** for v3 posts).
- **Slot A — New in category:** The **single newest** other post in the same category by `date`, excluding the current slug.
- **Slot B — Popular in category:** Another post in the same category, **excluding** the current article and **excluding** the Slot A article. **“Popular” without analytics:** prefer a post with `editorsPick: true` (if multiple, take the **most recent** by `date`); if **none** flagged, use the **second-newest** by `date` among remaining posts in that category. When real engagement metrics exist later, this rule may be replaced by metric-based ranking without changing the **two-slot** layout.
- **Card UI:** Title, date, optional one-line excerpt, link to `/blog/[slug]`; optional category badge.

### Acceptance (detail v3)

- **Join Us** CTA banner renders after every article body where v3 is enabled.
- **Related** block shows **two** posts per the **New** + **Popular** rules when category data is present.

---

## Content note (v3 home carousel)

- To fill **5–7** slots comfortably, plan **≥5** published posts over time; until then, the carousel shows however many exist without layout breakage.

