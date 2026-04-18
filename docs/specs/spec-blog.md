# Feature spec — Blog (`/blog`, `/blog/[slug]`)

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
