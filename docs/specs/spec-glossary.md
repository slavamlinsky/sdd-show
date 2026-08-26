# Feature spec — Glossary (`/glossary`)

**Revisions:** **MVP** behavior is the baseline shipped scope. **v2** sections below extend the page; they do not change MVP acceptance unless explicitly adopted.

## Intent

Cover **SDD** plus vocabulary across the four pillars — **Product**, **Design**, **Build**, **Quality**. Definitions stay short; the blog, videos, and course carry depth.

## Term card / entry fields

Each term should have:

| Field             | Required | Notes                                                                                                                                                                                                  |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `slug`            | yes      | Stable id for anchors; URL optional if single-page list                                                                                                                                                |
| `title`           | yes      | Term name — **sentence case** for multi-word terms unless the term is a proper noun or acronym; see [spec-design-layout.md — Naming & capitalization](./spec-design-layout.md#naming--capitalization). |
| `shortDefinition` | yes      | 1–3 sentences; **plain text only** (no Markdown); rendered at `text-sm` on the glossary page                                                                                                           |
| `categories`      | yes      | **1–3** labels from **Product \| Design \| Build \| Quality** — shadcn/ui `Badge` (outline, `xs`) on the glossary page. Optional `tags` in data may return later; not shown in MVP UI.                 |

## Page behavior (MVP)

- Single page listing all terms as **collapsible cards** in a **two-column grid** on `md+` (one column on small viewports). Each card shows the **term title** and **chevron**; expanding that card reveals **pillar badges** and the **short definition**. Cards toggle **independently** (several may be open at once). Cards use a light **border**, **rounded corners**, and subtle **shadow** consistent with the FAQ-style reference.
- **Layout:** See [spec-design-layout.md](./spec-design-layout.md).
- **Client search + pillar filter** sit in a row **under the hero copy** (see **v2**). **“Suggest something new”** — button in the hero row links to `#suggest-term`. The band at the bottom is a **live suggestion form** that writes a **pending** row in Postgres.

## v2 — Search + pillar filter (client-side)

Filter row **under the intro**, above the card grid: **search** (left) + **four pillar chips** (right). No extra submit buttons.

### Search

- Single text field with a search icon; **debounced** (~250ms) as the user types; filters **title** and **short definition** (case-insensitive).
- Client-side only; optional clear control on the field.
- Search is **not** required in the share URL (pillars query/hash remain the shareable filter).

### Pillar chips — multi-check

Narrow the list using **four always-visible chips** — **Product**, **Design**, **Build**, **Quality** — not a dropdown (four options stay scannable). Visual language matches suggestion chips (icon + color).

- **Four controls** in a single row (equal width on the chip group).
- **Default on load:** all **four are ON**.
- **User action:** turn **OFF** one or more pillars to narrow. Intersection rule: a term is **shown** if its `categories` **intersects** the ON set.
- **All four OFF:** turning off the last ON pillar **re-enables all four**.
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

### Non-goals (this filter row)

- Server-side faceting or DB-backed search APIs for this page.

## v2 — Suggest a term

Public **signed-in** form on `/glossary#suggest-term`. Guests see **Please sign in to add a term** + Sign in (return to `/glossary`). Submissions go to **Supabase Postgres** (`public.glossary_terms`) as **pending**. They are **not** shown in the accordion until an admin sets `status = published` (admin UI is a later slice).

### Form fields

| Field                  | Required     | Notes                                                                             |
| ---------------------- | ------------ | --------------------------------------------------------------------------------- |
| Term name (`title`)    | yes          | 2–80 characters; sentence case in copy guidance                                   |
| Short definition       | yes          | 20–500 characters; **plain text**; 1–3 sentences; counter on the label row        |
| Pillars (`categories`) | yes          | **1–3** of Product, Design, Build, Quality — equal-width colored chips with icons |
| Tags                   | no (v2 form) | Column exists (`tags text[]`) for **admin** later                                 |

Author is taken from the session: `submitted_by` = `auth.users.id` (trigger), plus `submitter_name` / `submitter_email` from Auth metadata. **No anonymous inserts** (RLS insert = `authenticated` only). Honeypot field on the form.

### Statuses (moderation)

| Status      | Meaning                                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| `pending`   | New suggestion; not public                                                                                |
| `published` | Visible on `/glossary` **once the listing reads from DB** (today listing is still `lib/glossary-data.ts`) |
| `rejected`  | Declined suggestion                                                                                       |
| `hidden`    | Was published; taken down without deleting                                                                |

`source`: `suggestion` \| `seed` \| `admin`. Public inserts are forced to `suggestion` + `pending`.

### Later (not this slice)

- **Seed** hardcoded `glossaryTerms` into the same table as `source = seed`, `status = published`.
- **Admin glossary manage:** edit title, definition, pillars, tags, visibility (`published` / `hidden`), review note; credit `submitted_by` / name.
- Listing `/glossary` from DB (`status = published` only).

SQL: [`supabase/migrations/20260818000000_glossary_terms.sql`](../../supabase/migrations/20260818000000_glossary_terms.sql).

## Content seed

- Include **SDD** and foundational SDD terms (requirements vs acceptance criteria, traceability, artifacts, etc.).
- Balance the **four pillars** in the library: **Product** (strategy, GTM, PM), **Design** (UX, flows), **Build** (specs, code, AI tooling), **Quality** (testing, eval, safety). Cross-cutting **tags** may be reintroduced in data/UI later per [spec-taxonomy.md](./spec-taxonomy.md).
- Total count grows with the blog/course; aim for breadth across pillars, not duplicate jargon.

## Acceptance

- **MVP:** All terms render from shared content source (same pattern as **spec-main** content storage). Each term exposes **pillar** `Badge`s (outline, `xs`); no tag row; no “see also” link row on cards.
- **v2 suggest:** signed-in users only; `/glossary#suggest-term` form persists a **pending** `glossary_terms` row (pillars 1–3, author from session); guests get a sign-in CTA; honeypot; no auto-publish.
- **v2 filter row:** client search (debounced, title + definition) + four **multi-check** pillar chips; default **all ON**; last-off restores all; `?pillars=` and `#product` / `#design` / `#build` / `#quality` with **query over hash**; empty state when nothing matches.

## Non-goals

- Version history of definitions, community **direct** edits (suggestions are queued, not live edits), i18n.
