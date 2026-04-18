# Content taxonomy — categories & tags (site-wide)

## Version / scope

- **Target:** **v2** — category/tag **filters**, listing **badges**, and browse-by-topic UX are **out of scope for MVP**.
- **MVP:** content may ship **without** `category` / `tags` in frontmatter or static data. Optional early **data-only** fields (same slugs as below) are allowed if useful for copy audits; no UI requirement until v2.

This doc is the **shared vocabulary and rules** so that when v2 ships, **blog articles**, **videos**, and **course** positioning use **one** model (Markdown frontmatter, Supabase columns, etc., as chosen per route).

---

## Recommendation: **one primary category + many tags**

| Mechanism | Role | Cardinality |
| --------- | ---- | ------------- |
| **Category** | **Where it lives in the reader’s head** — broad pillar for browse and primary navigation (filters, landing sections). | **Exactly one** per item (pick the best fit). |
| **Tags** | **What it is *about*** — tools, methods, themes, channels; cross-cutting and combinable. | **Zero or more** per item. |

### Why not subcategories (for now)?

- **Subcategories** (e.g. Development → Frontend → React) help when a pillar is huge and **hierarchy is always required** for reporting or IA.
- They add **mental overhead** (“Is SDD Development or Product?”) and duplicate what tags already express.
- **Tags + a single category** usually cover: *Development* + tags `claude`, `spec-driven-development` without nesting.

**When to introduce subcategories later:** only if a category becomes crowded (dozens of items per week) and UX research shows users need a second level **before** opening a list. Until then, prefer **more tags** or a **controlled tag group** (see below).

### Tags vs free keywords

- **Controlled tags** (recommended for consistency): slug list in repo or DB — e.g. `claude`, `spec-driven-development`, `ai`, `branding`, `strategy`.
- **Aliases:** one display label, one canonical slug (`Spec driven development` → `spec-driven-development`).
- Optional **tag groups** in UI only (not a second DB tree): “Tool”, “Practice”, “Theme” — same flat tag list, grouped by convention in docs.

---

## Categories (initial set — editable)

High-level buckets. Keep the list **small** (roughly **5–10**) so filters stay scannable.

| Category | Typical use |
| -------- | ----------- |
| **Development** | Building software, specs, code, tools, platforms, engineering workflow. |
| **Marketing** | Positioning, campaigns, brand, growth, content marketing, GTM. |
| **Product** | Discovery, roadmaps, prioritization, PM practice (when not pure marketing). |
| **AI** | Could be a **top-level category** if AI becomes a major vertical; **or** handle mostly via tags (`ai`, `claude`, `llm`) under Development/Marketing until volume justifies a pillar. |

**Rule of thumb:** If unsure between **Product** and **Development**, ask: “Is the reader mostly a **builder**?” → Development. “Mostly **commercial / GTM**?” → Marketing or Product.

---

## Tags (examples)

Tags are **orthogonal** to category: the same tag can appear on Development and Marketing items.

- **Tools / platforms:** `claude`, `cursor`, `github`, …
- **Practices / methodologies:** `spec-driven-development`, `tdd`, `agile`, …
- **Themes:** `ai`, `branding`, `strategy`, `mvp`, …

One piece of content can carry many tags, e.g.:

- **Category:** Development  
- **Tags:** `claude`, `spec-driven-development`, `ai`  
Meaning: “sits on the Development shelf, and is specifically about Claude + SDD, with an AI angle.”

- **Category:** Marketing  
- **Tags:** `ai`, `branding`, `strategy`  
Meaning: “Marketing shelf; topics are AI + branding + strategy.”

---

## How this maps to content types

| Content type | Category | Tags |
| ------------ | -------- | ---- |
| **Blog post** | Required in taxonomy phase (optional in MVP). | Recommended once filtering exists. |
| **Video** | Same set as blog (aligned filters on `/videos` and `/blog`). | Same tag namespace. |
| **Course** (whole product) | Often **one** category for the course landing (e.g. Development). | Course-level tags; optional **per-module** tags in detailed spec when modules ship. |

**Related links:** a video can **link** to a blog article (and vice versa) via `relatedArticleSlug` / `relatedVideoIds` in addition to shared tags — links are **navigation**, tags are **discovery**.

---

## UX implications (v2 — when implemented)

- **Primary filter:** category (tabs or sidebar).
- **Secondary refinement:** tags (chips, multi-select).
- **Search:** full text over title/body **plus** tag matching.
- **Badges on cards:** show **category** + **1–2 tags** if space (or tags only in meta line).

---

## Spec dependencies

- Blog: extend [spec-blog.md](./spec-blog.md) when implementing **v2** `category` / `tags` (frontmatter + UI).
- Videos: [spec-videos-v2-v3.md](./spec-videos-v2-v3.md) — category + tags for persisted/filterable videos; **slugs align with this document**.
- Course: [spec-course.md](./spec-course.md) — audience copy is MVP; library **category/tags** for browse align here in **v2**.

---

## Open decisions (record answers as you decide)

1. Is **AI** a **top-level category** or only **tags** under Development/Marketing?  
2. Maximum tags per item (e.g. **5–8**) to avoid tag spam.  
3. Locale: English slugs only for v1?

---

## Summary

Use **one clear category** per article, video, or course slice for “shelf” navigation. Use **tags** for Claude, SDD, AI, branding, strategy — mix freely without subcategories until the catalog forces a second hierarchy.
