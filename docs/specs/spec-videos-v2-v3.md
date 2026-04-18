# Videos — roadmap (`/videos`) v2 & v3

Supersedes nothing: **[spec-videos.md](./spec-videos.md)** remains the **MVP / current** contract. This document captures **planned** capabilities once data moves off static files.

**Stack assumption:** **Supabase** (or equivalent Postgres + API) for persisted videos, categories, tags, user prefs, and TTL logic — aligned with [spec-main](./spec-main.md) (“Supabase allowed later”).

**Category and tag slugs** (v2+) must follow **[spec-taxonomy.md](./spec-taxonomy.md)** so `/videos` and `/blog` share one vocabulary when filters land.

---

## v2 — database, curation, discovery, suggestions

### Data model (high level)

Each **video** (row or document) should support at least:

| Field / concept | Purpose |
| ---------------- | ------- |
| **youtube id / canonical URL** | Embed + thumbnail (existing MVP behavior). |
| **title**, **description** (optional) | Card + SEO. |
| **category** (required in v2) | Filter + taxonomy (e.g. “Workflow”, “Talks”, “Tools”). |
| **tags** (optional, multi) | Finer filtering / future faceted UI. |
| **stats** (views, likes — source TBD) | Display on card or detail; may be **manual** at first, **YouTube API** later, or **on-platform** counts only. |
| **related article slug** | Link to an on-site blog post that summarizes or comments on the video (your “text copy” plan). |
| **published at** | Sorting, “New” badge logic (see v3), TTL anchor. |
| **suggested-by** (optional) | If a user suggestion was accepted — attribution policy TBD. |

Admin/curation flow (who approves suggestions) is **out of scope** for this roadmap doc; implementation can start with **email-only** intake.

### “Suggest a video” (UI + delivery)

- **Button** on `/videos` (e.g. secondary): **“Suggest a video”**.
- **Modal** (or drawer) **form** with:
  - **YouTube URL** (required) — validate host / id shape server-side.
  - **Category** (required or optional with default) — align with category taxonomy.
  - **Why it is useful** (free text, required) — short paragraph.
- **Submit behavior (v2 first slice):** POST to a **Route Handler** that sends email to you (e.g. Resend, SES, or Supabase Edge + mail). Store a row in Supabase as **“pending”** when DB exists so nothing is lost if mail fails.
- **Spam / abuse:** rate limit, honeypot, or CAPTCHA TBD before public launch at scale.

### Listing: search, filters, sort, pagination

- **Search:** full-text or `ILIKE` over title, description, tags (database indices).
- **Filter:** **category** (required filter surface once categories exist).
- **Sort:** e.g. newest, most saved (once saves exist), title A–Z.
- **Pagination:** offset/limit or cursor — avoid loading full list for large catalogs.

### Infrastructure

- Move from static **`lib/videos-data.ts`** (or content files) to **Supabase** (or API backed by Postgres).
- **Auth:** not required for v2 public listing; **favorites** (v3) imply **anonymous or authenticated** identity (see v3).

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

| Release | Focus |
| ------- | ----- |
| **MVP** | Static list, modal embed — [spec-videos.md](./spec-videos.md) |
| **v2** | Supabase (or DB), categories, tags, stats + related article, suggest-video flow, email intake, **search / filter / sort / pagination** |
| **v3** | TTL + favorites + badges + extended sorting |

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
