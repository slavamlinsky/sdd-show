# Videos — roadmap (`/videos`) v2 & v3

Supersedes nothing: **[spec-videos.md](./spec-videos.md)** remains the **MVP / current** contract. Search, topic filter, sort, pagination, suggest-a-video (with link preview — **v2.5**), and subscribe ship against the static list plus suggestion/subscription tables. This document still tracks the **catalog-in-Postgres**, TTL, favorites, and badges.

**Stack assumption:** **Supabase** (Postgres + Auth) — [spec-data-auth.md](./spec-data-auth.md).

**Category and tag slugs** (when browse/filter UX ships) must follow **[spec-taxonomy.md](./spec-taxonomy.md)** so `/videos` and `/blog` share one vocabulary (blog carousel strip: **blog v3** in [spec-blog.md](./spec-blog.md)).

---

## v2 — database, curation, discovery, suggestions

### Data model (high level)

Each **video** (row or document) should support at least:


| Field / concept                       | Purpose                                                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **youTube id / canonical URL**        | Embed + thumbnail (existing MVP behavior).                                                                    |
| **title**, **description** (optional) | Card + SEO.                                                                                                   |
| **category** (required in v2)         | One of **Product · Build · Quality · Design** per [spec-taxonomy.md](./spec-taxonomy.md).                     |
| **tags** (optional, multi)            | Finer filtering / future faceted UI.                                                                          |
| **stats** (views, likes — source TBD) | Display on card or detail; may be **manual** at first, **YouTube API** later, or **on-platform** counts only. |
| **related article slug**              | Link to an on-site blog post that summarizes or comments on the video (your “text copy” plan).                |
| **published at**                      | Sorting, “New” badge logic (see v3), TTL anchor.                                                              |
| **suggested-by** (optional)           | If a user suggestion was accepted — attribution policy TBD.                                                   |


Admin/curation flow (who approves suggestions) is **out of scope** for this roadmap doc; implementation can start with **email-only** intake.

### “Suggest a video” (UI + delivery)

- **Button** on `/videos` (header, premium): **“Suggest a video”**. **Shipped** (modal; YouTube URL + why it matters + topics, multi-select, at least one).
- **Modal** (or drawer) **form** with:
  - **YouTube URL** (required) — validate host / id shape server-side. **Live preview** (title + thumbnail) — see **v2.5** below.
  - **Topics** (required, multi-select, 1–4) — Product / Design / Build / Quality per [spec-taxonomy.md](./spec-taxonomy.md).
  - **Why it is useful** (free text, required) — short paragraph.
- **Submit behavior (v2 first slice):** **Shipped** as the **`suggestVideo` Server Action** (`app/(shell-flush)/videos/actions.ts`) — not a Route Handler. Persist a `video_suggestions` row as **pending** when the table exists so nothing is lost if mail fails; send email (Resend) when configured. Email-only fallback when DB is unavailable.
- **Spam / abuse:** rate limit, honeypot, or CAPTCHA TBD before public launch at scale.

### Listing: search, filters, sort, pagination

- **Search:** **Shipped** client-side over the static list (title, channel, category). Database `ILIKE` when the catalog moves to Postgres.
- **Filter:** **Shipped** — category/pillar chips (same UX as Glossary).
- **Sort:** **Shipped** on the static list — **Featured** (curated order), **Newest** (reverse curated order until `published_at` exists in Postgres), **Title A–Z**, **Title Z–A**. `?sort=` in the URL. **Most saved** waits for v3 favorites.
- **Pagination:** **Shipped** client-side — page size **12 / 24 / 48** (`?per=`), page index `?page=` (1-based). Count line shows range (e.g. “1–12 of 24”). Prev/next controls; page resets when search, filter, sort, or page size changes.

### Infrastructure

- Move from static `**lib/videos-data.ts`** (or content files) to **Supabase** (or API backed by Postgres).
- **Auth:** not required for v2 public listing; **favorites** (v3) imply **anonymous or authenticated** identity (see v3).

---

## v2.5 — suggest modal: YouTube link preview

**Shipped.** Confirm the pasted link before submit — no YouTube Data API key required.

- **Trigger:** debounced lookup when the YouTube URL field parses to a valid id (`lib/videos-youtube.ts`).
- **Loading:** spinner under the URL field while the server fetches metadata.
- **Preview card:** thumbnail, **title**, channel (`author_name` from oEmbed). Shown on success so the user can verify the right video.
- **Fetch:** server-side **YouTube oEmbed** (`https://www.youtube.com/oembed?url=…&format=json`) via **`lookupYoutubePreview`** Server Action (`app/(shell-flush)/videos/actions.ts`). Thumbnail falls back to `img.youtube.com/vi/{id}/hqdefault.jpg`.
- **Errors:** invalid id (client validation), not found / not embeddable (oEmbed 404), or network failure — inline message; submit still allowed when the id shape is valid (preview is confirmatory).
- **Non-goals:** persisting preview title on `video_suggestions` (optional later for moderators).

---

## v3 — TTL, favorites, badges, advanced surfacing

### Configurable TTL (rotating catalog)

- Each video (or **global default** with per-video override) has a **visibility window**, e.g. **30–90 days** after **publication date** (exact field name TBD).
- After TTL: video **drops from default list** for users who have **not** favorited it.
- **Favorites** (see below) **keep** a video visible to that user (and optionally in a “saved” view) **past TTL**.

**Product questions to lock before build:**

- TTL from **first publish on our site** vs **YouTube upload date** (recommend: **our** `published_at`).
- Whether TTL hides the **deep link** entirely or only **listing** (spec: **listing + search default** hide; **direct URL** may still resolve with a “archived” or “save to keep” CTA — TBD).

### Favorites

- User can **favorite** a video (session, account, or device token — implementation TBD).
- Favorited items **ignore TTL removal** for that user and appear in **“Saved”** (or similar).
- **Save count** can be shown on cards (aggregate) — privacy / anti-gaming considerations TBD.

### Card badges

- **New:** show **until N days after publication** (proposal: **15 days**; configurable).
- **Saves:** show **N saves** (or bucket: “Popular”) when v3 analytics exist.
- Optional: **category** chip, **TTL warning** (“Leaving soon”) — TBD.

### Filtering / sorting (carry-over + extension)

- v2 **search + category + sort + pagination** still apply.
- Additional sort: **expiring soon**, **most saved**.

---

## Phasing summary


| Release | Focus                                                                                                                                  |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **MVP** | Static list, modal embed — [spec-videos.md](./spec-videos.md)                                                                          |
| **v2**  | **Search / filter / sort / pagination** (static list); suggest-video + email intake; Postgres catalog (categories, tags, stats, related article) **remaining** |
| **v2.5** | Suggest modal **YouTube link preview** (oEmbed, no API key)                                                                                                        |
| **v3**  | TTL + favorites + badges + extended sorting                                                                                            |


Dependencies: v3 **builds on** v2 data model (published_at, user favorites table or equivalent).

---

## Non-goals (both v2 & v3 unless explicitly added later)

- Full YouTube channel sync, comment threads, or replacing YouTube playback.
- Guaranteed freshness of **external** view/like counts without API keys and quotas.

---

## Open decisions

- **Identity** for favorites: anonymous cookie vs Supabase Auth vs both.
- **Stats:** YouTube Data API vs on-site metrics only.
- **Moderation** workflow for suggested links (dashboard vs email-only).