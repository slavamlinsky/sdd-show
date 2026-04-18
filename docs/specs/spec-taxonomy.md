# Content taxonomy — categories & tags (site-wide)

## Version / scope

- **Target:** **v2** — category/tag **filters**, listing **badges**, and browse-by-topic UX are **out of scope for MVP**.
- **MVP:** content may ship **without** `category` / `tags` in frontmatter or static data. Optional early **data-only** fields (same slugs as below) are allowed if useful for copy audits; no UI requirement until v2.

This doc is the **shared vocabulary and rules** so that when v2 ships, **blog articles**, **videos**, and **course** positioning use **one** model (Markdown frontmatter, Supabase columns, etc., as chosen per route).

---

## Four **category** pillars (browse shelves)

Use these **four** labels only — keep the set **fixed** so filters stay scannable.

| Category | Meaning |
| -------- | ------- |
| **Product** | Strategy, users, roadmap, PM, GTM, positioning, PMF, value, requirements at the “what / why” level — merged **product + marketing** concerns. |
| **Build** | Shipping work: specs, code, APIs, tooling, implementation — what we used to call **development**; **“Build”** is the preferred shelf name (human, outcome-oriented). |
| **Quality** | Verification and safety: testing, acceptance, evals, red teaming, traceability to tests — **not** the same as Build (how we ship vs how we prove it). |
| **Design** | UX/UI, flows, research-backed decisions, clarity of surfaces — distinct from Build (implementation) and Product (strategy). |

### Build vs Development

- **Development** is still fine in **prose** (“development workflow”).
- For **taxonomy and UI**, use **Build** as the canonical category slug/label so the pillar reads as **what we build and how we specify it**, not as a generic org function.

### Glossary exception (MVP)

- Glossary cards may show **1–3 pillar badges** per term (terms often span pillars). Blog/video/course items should converge on **one primary category** for v2 filters plus tags.

---

## Tags (cross-cutting)

| Mechanism | Role | Cardinality |
| --------- | ---- | ------------- |
| **Category** (pillar) | Primary shelf for browse — **exactly one** per blog post / video / course slice in v2. | **One of** Product, Build, Quality, Design |
| **Tags** | Tools, domains, themes — **AI**, **API**, **methodology**, **growth**, **CRO**, **ROI** (as topics), etc. | **Zero or more** |

Tags are **orthogonal** to pillars: e.g. **Build** + tags `ai`, `llm`, `spec-driven-development`.

### Recommended controlled tags (extend in repo)

- **AI / ML:** `ai`, `llm`, `inference`, `evaluation`
- **Practice:** `spec-driven-development`, `tdd`, `agile`, `methodology`
- **Interfaces:** `api`, `documentation`, `ux`
- **Risk / trust:** `security`, `compliance`
- **Commercial:** `growth`, `planning`, `cro`, `roi` (use as **tags**, not pillars — ROI/CRO are lenses, not shelves)

Aliases: one display label, one canonical slug (`Spec driven development` → `spec-driven-development`). See **`lib/taxonomy.ts`** for display helpers.

---

## Examples

- **Category:** Build — **Tags:** `ai`, `claude`, `spec-driven-development`  
  Meaning: builder-focused content about SDD with AI tooling.

- **Category:** Product — **Tags:** `growth`, `roi`, `branding`  
  Meaning: strategy/GTM shelf; commercial themes as tags.

- **Category:** Design — **Tags:** `ux`, `cro`  
  Meaning: UX-focused; conversion experimentation as a tag.

---

## How this maps to content types

| Content type | Category | Tags |
| ------------ | -------- | ---- |
| **Blog post** | One pillar in v2 | Recommended once filtering exists |
| **Video** | One pillar | Same tag namespace; static data may use `category` early |
| **Course** | Often **Product** or **Build** for the landing | Course-level tags; optional per-module tags later |
| **Glossary term** | **1–3** pillar badges + optional tags | Pedagogy: show where a term applies |

**Related links:** navigation between items is separate from tags — use `relatedArticleSlug` / `relatedVideoIds` when needed.

---

## UX implications (v2 — when implemented)

- **Primary filter:** category (four pillars).
- **Secondary refinement:** tags (chips, multi-select).
- **Search:** full text + tag matching.
- **Badges on cards:** one category + 1–2 tags when space allows.

---

## Spec dependencies

- Blog: [spec-blog.md](./spec-blog.md) — frontmatter `category` / `tags` when v2 ships.
- Videos: [spec-videos-v2-v3.md](./spec-videos-v2-v3.md) — align slugs with this document.
- Course: [spec-course.md](./spec-course.md) — library browse uses the same pillars.
- Glossary: [spec-glossary.md](./spec-glossary.md) — multi-badge pillars + optional tags.

---

## Open decisions (record answers as you decide)

1. Maximum tags per item (e.g. **5–8**) to avoid tag spam.
2. Locale: English slugs only for v1?

---

## Summary

Use **four pillars:** **Product · Build · Quality · Design**. Prefer **Build** over “Development” as the **category label**. Use **tags** for AI, API, methodology, growth, CRO, ROI, and other cross-cutting themes — not as top-level categories.
