# Feature spec — Ecosystem (`/ecosystem`)

## Intent

Make the site a **reference / resource hub** around intent-driven and spec-driven work — not only a course landing.

**Ecosystem** is an **umbrella**: a map of the AI engineering discipline. It classifies **what you can use**, **how you work**, and **how pieces fit together**. It is **not** a second glossary.

**Glossary stays separate.** Glossary = short definition of a term. Ecosystem = where that idea sits among tools, approaches, and standards. A visitor who wants “what does SDD mean?” goes to `/glossary`. A visitor who wants “what belongs next to SDD?” stays on `/ecosystem`.

Follow [spec-design-layout.md](./spec-design-layout.md): **responsive** bands, **airy** spacing, **icon-led** cards, sentence case (named methods like Spec-Driven Development stay recognizable).

---

## Why “Approaches”, not “Methodologies”

A **Methodologies → Spec-Driven Development** child page would feel like “an SDD page inside an SDD site.” **Approaches** is broader: full methodologies **and** patterns/practices (vibe coding, context engineering, agentic engineering) belong in one map.

Do **not** add a fourth top-level category (e.g. “Patterns”) in this phase.

---

## Information architecture

Site IA (conceptual). Header does **not** add a “Learn” parent in this phase — **Course** stays a top-level nav item.

```text
Learn (conceptual; Course remains /course)
  └─ Course

Ecosystem
  ├─ Tools          → What can I use?
  ├─ Approaches     → How should I work?
  └─ Standards      → How does it fit together?

Glossary            → What does this word mean?

Blog                → Narrative / comparison posts
Videos              → Curated playback (existing)
```

**Primary nav (this phase):** **Glossary → Ecosystem → Videos → Course → Blog**  
(Insert Ecosystem; do not drop Videos. No nested dropdown in P0.)

**Footer:** include Ecosystem next to Course / Blog.

---

## Categories (start with three; fill what you have)

| Category | Question | Role | Fill now? |
| -------- | -------- | ---- | --------- |
| **Tools** | What can I use? | Products and kits that help write, store, or execute specs with agents | **Yes** — seed list |
| **Approaches** | How should I work? | Ways of working: SDD, IDE, TDD, BDD, vibe coding, agentic / context engineering | **Yes** — seed list |
| **Standards** | How does it fit together? | Conventions and protocols (AGENTS.md, MCP) | **Yes, thin** — two entries so the triad exists; grow later |

Do **not** invent empty categories. Prefer a short honest list over a taxonomy of stubs.

---

## Seed catalog (P0 copy)

Source of truth for landing copy: `lib/ecosystem-data.ts`. Blurbs are **one or two sentences**, not essays. Optional `glossarySlug` links to `/glossary#…` when a term exists. Optional `href` for official docs (external, `rel="noopener"`).

### Tools

| Name | Sense |
| ---- | ----- |
| GitHub Spec Kit | GitHub’s spec-first kit for AI coding workflows. |
| OpenSpec | Open spec format and change workflow for agent-driven work. |
| Kiro | Spec-oriented AI IDE (structured artifacts, not only chat). |
| Cursor | AI editor (agent / composer) used heavily with specs and context files. |
| Claude Code | Terminal coding agent; pairs well with repo conventions like AGENTS.md. |
| Codex | OpenAI coding agent — another runtime for the same spec-first habits. |

### Approaches

| Name | Sense |
| ---- | ----- |
| Spec-Driven Development | The specification — not the generated diff — is the source of truth. |
| Intent-Driven Engineering | Outcomes and success criteria (the what); agents reason about the how. |
| Test-Driven Development | Tests pin behavior before (or beside) implementation. |
| Behavior-Driven Development | Shared examples of behavior; close cousin of specs and acceptance. |
| Vibe coding | Informal prompting by feel — fast on toys, costly on complex systems. |
| Agentic engineering | Delivery through agents: orchestration, review, and guardrails. |
| Context engineering | Packing the right artifacts so models stay aligned. |

### Standards

| Name | Sense |
| ---- | ----- |
| AGENTS.md | In-repo conventions so coding agents know how this project wants to be worked. |
| MCP | Model Context Protocol — a shared way for tools and agents to connect to context. |

---

## Page structure

### P0 — Hub (`/ecosystem`) — **this ship**

1. **Hero**
   - **H1:** Explore the **ecosystem** (gradient on “ecosystem”).
   - **Lead:** Understand the tools, approaches, and standards shaping intent-driven engineering.
   - Short line that Glossary is for definitions; this page is the map.
2. **Three category cards** (equal weight)
   - Tools → What can I use? → `#tools`
   - Approaches → How should I work? → `#approaches`
   - Standards → How does it fit together? → `#standards`
3. **Three catalog sections** (`id` matching the cards)
   - Section heading + one-line reminder of the question.
   - Grid of item cards (name, one-liner, optional glossary / external link).
   - **No** per-item long-form pages in P0 (anchors on the hub are enough).

Layout: **flush shell** (same as glossary / course): `full-bleed` hero atmosphere, inner `max-w-6xl`. Cards: rounded, border + ring, Lucide icon per **category** (not necessarily per item).

### P1 — Optional follow-ups (not blocking P0)

- Home band: **Explore the ecosystem** + the three questions; CTAs to `/ecosystem#tools` etc. See [spec-home.md](./spec-home.md).
- Category routes `/ecosystem/tools`, `/ecosystem/approaches`, `/ecosystem/standards` if the hub list grows past ~12 items in a section.
- Individual item pages only when there is **original** comparison or how-to copy (otherwise Blog).

### P2 — Later

- Nested **Learn** parent in the header (Course under Learn).
- Suggest-a-tool / suggest-an-approach (auth + table) — only if glossary-suggest proves useful.
- Deep links from blog posts (“this article sits under Approaches → SDD”).

---

## Relationship to other routes

| Route | Ecosystem must |
| ----- | -------------- |
| `/glossary` | Cross-link terms; do not paste full glossary definitions on the hub. |
| `/course` | Course remains the **path**; ecosystem is the **map**. Hero/course copy may mention tools without duplicating the catalog. |
| `/blog` | Comparisons (e.g. Spec Kit vs OpenSpec) live on the blog, not as fake product pages. |
| `/videos` | Unchanged; optional later “related video” on an item page. |
| `/tests` | Tests may mention tools; **outer exam cards** stay on `/tests`, not this hub ([spec-tests.md](./spec-tests.md)). |

---

## Phased rollout

| Phase | Scope | Status |
| ----- | ----- | ------ |
| **P0** | Spec + `/ecosystem` hub + header/footer link + seed catalog | Current |
| **P1** | Home “Explore the ecosystem” band; category routes if lists grow | Later |
| **P2** | Item pages, Learn grouping, suggest flow | Later |

---

## Acceptance

- `/ecosystem` renders three categories with **filled** Tools and Approaches lists and a **thin** Standards list.
- Header highlights Ecosystem for `/ecosystem` and any future `/ecosystem/…`.
- Glossary remains a **separate** nav item.
- No “Methodologies” label on the page.
- `npm run build` passes.

## Non-goals (this phase)

- Dropdown mega-menu, search, filters, user-submitted tools.
- Replacing glossary, course, blog, or videos.
- Affiliate / marketplace listings.
- Claiming every tool is “official” or endorsed — copy stays descriptive.
