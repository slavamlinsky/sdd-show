# Feature spec — Glossary (`/glossary`)

**Revisions:** **MVP** behavior is the baseline shipped scope. **v2** sections below extend the page; they do not change MVP acceptance unless explicitly adopted.

## Intent

Cover **SDD** plus vocabulary across the four pillars — **Product**, **Design**, **Build**, **Quality**. Definitions stay short; the blog, videos, and course carry depth.

## Term card / entry fields

Each term should have:

| Field | Required | Notes |
| ----- | -------- | ----- |
| `slug` | yes | Stable id for anchors; URL optional if single-page list |
| `title` | yes | Term name — **sentence case** for multi-word terms unless the term is a proper noun or acronym; see [spec-design-layout.md — Naming & capitalization](./spec-design-layout.md#naming--capitalization). |
| `shortDefinition` | yes | 1–3 sentences; **plain text only** (no Markdown); rendered at `text-sm` on the glossary page |
| `categories` | yes | **1–3** labels from **Product \| Design \| Build \| Quality** — shadcn/ui `Badge` (outline, `xs`) on the glossary page. Optional `tags` in data may return later; not shown in MVP UI. |

## Page behavior (MVP)

- Single page listing all terms as **collapsible cards** in a **two-column grid** on `md+` (one column on small viewports). Each card shows the **term title** and **chevron**; expanding that card reveals **pillar badges** and the **short definition**. Cards toggle **independently** (several may be open at once). Cards use a light **border**, **rounded corners**, and subtle **shadow** consistent with the FAQ-style reference.
- **Layout:** See [spec-design-layout.md](./spec-design-layout.md).
- **“Suggest something new”** — button in the hero row links to anchor `#suggest-term`; copy explains that **submission / moderation is v2** (stub band at bottom until then).
- **No full-text search** in MVP (see **spec-main** — search may land in a later v2 wave). **Pillar-only filtering** is specified under **v2** below, not MVP.

## v2 — Pillar filter (client-side)

Narrow the visible term list using **four independent toggles** — **Product**, **Design**, **Build**, **Quality** — matching `categories` / on-card badges.

### Behavior — multi-check

- **Four controls** (badge-style chips or checkable toggles), one per pillar, in a single row or wrapped row **above** the card grid.
- **Default on load:** all **four are ON** (checked / active). That means **no pillar is excluded** — every term is eligible; equivalently the “included” set is all pillars.
- **User action:** turn **OFF** one or more pillars to narrow the list. Any combination of **1–3** pillars ON is valid (only those pillars count toward visibility). **All four ON** again restores the full list.
- **Visibility rule:** A term is **shown** if its `categories` **intersects** the set of pillars that are currently **ON** (checked). Stated as OR over the active pillars: the term must tag **at least one** pillar that is still checked.
- **All four OFF:** must not happen in normal UX — **guard** it (e.g. turning off the last active pillar **re-enables** all four, or the last toggle is disabled until another is on). Alternatively a single **“Show all”** control resets to all four ON.
- **Client-side only:** filter the in-memory list; **no** extra server request for filtering.
- **Accordion state:** Filtering does not need to reset which cards are expanded; hiding a card removes it from the grid (implementation may collapse filtered-out items for simplicity).

### URL fragment — prefiltered open (`#key`)

- Support landing (and sharing) with a **hash** that selects pillars, e.g. `/glossary#design`, `/glossary#product`, `/glossary#build`, `/glossary#quality`.
- **Hash keys** (lowercase, stable): `product`, `design`, `build`, `quality` — must not collide with existing anchors such as `#suggest-term`.
- **On load and on `hashchange`:** when the fragment is one of those four, set filter state to **only that pillar ON** (the other three **OFF**) — **unless** `pillars` query param already set state (see **Query string** above). When the fragment is **absent** or **unknown**, keep query-derived state if any; otherwise use the default (**all four ON**).
- **Optional:** after applying hash state, **scroll** the filter row into view (or focus it) so the user sees why the list is narrowed — keep subtle and respect reduced motion.
- **Future / home page:** marketing blocks on `/` (and elsewhere) may link to `/glossary#design` (etc.) so visitors arrive on a **prefiltered** glossary; same hash rules apply. No change to this spec when those links are added — they only consume the fragment contract above.

### Query string — shareable filter (`?pillars=`)

- Support **search params** so links are stable in clients that strip or mishandle hashes, and for cleaner share URLs from docs or email.
- **Param name:** `pillars` (one key; value is a **comma-separated** list of lowercase pillar slugs: `product`, `design`, `build`, `quality`).
- **Examples:** `/glossary?pillars=design` (only Design ON); `/glossary?pillars=product,build` (those two ON, others OFF); omit param or empty value → default **all four ON**.
- **Parsing:** split on `,`, trim, case-insensitive match to the four slugs; **drop** unknown tokens. If nothing valid remains after parse, treat as **all four ON**.
- **Semantics:** the listed pillars are exactly the set **ON**; any pillar **not** listed is **OFF** (same visibility rule as manual multi-check). A **single** slug in the list means only that pillar ON, matching the `#design`-style prefilter.
- **Precedence:** on initial load, if `pillars` is present and parses to at least one valid slug, **query wins** over `#product` / `#design` / etc. If `pillars` is absent or empty, fall back to **hash** rules, then default all ON.
- **Optional (recommended):** when the user changes toggles in the UI, `history.replaceState` (or router equivalent) updates `pillars` so the address bar reflects the current ON set (no full reload). Hash may be **cleared** or left unchanged per implementation, but **query is the canonical** shareable form when both exist.
- **Future links:** home and other pages may use `/glossary?pillars=design` as well as `/glossary#design`; both express prefilter intent per the rules above.

### UI

- Place the four pillar toggles **above** the card grid, aligned with `page-shell` / `max-w-6xl` rhythm.
- **Active** = checked / included (visual: filled, ring, or strong label); **inactive** = excluded from the match set.
- Optional **“Show all pillars”** (or reset) sets all four ON in one click.

### Motion (optional but recommended)

- When the visible set changes, use a **subtle** transition — e.g. **opacity**, short **layout** animation, light **stagger** on cards.
- Prefer **[Framer Motion](https://www.framer.com/motion/)** or **CSS transitions**, per [spec-design-layout.md](./spec-design-layout.md). When `prefers-reduced-motion: reduce`, skip motion and **show/hide instantly**.

### Non-goals (pillar filter)

- Full-text **search** (separate **spec-main** v2 item).
- Server-side faceting or DB-backed filter APIs for this page.

## v2 — Suggest a term (planned)

- **Suggest a term:** form or GitHub issue link, optional moderation queue, spam protection — align with [spec-taxonomy.md](./spec-taxonomy.md).

## Content seed

- Include **SDD** and foundational SDD terms (requirements vs acceptance criteria, traceability, artifacts, etc.).
- Balance the **four pillars** in the library: **Product** (strategy, GTM, PM), **Design** (UX, flows), **Build** (specs, code, AI tooling), **Quality** (testing, eval, safety). Cross-cutting **tags** may be reintroduced in data/UI later per [spec-taxonomy.md](./spec-taxonomy.md).
- Total count grows with the blog/course; aim for breadth across pillars, not duplicate jargon.

## Acceptance

- **MVP:** All terms render from shared content source (same pattern as **spec-main** content storage). Each term exposes **pillar** `Badge`s (outline, `xs`); no tag row; no “see also” link row on cards.
- **v2 (when pillar filter ships):** Four **multi-check** pillar toggles; default **all ON**; visibility = intersection of term `categories` with **ON** pillars; **no all-OFF** state without recovery; `?pillars=` (comma list) and `#product` / `#design` / `#build` / `#quality` prefilter with **query over hash** when both apply; `hashchange` updates filter when query did not set state; **reduced motion** honored; empty state when no terms match current ON set.

## Non-goals

- Version history of definitions, community edits, i18n.