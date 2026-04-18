# Feature spec — Glossary (`/glossary`)

## Intent

Cover **SDD** plus vocabulary across the four pillars — **Product**, **Build**, **Quality**, **Design** — and AI-era terms via **tags**. Definitions stay short; the blog, videos, and course carry depth.

## Term card / entry fields

Each term should have:

| Field | Required | Notes |
| ----- | -------- | ----- |
| `slug` | yes | Stable id for anchors; URL optional if single-page list |
| `title` | yes | Term name |
| `shortDefinition` | yes | 1–3 sentences; rendered at **`text-sm`** on the glossary page |
| `categories` | yes | **1–3** labels from **Product \| Build \| Quality \| Design** only — pillar badges (“where this applies”) |
| `tags` | no | Cross-cutting slugs (`ai`, `methodology`, `growth`, …) — aligned with [spec-taxonomy.md](./spec-taxonomy.md) and **`lib/taxonomy.ts`**; shown as secondary chips |

## Page behavior (MVP)

- Single page listing all terms (sections or cards). Alphabetical or curated order — either is fine.
- **Layout:** On **`lg` and up**, term cards use a **two-column grid** (single column on smaller viewports). See [spec-design-layout.md](./spec-design-layout.md).
- **“Suggest something new”** — button in the hero row links to anchor **`#suggest-term`**; copy explains that **submission / moderation is v2** (stub band at bottom until then).
- **No search** in MVP (see **spec-main** v2).

## Content seed

- Include **SDD** and foundational SDD terms (requirements vs acceptance criteria, traceability, artifacts, etc.).
- Balance the **four pillars** in the library: **Product** (strategy, GTM, PM), **Build** (specs, code, AI tooling), **Quality** (testing, eval, safety), **Design** (UX, flows). Use **tags** for AI, API, methodology, growth, CRO/ROI-as-topic, etc.
- Total count grows with the blog/course; aim for breadth across pillars, not duplicate jargon.

## v2 (planned)

- **Suggest a term:** form or GitHub issue link, optional moderation queue, spam protection — align with [spec-taxonomy.md](./spec-taxonomy.md).

## Acceptance

- All terms render from shared content source (same pattern as **spec-main** content storage).
- Each term exposes **pillar badges** (outline style) and optional **tag** chips; no “see also” link row on cards.

## Non-goals

- Version history of definitions, community edits, i18n.
