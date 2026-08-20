# Feature spec — Course (`/course`)

## Intent

Sell the course **Become an Intent-Driven Engineer** (Spec-Driven Development and Intent-Driven Engineering) and collect **leads**. The page is **substance + coming soon**: honest that enrollment is not open, specific about syllabus and audience.

Follow [spec-design-layout.md](./spec-design-layout.md): **responsive** sections, **airy** spacing, **clear bands**, **CTA** hierarchy, **icon-led** cards. Hero must read as a **first screen** (copy + visual), not a long stacked article.

Audience positioning aligns with [spec-main.md](./spec-main.md) (**Course audience**).

**Library taxonomy (v2):** when browse-by-topic ships, the course uses a **category** (often **Build** or **Product**) and optional **tags** per [spec-taxonomy.md](./spec-taxonomy.md). Not required for this landing.

---

## Course identity

| Field | Copy (source of truth for `/course`) |
| ----- | ------------------------------------ |
| **Headline** | Become an Intent-Driven Engineer |
| **Tagline** | Stop prompting. Start directing. |
| **Pitch** | Turn your intent into specs AI agents can execute. Build faster, coordinate more complex systems, and keep the output reliable — whether you are a one-person engineering team or leading one. |
| **Objective** | Move beyond vibe coding and master structured workflows for complex, reliable software with AI agents. |
| **Shift** | From prompting to directing intent: specs as the contract agents execute. |

---

## Audience (course)

**Primary (four roles on `/course`):**

1. **Solo founders** — the whole company; specs keep one human fast with agents.
2. **Full-stack & lead developers** — the one-person army; spec as force multiplier.
3. **Technical leads** — shared source of truth for a team using agents.
4. **Product managers** — intent contracts; “done” that agents can check.

Architects and senior ICs map onto those seats. **Not the lead story:** intro-to-coding or prompt tricks.

**Not a fit if:** you only want faster autocomplete with no written contract.

---

## Phased rollout (content & UX)

| Phase    | Scope                                                                                                    | Status                                  |
| -------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **P0**   | Hero, syllabus, lead form, trust links                                                                   | Done.                                   |
| **P1**   | Audience + FAQ on `/course` | Done. |
| **P1.1** | Intent-Driven Engineer hero + syllabus | Current. |
| **P2**   | Home: optional compact “who it’s for” (see [spec-home](./spec-home.md))                                  | Optional / later.                       |

**P2 Home** stays shorter than `/course`.

---

## Page structure

1. **Hero (first screen)**
   - **H1:** Become an **Intent-Driven Engineer**. **Tagline:** Stop prompting. Start directing.
   - One-paragraph pitch (intent → specs agents can execute; one-person team or leading one).
   - **Audience chips** with icons — **four roles** (solo founders, full-stack leads, technical leads, PMs). Not a tall list.
   - **Primary CTA:** scroll to `#lead`. **Secondary:** jump to `#syllabus` or free resources.
   - **Visual:** premium **lifecycle panel** (Specify → Plan → Task → Implement). No “swap this artwork” placeholder caption. Optional later: real brand stills in `public/images/`.
   - Layout: **stack on mobile**; **two columns** from `lg` (copy + panel), aligned like home hero (`pt-6` / `pb-12`, `lg:items-center`).

2. **Who this course is for**
   - Four icon cards matching the chips. Include solo / one-person-army energy in those four — do not add extra roles.
3. **Promise row**
   - Three short outcomes: orchestration vs babysitting; structure vs vibe; clarity as the scarce resource.
4. **Syllabus (`#syllabus`)**
   - Six modules as **cards** with number, icon, lede, and 2 bullets. Titles stay **sentence case** except formal SDD / IDE names.
5. **Outro / challenge**
   - Summary: infinite code, scarce clarity. **Monday morning challenge:** write one spec before the next code prompt.
6. **Course FAQ**
   - Accordion (same pattern as Home). Cover level, vibe vs spec, SDD vs TDD vs IDE, pricing honesty, notify list. Do **not** duplicate glossary definitions.
7. **Lead form (`#lead`)**
   - Email required; name optional. Success state. Persist to Postgres when [spec-data-auth.md](./spec-data-auth.md) **P3** (`course_leads`). Until then, in-page success; do **not** log raw emails in app logs when that path is tightened.
8. **Trust**
   - Links to `/blog` and `/videos`.

---

## Syllabus (locked for landing copy)

Source copy lives in `lib/course-data.ts`. Sense of each module (not a transcript):

| Module                           | Sense                                                                                                                                                                                         |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. The great evolution**       | Five eras: requirement-driven PRDs → TDD → Scrum fragments → prompt / vibe coding → spec and intent as source of truth. Code is no longer the bottleneck; **ambiguity** is.                   |
| **2. The complexity trough**     | U-shaped productivity: beginners feel huge speed; professionals stall on complex systems. Vibe vs spec. Cost of a missing requirement sentence.                                               |
| **3. Deep dive: SDD**            | Spec is the primary artifact. Lifecycle: **specify → plan → task → implement**. Operationalize with **GitHub Spec Kit**, **OpenSpec**, or **Kiro**. Case: secure login or payments. |
| **4. Intent-Driven Engineering** | Outcomes and success criteria, not step-by-step. Alignment across long sessions and tools. **Intent contracts**: you own what; agents reason how.                                             |
| **5. Strategic implementation**  | Decision framework: money/security → SDD; year of maintenance → SDD; prototypes may vibe. Tool pick: OpenSpec on existing systems, Spec Kit for multi-agent greenfield, Kiro when the team lives in that IDE. |
| **6. The future team**           | Strategic Architect (engineering intent). Intent Architect (PM precision) — including when that is the same person. SDD as leverage for a one-person army, and alignment once the team grows. |
| **Outro**                        | Clarity is scarce. Cleaner, safer, less surprising software. Challenge: one spec before the next prompt.                                                                                      |

Intro framing on the page (hero + who-for) covers: transition from implementation to orchestration; audience; stop babysitting, start directing.

---

## Acceptance

- **First screen:** at `lg`, hero copy + lifecycle panel sit side by side; audience is **chips**, not a tall list. No empty stretched image with placeholder caption.
- Page is a **landing**: distinct bands, icon chips/cards, generous space ([spec-design-layout](./spec-design-layout.md)).
- Syllabus matches the six modules + challenge above.
- FAQ scannable on mobile; no nested accordions.
- Form validates email; success state is clear.
- No dead syllabus links (headings only is fine).

## Non-goals

- Checkout, pricing table, gated modules, live cohort logistics, user accounts for the course itself.
