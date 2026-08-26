# Feature spec — Videos (`/videos`)

## Intent

Curated **YouTube** videos about SDD (or close topics), presented as **cards** with **in-site playback** in a **modal** (no full navigation away for the default flow).

## Video entry fields


| Field                        | Required | Notes                                                             |
| ---------------------------- | -------- | ----------------------------------------------------------------- |
| `title`                      | yes      |                                                                   |
| `youtubeId` or canonical URL | yes      | Enough to build embed                                             |
| `coverUrl`                   | yes      | Usually `https://img.youtube.com/vi/{id}/hqdefault.jpg` or maxres |
| `duration`                   | no       | Optional label on card                                            |
| `channelTitle`               | no       | Optional                                                          |


## UI

- **Grid of cards:** thumbnail (cover), title, optional meta; click opens **modal**.
- **Modal:** embedded YouTube iframe (shadcn `Dialog` or similar); close on overlay / Escape per component defaults.
- Mobile: modal uses full width appropriately; video remains usable.

## Sourcing

- Hand-curated list in content data (no YouTube API required for MVP).
- **Search + topic filters** on `/videos`, same interaction as Glossary (query + Product / Design / Build / Quality chips, `?pillars=` in the URL). Listing is **newest first** (reverse curated order; no sort control). **Pagination** (12 / 24 / 48 per page, `?page=` / `?per=`) ships on the static list. Catalog-in-Postgres remains in [spec-videos-v2-v3.md](./spec-videos-v2-v3.md).
- **Suggest a video** (header): modal with YouTube URL + **live preview** (title + thumbnail via oEmbed), why it matters, and topics (1–4 pillars). Guests and signed-in users may submit. Persist `video_suggestions` (pending) when the migration is applied; email via Resend when configured.
- **Subscribe to updates** (header): signed-in users toggle `video_update_subscriptions.subscribed` (button becomes “You're subscribed”). Guests get a sign-in dialog (`/sign-in?next=/videos?subscribe=1`), then the flag is set on return.

## Acceptance

- At least **6** videos in seed data (adjust if fewer exist — minimum **3** for layout test).
- Clicking a card opens modal with correct video; closing returns to list without route change (unless implementation prefers `/videos?play=id` — not required).

## Non-goals

- Playlists sync, autoplay next, comments embed.

## Roadmap (v2 / v3)

TTL, favorites, badges, and Postgres catalog remain in **[spec-videos-v2-v3.md](./spec-videos-v2-v3.md)**. Search, topic filter, pagination, suggest-a-video (with link preview), and auth-backed subscribe on the static list are **current**. User-facing sort controls are **deferred** (listing uses newest-first only).