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

## Acceptance

- At least **6** videos in seed data (adjust if fewer exist — minimum **3** for layout test).
- Clicking a card opens modal with correct video; closing returns to list without route change (unless implementation prefers `/videos?play=id` — not required).

## Non-goals

- Playlists sync, autoplay next, comments embed.

## Roadmap (v2 / v3)

Planned capabilities (Supabase, suggest-video form, categories, search, TTL, favorites, badges) live in **[spec-videos-v2-v3.md](./spec-videos-v2-v3.md)** so this file stays the **current / MVP** checklist.