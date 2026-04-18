# Feature spec — Glossary (`/glossary`)

## Intent

Define **SDD** and **10–15** related or commonly confused terms so readers can scan quickly.

## Term card / entry fields

Each term should have:

| Field | Required | Notes |
| ----- | -------- | ----- |
| `slug` | yes | Stable id for anchors; URL optional if single-page list |
| `title` | yes | Term name |
| `shortDefinition` | yes | 1–3 sentences; rendered at **`text-sm`** on the glossary page |
| `categories` | yes | **2–3** short labels (e.g. Development, Product, Planning) — shown as **small outline badges** (“where this applies”), not cross-links |

## Page behavior (MVP)

- Single page listing all terms (sections or cards). Alphabetical or curated order — either is fine.
- **Layout:** On **`lg` and up**, term cards use a **two-column grid** (single column on smaller viewports). See [spec-design-layout.md](./spec-design-layout.md).
- **“Suggest something new”** — button in the hero row links to anchor **`#suggest-term`**; copy explains that **submission / moderation is v2** (stub band at bottom until then).
- **No search** in MVP (see **spec-main** v2).

## Content seed

- Include **SDD** as a term.
- Remaining terms: planning, acceptance criteria, traceability, living document, etc. (final list at authoring time; total **10–15**).

## v2 (planned)

- **Suggest a term:** form or GitHub issue link, optional moderation queue, spam protection — align with [spec-taxonomy.md](./spec-taxonomy.md) if terms get categories/tags.

## Acceptance

- All terms render from shared content source (same pattern as **spec-main** content storage).
- Each term exposes **category badges** (outline style) for usage spheres; no “see also” link row on cards.

## Non-goals

- Version history of definitions, community edits, i18n.
