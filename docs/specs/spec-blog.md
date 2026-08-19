# Feature spec — Blog (`/blog`, `/blog/[slug]`)

**Revisions:** **MVP** is file-backed markdown under `content/blog/`. **v2** expands **`/blog` UX**: **topic filter**, a **single-row featured promo** (newest or flagged post), a **subscribe / social** band, then a **paginated card grid** for the rest; **production** may read posts from a **database** (listing + detail) with the same editorial schema. **v3** adds the **home** carousel + **pillar category** strip and **article-foot** extras (Join Us CTA + category-based related posts); those depend on **primary `category`** per [spec-taxonomy.md](./spec-taxonomy.md).

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
| `featured`           | no       | **v2 listing:** when `true`, prefer this post for the **promo row** (if it matches the active topic filter); ties / multiples → **newest by `date`** among featured; if none flagged, promo = **newest** in filtered set.                                                                                                                                                                                                                |
| `editorsPick`        | no       | **v3** optional boolean — used to pick the **“popular”** related-articles slot when analytics are absent (see v3 below)                                                                                                                                                                                                                                                 |


Body: MD/MDX supported by the chosen content pipeline. Start body with `## …` sections; do not repeat the page `heading` as `#` in markdown unless you intentionally want two titles (avoid duplication). Section headings in the body use **sentence case**; use **bold** or the full coined phrase for formal terms (**Spec-Driven Development (SDD)**, **Intent-Driven Engineering**, …) per [spec-design-layout.md — Naming & capitalization](./spec-design-layout.md#naming--capitalization).

**Implementation:** `lib/blog.ts` exposes `blogCardTitle`, `blogCardAnons`, `blogPageHeading`, `blogCardPreviewImage`, `blogShareImagePath`, `firstMarkdownImageSrc`, `getSimilarPosts`, `blogReadingTimeMinutes`, and `estimateReadingMinutesFromMarkdown`. UI uses `**components/blog-reading-time.tsx`** (`BlogReadingTime`) and `**components/blog-similar-articles.tsx**` (`BlogSimilarArticles`).

## Listing page (`/blog`)

- Reverse chronological (newest first) for the full archive.
- **MVP / current:** Card or row per post (see below). **v2 target:** filter strip → **one** featured promo row → subscribe band → **paginated** card grid — see **[v2 — `/blog` layout](#v2--blog-layout)**.
- Card or row per post: **`name`** (link text), **`anons`** (excerpt), date, **reading time** (clock icon + **Nmin**), “Read more” → `/blog/[slug]`. Falls back to `title` / `description` when `name` / `anons` absent.
- **Transitional (pre–full v2 layout):** **Left cover** when **`blogCardPreviewImage`** resolves to an image; otherwise **no** thumbnail column (text-only row). **No** large outer tinted/bordered wrapper around the whole list — see **v2** below; **Implementation status** marks **Done** vs **Not started**.

## Detail page (`/blog/[slug]`)

- Render full article.
- `**generateMetadata`:** `title` + `description` for `<title>` / basic meta; also `**openGraph`** / `**twitter**` with preview image from `**blogShareImagePath**` (`**socialImage**` → first local inline image → `**defaultBlogShareImage**`). `**alternates.canonical**` uses `metadataBase` from the root layout for absolute URLs.
- **JSON-LD:** `schema.org/Article` via `articleJsonLd` (`lib/json-ld.ts`) on the detail page, plus `schema.org/BreadcrumbList` (`breadcrumbJsonLd`: Home → Blog → article heading). Site-wide `WebSite` JSON-LD lives in the root layout.
- **Internal links:** Prefer **1–2** in-body links per post to `/glossary`, `/ecosystem`, and `/course` when the sentence already belongs there. Related posts stay in `**BlogSimilarArticles**`. Do not keyword-stuff the homepage; a brand link to `/` is optional and last.
- **Header:** Breadcrumbs **Home → Blog →** article heading (current page, not a link; not a “Back to blog” control). Meta row (date + reading time); `<h1>` from `heading` (then `name`, then `title`); lead from `anons` (then `description`). **No** full-bleed hero image in the header—figures appear only inside the article markdown body.
- **Similar articles (MVP / v2):** Immediately **after** the `</article>` body, render `**BlogSimilarArticles`**: up to **three** other posts (**newest first**), excluding the current slug (`getSimilarPosts` in `**lib/blog.ts`**; default limit **3**). **Layout:** **two** cards on **&lt; md** viewports; **three** in a row from **`md`**. Cards: optional cover thumb, date, `**BlogReadingTime**`, title, one-line `**anons**`, whole card links to `/blog/[slug]` — internal links for UX + SEO. **Hover:** **~8px** upward translate (`**-translate-y-2`**) + border emphasis; **no** shadow lift (`**shadow-none`** on the link). **v3** may replace this rail with category-based **Related** rules (below) where `category` exists.

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
  - **`/images/what-is-sdd-spec-depth-scale.png`** — after “When to keep the write-up thin”; spec depth vs risk calibration (fuller spec vs thin write-up). Default blog figure aspect.
- **SDD workflow article (`sdd-workflow-for-small-teams`):** Inline assets:
  - `**/images/sdd-rhythm-loop.png`** — after the intro, before “Frame the problem” (five-step rhythm diagram). Default blog figure aspect.
  - `**/images/sdd-acceptance-contrast.png**` — after “Draft acceptance criteria” (chaos vs clarity). Default blog figure aspect.
  - `**/images/sdd-lean-living-doc.png**` — after “Demo and prune” (before vs after doc). Default blog figure aspect.
- **Intent-driven article (`intent-driven-engineering`):** Inline assets:
  - `**/images/intent-driven-user.png`** — after “The evolution of the lifecycle” (human / intent-architect framing). **16:9** in the frame.
  - `**/images/intent-driven-schema.png`** — after “Where does control live?” (workflow / guardrails schema). **16:9** in the frame.
  - `**/images/intent-driven-role-shift.jpg`** — after the ambiguity line in “From scribe to architect” (upstream role metaphor). Uses the **default ~16:9** blog figure aspect unless a future change aligns it to 16:9.
- **Spec frameworks article (`sdd-tools-and-frameworks`):** Assets:
  - **`/images/spec-sdd-frameworks-cover.png`** — **`socialImage`** / link-preview and first inline figure (spec as hub, three tool paths).
  - **`/images/spec-sdd-frameworks-why.png`** — after “Why spec-driven development frameworks exist” (chat noise vs one contract).
  - **`/images/spec-sdd-frameworks-compare.png`** — under “Spec Kit vs OpenSpec vs Kiro” (three visual lanes).
  Cross-links: `/ecosystem#tools`, `/blog/what-is-spec-driven-development`, `/course#syllabus`.
- **Implementation:** Paths `**intent-driven-user`** and `**intent-driven-schema**` use `**aspect-video` (16:9)** in the markdown renderer; other post images (including `**intent-driven-role-shift`**) keep **~16:9**. Export **user** and **schema** at **16:9** for predictable crops.

## MVP content

- **3** articles, not large (rough target: **500–1200 words** each unless shorter fits better).
- Topics can cover: what SDD is, workflow outline, comparison to TDD/agile docs — author’s choice.

## Acceptance

- Exactly **3** slugs published for launch; adding a 4th post is adding one file + no code change (ideal).
- Invalid `slug` returns Next.js `notFound()`.

## Non-goals

- RSS (optional nice-to-have), comments.

## Taxonomy (listing filter vs home)

**Categories** and **tags** follow **[spec-taxonomy.md](./spec-taxonomy.md)**. **MVP:** optional `category` / `tags` in data only; **no** browse UI. **`/blog` v2:** horizontal **topic filter** (pillars + **All**) on the **listing page**. **Home `/` v3:** category strip + carousel filter — separate section **v3 — Home page blog band** later in this doc; not required for v2 listing work.

---

## v2 — Database-backed posts and list / detail UI

### Data

- **Runtime source:** Published blog posts are **read from a database** — same Postgres as [spec-data-auth.md](./spec-data-auth.md) (**P4**). `/blog` and `/blog/[slug]` load **metadata and markdown body** from the DB, not only from files under `content/blog/` on each request.
- **Fields:** Persist the same concepts as the MVP schema (at minimum `slug`, `title`, `date`, `description`, markdown body, and optional `name`, `anons`, `heading`, `socialImage`, `readingTimeMinutes`, `author`; optional `category`, `editorsPick`, `tags` for filters and v3). **v2 listing:** optional **`featured`** (boolean) — when **true**, that post wins the **promo row** if published and matches the active topic filter; if **no** post is `featured`, use the **newest** post in the filtered set for the promo. At most **one** `featured` live post is assumed; if multiple, pick the **newest by date** among featured.
- **Authoring / sync:** How posts get **into** the DB (migration from repo files, admin tool, CI job) is implementation-defined; v2 only requires that **production** listing and detail use DB reads. Development may keep a file fallback until cutover if documented.

### v2 — `/blog` layout (target)

Vertical order on **`/blog`** (reference pattern: “resources hub” — filter, **one** hero row, conversion band, archive grid):

1. **Topic filter**
   - Horizontal row of **pill / chip** controls below the page title (and optional subtitle).
   - **All** — shows every post (subject to pagination below).
   - **One chip per pillar** — **Product**, **Design**, **Build**, **Quality** — labels and meaning per **[spec-taxonomy.md](./spec-taxonomy.md)**. Filtering uses the post’s **primary `category`** when present; posts **without** `category` appear only under **All** (or as a product rule: hide until categorized — implementation choice, document in PR).
   - **Behavior:** **Client-side** filter is acceptable for v2; **optional** `?category=` (slug) on the URL for shareable filtered views + SSR alignment when using DB.
   - **Active** chip state is visually obvious (e.g. filled pill vs outline), keyboard-focusable, per [spec-design-layout.md](./spec-design-layout.md).

2. **Featured promo (single full-width row)**
   - **One** post — not a carousel — as the **lead** item: **two columns from `md+`**: **left** — small **category** label (if any), **headline** (`name` preferred for display), **lead** (`anons` or fallback to `description`), bottom **meta row** (author avatar/name if available, **date**, **reading time**); **right** — **large** cover (`blogCardPreviewImage` / `socialImage` / first inline figure) in a rounded frame, `object-cover`, sensible **aspect** (e.g. 16:9 or 4:3). **&lt; md:** **stack** (image below copy or above — pick one implementation; default **image after** copy so title is first).
   - **Which post:** If **`featured: true`** exists in the filtered set, use the **newest such** post by `date`; else use the **single newest** post in the filtered set.
   - **Dedup:** The promo post **must not** repeat in the **paginated grid** on the same page load.

3. **Subscribe / follow band**
   - **Placement:** Between the promo and the card grid.
   - **Primary:** **Email capture** for followers / newsletter — headline + short value prop, email field, submit (stub API or external ESP integration later); accessible labels and error state.
   - **Secondary:** **Social links** (optional row): use **site-wide** config or a small dedicated list (X, LinkedIn, GitHub, etc.) — icon + text or icon-only with `aria-label`, theme-aware contrast.

4. **Article grid + pagination**
   - **Grid** of **cards** for **all other** posts (same filter as above), **newest first**, excluding the promo post.
   - **Card:** cover thumb (when available), **date**, **reading time**, **title**, **one-line** excerpt (`anons`), whole card links to `/blog/[slug]`; hover/focus per design spec.
   - **Pagination:** **Page-based** listing for SEO — e.g. **`?page=`** or path segment, with **prev/next** and page numbers (implementation choice). **Page size** target **9–12** posts per page (tune to grid columns). **Empty** filter state: clear message + link to **All**.

### `/blog` — transitional layout (until full v2 band ships)

Until the **promo + subscribe + grid + pagination** slice lands, the listing may keep the current **vertical rows**:

- **Cover thumbnail (left):** When **`blogCardPreviewImage`** resolves, **small** left cover + text; if **no** image, **omit** the thumb — **no** empty block; ~**4:3** crop on small screens.
- **Shell:** **No** single large tinted/bordered wrapper around the entire `<ul>` — **plain** stack or light dividers between rows.

### `/blog/[slug]` (v2)

Minor alignment with layout tokens and meta row; **no** **Join Us** band or **two-slot category related** rail (those remain **v3**).

### Implementation status (this repo)

| Area | Status |
|------|--------|
| **`/blog`:** left cover from **`blogCardPreviewImage`** when present; **no** placeholder when absent | **Done** — transitional row layout — `app/(shell-flush)/blog/page.tsx` |
| **`/blog`:** plain list shell (**no** outer rose/tint wrapper) | **Done** |
| **`/blog`:** topic **filter** strip (pillars + **All**) | **Not started** |
| **`/blog`:** **featured promo** row (split layout + dedupe from grid) | **Not started** |
| **`/blog`:** **subscribe** + **social** band | **Not started** |
| **`/blog`:** **card grid** + **pagination** | **Not started** |
| **`/blog` + `/blog/[slug]`:** optional **`featured`** in frontmatter / DB | **Not started** |
| **`/blog` + `/blog/[slug]`:** runtime reads from **DB** in production | **Not started** — posts still from `content/blog` via `getAllPosts()` |

### Non-goals (v2)

- Home **carousel** band and its **category strip** (those are **v3** — see below); v2 listing filter is **independent** of home.
- Article **Join Us** CTA + **two-slot related** rules (**v3** detail).
- Full **CMS** or in-browser authoring (optional later).

### Acceptance (v2)

- **Target — layout:** `/blog` implements **in order**: topic filter → **one** promo row → subscribe/social band → **paginated** card grid; promo post **omitted** from the grid; filter respects **primary `category`** + **All**.
- **Target — data:** **Production** listing + detail backed by **DB** when the team cuts over; until then file-backed data may drive the same UI.
- **Target — behavior:** Detail page and share previews match MVP semantics; **similar-articles** rail unchanged until v3 related rules.
- **Repo today:** Only the **transitional** row list + shell items in **Implementation status** are **Done**; promo, filter, subscribe, grid pagination, **`featured`**, and **DB** are **Not started**.

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

