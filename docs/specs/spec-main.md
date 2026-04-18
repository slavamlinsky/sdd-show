# Main spec — sdd-show

## Purpose

A small public website that explains **spec driven development (SDD)** to **students and developers**, with clear navigation and room to grow content.

## Primary and secondary goals

- **Primary:** Drive visitors toward the **Course** page (subscribe / lead form; real course later).
- **Secondary:** Let visitors **explore** glossary, blog, and curated videos.

## Audience

Students and developers new to SDD or comparing it to other practices.

## Technical stack (fixed for MVP)

| Layer | Choice |
| ----- | ------ |
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Hosting | Vercel |
| Repo | GitHub |
| Backend / DB | None for MVP; **Supabase** allowed later (e.g. lead form persistence) |

## Routes (MVP)

| Path | Page |
| ---- | ---- |
| `/` | Home |
| `/glossary` | Term definitions (SDD + related terms) |
| `/blog` | Article listing |
| `/blog/[slug]` | Single article |
| `/videos` | Curated YouTube list with in-site playback |
| `/course` | Course CTA + structured placeholder + lead form |

## Global layout

- **Header:** Site title / logo text, primary nav links to all routes above.
- **Footer:** Short note + optional link to repo or contact (optional for MVP).
- **Design:** Light, simple, modern (AI-tool / edu style). Detailed visual refs live in a separate `design.md` (or similar) when added — not blocking MVP.

## Content storage (MVP)

Implementations may use:

- Markdown or MDX files with frontmatter under `content/` (recommended), or
- TypeScript modules exporting structured data.

Choose one approach and use it consistently for blog posts, glossary entries, and video metadata.

## SEO baseline

- Per-route `metadata` (title, description).
- Sensible defaults for `/blog/[slug]` from post frontmatter.

## Out of scope (MVP)

- Search (glossary / blog) — **v2**
- Full accessibility audit — no formal bar for MVP; still prefer semantic HTML and shadcn defaults
- Real payments or course delivery
- CMS, auth, comments

## Success criteria (MVP)

- All routes render without errors; nav highlights current section where practical.
- Blog: **3** short articles published in-repo.
- Glossary: **10–15** terms.
- Videos: list with **title + cover**; **modal** plays embedded video on-site.
- Course: believable structure + **lead form** (submit behavior can be stub until Supabase or external endpoint).
- `npm run build` passes on Vercel.

## Glossary (this project)

| Term | Meaning here |
| ---- | ------------- |
| SDD | Spec driven development — defining specifications before implementation and using them to drive delivery. |
| MVP | First shippable version described in this document. |
