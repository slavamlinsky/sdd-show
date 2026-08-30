# Feature spec — Tests (`/tests`)

**Status:** Pilot. Spec-first on `feature/testing-pilot`. Implementation follows this contract.

Complements [spec-main.md](./spec-main.md), [spec-glossary.md](./spec-glossary.md), [spec-course.md](./spec-course.md), [spec-ecosystem.md](./spec-ecosystem.md), [spec-data-auth.md](./spec-data-auth.md).

Copy and headings follow **sentence case** per [spec-design-layout.md — Naming & capitalization](./spec-design-layout.md#naming--capitalization). Formal names stay: **Spec-Driven Development (SDD)**, **Intent-Driven Engineering**. In this feature, **IDE** means Intent-Driven Engineering unless a question explicitly contrasts it with an integrated development environment.

This is **not** a certification product. Do not promise ISTQB, vendor badges, job placement, or “official” Anthropic / Microsoft credentials. Inner tests are **self-checks** aligned with our glossary and course. Outer cards are **links to other people’s materials**.

---

## Intent

Give visitors a way to **check understanding** of AI-first development, SDD, and Intent-Driven Engineering — the same vocabulary as `/glossary`, `/ecosystem`, `/course`, and the blog.

The hub is a **practice page**, not a second course landing:

- **Our tests** — in-app quizzes we author and score.
- **Outer tests** — cards that send people to well-known external AI / engineering assessments (Anthropic, Microsoft, and similar). We do not host or grade those.

**Primary:** complete an inner test and see a clear result (score, elapsed time, review).
**Secondary:** signed-in users can appear on a **leaderboard**. Guests can still take tests.

Course remains the conversion path ([spec-course.md](./spec-course.md)). Tests should **link to glossary terms and the course**, not replace them.

---

## Why ISTQB is the format, not the brand

[ISTQB](https://www.istqb.org/) exams are a familiar pattern: a **large question bank**, a **random subset** per sitting, **multiple choice** with one best answer. We copy that **mechanics**, not their syllabus or trademark.

| ISTQB-like rule | Our rule |
| --------------- | -------- |
| Large bank per syllabus | **50–100** items per inner test |
| Sitting is a sample | Show **40–50%** of the bank, drawn at random per attempt |
| Four options on screen | Always **four** visible choices: **one correct** + **three distractors** |
| Extra wrong answers exist | Bank stores **5–6 distractors** per item so options **rotate** across attempts |
| Timed exam | **No countdown** during the sitting. Record elapsed time; show it **only on the result screen** |

---

## Information architecture

```text
/tests                         Hub: inner catalog + outer cards + optional leaderboard teaser
/tests/[slug]                  Test intro (length, level, sample size) → start
/tests/[slug]/attempt          Active sitting (client state; not indexed)
/tests/[slug]/result           Score, elapsed time, review (this attempt)
/tests/leaderboard             Signed-in board (all inner tests or filter by slug)
```

**Header (when P1 ships):** insert **Tests** after Ecosystem.

**Primary nav:** **Glossary → Ecosystem → Tests → Videos → Course → Blog**

Rationale: Glossary (words) → Ecosystem (map) → Tests (check) → Videos / Course (go deeper). Do not add a “Learn” parent in this pilot.

**Footer:** add **Tests** next to Ecosystem / Course / Blog.

**Home:** no dedicated Tests band in P0/P1. Optional later one-line CTA (see [spec-home.md](./spec-home.md) follow-ups).

**Glossary stays separate.** Tests may link `/glossary#slug`. Do not paste full glossary essays into questions.

---

## Hub page (`/tests`)

Flush shell, same family as glossary / ecosystem: `full-bleed` hero atmosphere, inner `max-w-6xl`. Icon-led cards, airy bands ([spec-design-layout.md](./spec-design-layout.md)).

### 1. Hero

- **H1:** Check your **intent** (gradient on a short phrase, same restraint as other hubs). Working title: **Check how well you know SDD and intent**.
- **Lead:** Short self-checks on AI-first development, spec-driven work, and Intent-Driven Engineering. Not a certificate.
- **Secondary line:** Guests can take any inner test. Sign in to save a score on the leaderboard.

### 2. Our tests (inner catalog)

A list (card grid on `md+`) of **published** inner tests.

Each card:

| Field | Required | Notes |
| ----- | -------- | ----- |
| Title | yes | Sentence case; named methods stay |
| Level | yes | Badge: **Basic** \| **Advanced** \| **Pro** |
| Blurb | yes | One or two sentences |
| Bank size | yes | e.g. “60 questions in the bank” |
| Sitting size | yes | e.g. “~30 questions per attempt” (derived from sample %) |
| Estimated time | no | Soft hint only (“about 15–20 minutes”) — **not** a timer |
| CTA | yes | **Start** → `/tests/[slug]` |

**Pilot:** one card — **Basic welcome** (`welcome-basic`). Advanced and Pro cards may appear as **Coming soon** (disabled, no fake Start) so the page does not look empty of a roadmap.

### 3. Outer tests (external)

A distinct band below inner tests. Heading: **Tests and courses elsewhere**. Subhead: we do not run these; they are useful next steps.

Cards: name, one-line blurb, publisher, **external** link (`target="_blank"`, `rel="noopener noreferrer"`). Optional “exam / course / quiz” chip. No scrape, no iframe of vendor exams, no implied partnership.

**P0 seed catalog** (URLs may be updated if vendors move pages; keep official docs):

| Name | Publisher | Sense | Link (canonical at implement time) |
| ---- | --------- | ----- | ---------------------------------- |
| Anthropic courses | Anthropic | Official learning on Claude, prompting, and working with their models. | [anthropic.com/learn](https://www.anthropic.com/learn) |
| Azure AI Fundamentals (AI-900) | Microsoft | Vendor exam on cloud AI concepts, not SDD. Useful baseline for AI literacy. | [Microsoft Learn — AI-900](https://learn.microsoft.com/credentials/certifications/azure-ai-fundamentals/) |
| Google AI Essentials | Google | Short course on using generative AI at work. | [Grow with Google — AI Essentials](https://grow.google/ai-essentials/) |
| Hugging Face LLM course | Hugging Face | Hands-on NLP / LLM track with chapter quizzes. | [huggingface.co/learn/llm-course](https://huggingface.co/learn/llm-course) |
| OpenAI prompting guide | OpenAI | Practical prompting for their API — contrast with writing specs. | [Prompt engineering](https://platform.openai.com/docs/guides/prompt-engineering) |

Blurb copy must say these measure **vendor or general AI literacy**, not our glossary. Prefer **descriptive** cards over logos-as-endorsement.

### 4. Leaderboard teaser

On the hub: top **5–10** rows for the default test (`welcome-basic`) when P2 exists; otherwise a short empty state: **Sign in and finish a test to appear here**. Guests see the board **read-only**. Full list: `/tests/leaderboard`.

---

## Difficulty levels

| Level | Meaning | Audience |
| ----- | ------- | -------- |
| **Basic** | Definitions, contrasts, “what is true here” — glossary and course intro. | First visit, welcome test |
| **Advanced** | Trade-offs, workflow, “what would you write in the spec”. | After blog / course modules 1–3 |
| **Pro** | Ambiguous stems, multi-constraint scenarios, agent + quality evals. | Later; not in this pilot |

One **level per test**, not mixed inside a sitting. Future: an “advanced SDD” test, not mixed Basic+Pro items in one bank.

---

## Inner test data model (content)

Source of truth: TypeScript modules under `lib/tests/` (or `content/tests/`) — same pattern as glossary / ecosystem. Repo-public: this is a **learning** quiz, not a secure professional exam. Do not pretend answers are secret.

### Test (`InnerTest`)

| Field | Notes |
| ----- | ----- |
| `slug` | Stable URL id (`welcome-basic`) |
| `title` | Card and intro H1 |
| `level` | `basic` \| `advanced` \| `pro` |
| `blurb` | Hub card |
| `topic` | Short label, e.g. “AI-first development, SDD, Intent-Driven Engineering” |
| `bank` | Array of questions, **50–100** items when published |
| `sampleRatio` | **0.40–0.50** inclusive. Sitting size = `round(bank.length * sampleRatio)`, clamped so sitting is at least **20** and at most **50** |
| `passPercent` | Educational bar, default **70**. UI may say “solid grasp” not “certified” |
| `published` | If false, omit from hub or show Coming soon |

### Question (`InnerQuestion`)

| Field | Notes |
| ----- | ----- |
| `id` | Stable string (`wb-01`) — used in review and analytics |
| `stem` | Question text. Plain text (or light markdown later). One idea per item |
| `correct` | Exactly **one** correct option string |
| `distractors` | **5 or 6** wrong answers (aim for 6). Must be plausible, not joke-only |
| `explain` | 1–3 sentences after submit; may link `/glossary#slug` |
| `glossarySlug` | Optional; review “See also” |
| `tags` | Optional topic tags for authoring balance (not shown in MVP UI) |

**On screen:** shuffle `correct` + **3** distractors drawn at random from the 5–6. Never show two identical strings. Never omit the correct answer.

**Sampling a sitting:** shuffle the bank, take the first `sittingSize` **unique** `id`s. Same question must not appear twice in one attempt. Across attempts, overlap is expected and desired.

**Option order:** shuffle the four visible choices independently per question per attempt.

Persist in attempt state (memory, then DB in P2): `questionId[]` in order shown, `optionIds` or hashes of the four strings in display order, `chosenIndex` or chosen string, `startedAt`, `finishedAt`.

---

## Sitting UX (`/tests/[slug]` → attempt)

### Intro

- Title, level badge, topic, bank size, how many questions this sitting, pass percent as “aim for 70%”, estimated minutes as a **hint**.
- Explicit: **There is no timer on screen.** We only record how long you take.
- **Start test** begins the clock (`startedAt = now()`).

### During the test

- **One question per screen** (mobile-friendly; ISTQB-style focus).
- Progress: **Question 12 of 30** (or equivalent). No percentage countdown clock.
- Four radio options (shadcn). Keyboard: arrows + space / enter.
- **Back** / **Next**. Changing a previous answer is allowed until final submit.
- **Submit** enabled when every sitting question has an answer. If they try early: inline “Answer all questions first”.
- **Do not** show a live clock, red time pressure, or auto-submit on timeout.
- **Do not** reveal correct/incorrect until the result screen (no per-item instant grade in P1). Optional later: practice mode with instant feedback — out of scope for pilot.

Refresh / close: warn that the attempt is lost unless P2 persistence exists. P1 may keep sitting in `sessionStorage` for the same tab.

### Result

- Score: **correct / sitting size** and **percent**.
- Pass / not yet vs `passPercent` — wording: **Solid grasp** / **Worth another pass**, never “certified”.
- **Time spent:** human-readable duration (e.g. 12 min 40 sec). This is the only time UI.
- Review list: stem, their answer, correct answer, short `explain`, optional glossary link.
- CTAs: **Try again** (new random sample), **Back to tests**, **Course**, **Glossary**. Signed-out: **Sign in to join the leaderboard** (return URL = this result or hub).

---

## Leaderboard (authorized users)

**Who:** only **signed-in** attempts count. Guests keep local results only.

**What is ranked (per inner test):**

1. **Best percent** (highest).
2. Tie-break: **shortest elapsed** among that user’s attempts at that percent (or among all rows at that percent — pick one and stay consistent: **per user, best percent, then that attempt’s time**).
3. Further tie: **earliest** `finished_at`.

**Display columns:** rank, display name (Auth metadata / email local-part if no name), test title, percent, elapsed, date. No raw email.

**Privacy:** one public row per user per test (their **best** sitting). Users can **hide** from the board later (P3); not required for pilot.

**Cheating:** not a concern for a public learning quiz. Do not add lock-down browsers. Optional: ignore attempts under a minimum elapsed (e.g. 60s) so instant-click spam is less visible — document the floor in UI if used.

**Empty:** “Be the first to post a score — sign in and finish a test.”

---

## Pilot content — Basic welcome

**Slug:** `welcome-basic`  
**Title:** Basic welcome: AI-first, SDD, and intent  
**Level:** Basic  
**Bank:** **60** questions  
**Sample ratio:** **0.50** → **30** questions per sitting  
**Pass:** **70%** (21 / 30)  
**Topics:** AI-first development, Spec-Driven Development, Intent-Driven Engineering, core glossary.

Align stems with [lib/glossary-data.ts](../../lib/glossary-data.ts), [spec-course.md](./spec-course.md) (modules 1–4 sense), [what-is-spec-driven-development](../../content/blog/what-is-spec-driven-development.md), and [intent-driven-engineering](../../content/blog/intent-driven-engineering.md). Prefer **our** definitions when a word exists in the glossary.

### Topic mix (60 items)

| Tag | Count | What to test |
| --- | ----- | ------------ |
| `ai-first` | 12 | Ambiguity as bottleneck; vibe vs spec; prompting ≠ directing; code is cheap, clarity is scarce |
| `sdd` | 14 | Spec as source of truth; living document; tickets vs specs; specify → plan → task → implement; acceptance vs requirements |
| `ide` | 12 | IDE = Intent-Driven Engineering here; intent / guardrails / validation; human owns edges; agents in the middle |
| `glossary` | 16 | Terms from the live glossary (see list below) |
| `ecosystem-lite` | 6 | Awareness only: Spec Kit / OpenSpec / Kiro as tools; AGENTS.md; MCP — no vendor trivia |

**Glossary stems should cover (at least once):** spec-driven development, specification, acceptance criteria, requirements, living document, traceability, test-driven development (contrast with SDD), prompt engineering, context window, hallucination rate, ownership, outcome clarity, MVP, PRD, velocity, constraints and guards.

### Authoring rules

- One correct answer; distractors are **near misses** (TDD vs SDD, IDE vs IDE-the-editor, ticket title vs spec, prompt vs intent contract).
- No “all of the above” / “none of the above”.
- No trick negatives (“which is NOT”) in **Basic**; save for Advanced.
- Stem ≤ ~40 words. Options ≤ ~20 words each.
- `explain` points to glossary or a blog slug, not a new essay.

Worked examples (format contract — full bank is implementation data, same shape):

**`wb-sdd-01`**  
Stem: In this site’s vocabulary, what is spec-driven development primarily about?  
Correct: Written specs (scope, behavior, acceptance) drive delivery before or beside implementation.  
Distractors (6): Generating as much code as possible from a single prompt; Replacing product managers with a chatbot; Writing tests only after production is live; Using Jira status as the only source of truth; Freezing a 200-page PRD that never updates; Measuring success only by lines of code.  
Explain: SDD treats the specification as the contract teams and agents build against. See glossary: spec-driven development.

**`wb-ide-01`**  
Stem: In Intent-Driven Engineering on this site, what does IDE stand for?  
Correct: Intent-Driven Engineering.  
Distractors (6): Integrated development environment; Interactive data engine; Internal delivery estimate; Instruction-driven execution; Interface design exploration; Incremental deployment edition.  
Explain: Here IDE is the practice of owning outcomes and guardrails, not the editor acronym.

**`wb-ai-01`**  
Stem: When implementation is no longer the scarce step, what usually limits teams first?  
Correct: Ambiguity — unclear goals, edges, and “done”.  
Distractors (6): The number of programming languages on the team; GPU price alone; How many standups you schedule; Whether the logo uses a gradient; Git host choice; The length of variable names.  
Explain: Course and blog: clarity is scarce; specs shrink ambiguity before rework.

Full **60-item** bank ships in code with P1 (`lib/tests/welcome-basic.ts` or equivalent). This spec locks counts, tags, and rules; filling every stem is an implementation task, not a second spec.

---

## Data and auth (P2)

Follow [spec-data-auth.md](./spec-data-auth.md): Supabase Postgres + RLS. No new auth vendor.

Suggested tables (names can shift in the migration; intent stays):

### `test_attempts`

| Column | Notes |
| ------ | ----- |
| `id` | uuid PK |
| `user_id` | FK `auth.users`, **not null** for ranked rows |
| `test_slug` | text, e.g. `welcome-basic` |
| `question_ids` | text[] sitting order |
| `answers` | jsonb (chosen option per id) |
| `correct_count` | int |
| `total_count` | int |
| `percent` | numeric, 0–100 |
| `started_at` / `finished_at` | timestamptz |
| `elapsed_ms` | int, derived |
| `created_at` | timestamptz |

**RLS:** `authenticated` insert **own** rows; select own rows. Leaderboard **select**: either a `test_leaderboard` view of **best row per user per slug** with a policy that allows `select` of those columns to `anon` + `authenticated`, or a security-definer function. Do not expose emails.

Guests: P1 scoring is client-only. P2 does not write guest attempts unless we add an anonymous table later (out of scope).

App builds **without** Supabase env; leaderboard no-ops / empty state when unset.

---

## SEO and crawl

| Path | Index? | Notes |
| ---- | ------ | ----- |
| `/tests` | yes | `pageSeo.tests` in `lib/seo-page-meta.ts`; clusters `sddCore` + `course` or `intent` |
| `/tests/[slug]` | yes for published slugs | Intro only; no answer key in metadata |
| `/tests/[slug]/attempt` | **noindex** | Sitting UI |
| `/tests/[slug]/result` | **noindex** | Per-attempt |
| `/tests/leaderboard` | optional noindex | Thin / user-generated; prefer **noindex** in pilot |

Add `/tests` to `app/sitemap.ts` and `lib/llms-txt.ts` when the hub ships. OG: `/images/og-tests.png` (16:9, 1280×720) or fallback `siteConfig.defaultShareImage` until art exists.

Title shape (50–58 characters, ends with a period), description 140–155 — [spec-seo-meta.md](./spec-seo-meta.md).

Draft (adjust to length at implement time):

- Title: **Self-checks on SDD, specs, and software intent.**
- Description: **Take a short quiz on spec-driven development and intent-driven engineering. Random questions, no timer, optional leaderboard if you sign in.**

---

## Phased rollout

| Phase | Scope | Status |
| ----- | ----- | ------ |
| **P0** | This spec; hub copy and data contracts; welcome test rules and topic mix | **Current** |
| **P1** | Routes, nav/footer, hub UI, `welcome-basic` **full bank**, sitting + result, no DB | Next |
| **P2** | `test_attempts` + RLS, leaderboard, sign-in CTA on result | After P1 |
| **P3** | Advanced / Pro inner tests; hide-from-board; home teaser; instant-feedback practice mode | Later |

P0 acceptance is **documentation + agreed contracts**, not a live quiz.

---

## Relationship to other routes

| Route | Tests must |
| ----- | ---------- |
| `/glossary` | Link terms; do not duplicate the accordion catalog |
| `/course` | Result / intro may CTA to the course; no fake certificate |
| `/ecosystem` | Outer cards are **exams/courses elsewhere**; ecosystem remains tools / approaches / standards |
| `/blog` | Explanations can cite posts; questions stay short |
| `/videos` | Unchanged |
| `/sign-in` | Return to `/tests` or result after auth |

---

## Acceptance

### P0 (this spec)

- [spec-tests.md](./spec-tests.md) is linked from [README.md](./README.md).
- Inner vs outer, levels, sampling, four-of-N options, no in-test timer, leaderboard-for-auth, and welcome-test mix are specified enough to implement without a new product debate.

### P1

- `/tests` shows inner catalog (at least **Basic welcome**) and outer cards with working external links.
- Starting the welcome test yields **30** unique questions from a **60**-item bank; each screen has **4** options including the correct one.
- Completing shows score, **elapsed time**, and review. No countdown during the sitting.
- Header/footer include Tests; current section highlights on `/tests` and children.
- `npm run lint` and `npm run build` pass.
- Guests can finish a test without an account.

### P2

- Signed-in finish writes an attempt; hub/leaderboard show best scores without emails.
- Guests still play; they are not ranked.

---

## Non-goals (pilot)

- Paid exams, certificates, PDF diplomas, ISTQB branding.
- Hosting or scraping Anthropic / Microsoft assessments.
- Timer / auto-fail, webcam proctoring, question pooling secrecy.
- Multi-correct (“select all”) items.
- Admin CMS for questions (repo files are enough).
- Replacing course, glossary, or ecosystem.
- Home hero change.

---

## Open implementation notes

- Sitting size formula: `clamp(round(60 * 0.5), 20, 50)` = 30. If the bank grows to 80 with ratio 0.4 → 32.
- Prefer `crypto.getRandomValues` / well-seeded shuffle; do not use a fixed order.
- Reduced motion: no decorative timers or pulsing progress.
- Accessibility: fieldset + legend per question; focus move on Next.
