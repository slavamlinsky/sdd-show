# Feature spec — Glossary (`/glossary`)

## Intent

Define **SDD** and **10–15** related or commonly confused terms so readers can scan quickly.

## Term card / entry fields

Each term should have:

| Field | Required | Notes |
| ----- | -------- | ----- |
| `slug` | yes | Stable id for anchors; URL optional if single-page list |
| `title` | yes | Term name |
| `shortDefinition` | yes | 1–3 sentences |
| `relatedSlugs` | no | Optional “see also” links to other terms |

## Page behavior (MVP)

- Single page listing all terms (sections or cards). Alphabetical or curated order — either is fine.
- **No search** in MVP (see **spec-main** v2).

## Content seed

- Include **SDD** as a term.
- Remaining terms: planning, acceptance criteria, traceability, living document, etc. (final list at authoring time; total **10–15**).

## Acceptance

- All terms render from shared content source (same pattern as **spec-main** content storage).
- Internal “see also” links resolve to entries on the same page (or scroll-to-anchor).

## Non-goals

- Version history of definitions, community edits, i18n.
