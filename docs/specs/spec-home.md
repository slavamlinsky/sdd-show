# Feature spec — Home (`/`)

## Intent

Orient visitors around **modern product engineering in the AI era**: how small teams build the right product faster. **Intent-driven engineering** is the central method (intent sits above the spec); SDD, agents, MVPs, and hypotheses live inside that question. Funnel toward **Course** after the idea is clear, while surfacing **Glossary**, **Ecosystem**, **Blog**, and **Videos**.

**Hierarchy:** IntentPowered (brand) → product loop (how we learn after shipping) → Intent-Driven Engineering (how we start) → Course / Glossary / Blog / Videos (content).

Follow [spec-design-layout.md](./spec-design-layout.md) for **responsive bands**, **spacing**, **CTA styling**, **images** (placeholders OK), and **[naming & capitalization](./spec-design-layout.md#naming--capitalization)**.

Do **not** call this “IntentPowered Methodology”. Prefer **The IntentPowered Loop** or **How intent-driven engineering works**.

## Sections (current)

1. **Hero** — _why / where we start_

- Headline: **Build software from intent, not tickets or instructions.** Keep it. This is the change of starting point, not the product cycle.
- Supporting line: start with the outcome; turn intent into specs; build and ship fast; validate with real users. This should set up the loop without retelling it.
- **Visual:** existing featured video (or similar) on desktop; stack on mobile. The **framework diagram does not live in the hero**.
- **CTAs:** **Explore the framework** → `#intentpowered-loop`. **View course** → `/course`.

2. **The IntentPowered Loop** (`#intentpowered-loop`) — _how the product cycle runs after we start_

- Pair with the hero: hero = don’t start from tickets; loop = don’t stop at shipping.
- Layout from `lg`: **diagram** (~45%) + copy (**55%**). Heading: **Ship early. Learn fast.** / **Focus on what matters.** Body `text-base`. Section uses the site theme (not a forced dark band).
- Lead: **intent-powered product development** as a continuous loop; smallest useful version; learning can reshape the next hypothesis and sometimes the **intent itself**.
- Five stages (not eight): **Intent → Build → Ship → Learn → Refine ↻**. Outcome, spec, AI, quality, and measure live _inside_ these stages, not as extra nodes.
  - Intent: what we are trying to achieve (outcome, hypothesis, success metrics).
  - Build: spec, plan, AI execution, quality.
  - Ship: MVP / smallest useful version.
  - Learn: feedback, analytics, measurement.
  - Refine: iteration, new hypothesis, adjusted intent.
- **Diagram:** a **circle**, not ∞. Thin violet→cyan gradient stroke, five icon nodes, empty centre (AI is an accelerator inside Build, not the hub). Active node glow + traveling highlight stay in sync with a **copy slider** on the right (~5s per stage). `prefers-reduced-motion`: static list, no motion.
- Do not fold the framework into the site **logo**.

3. **Four core principles**

- Outcome clarity / Success metrics / Constraints & guards / Delegation & trust — after the whole loop, so principles explain the framework.

4. **Evolution timeline**

- Requirements → TDD → Prompt → SDD → Intent. Why IDE showed up.

5. **Fundamentals**

- Product → Design → Build → Quality.

6. **Course CTA**

- **Learn Intent-Driven Engineering** + short pitch + **View course**. Idea first, then the course.

7. **Blog preview** — carousel of newest posts; **All articles** → `/blog`.
8. **Video library strip** — curated videos; **All videos** → `/videos`.
9. **Q&A (single FAQ on home)** — 3–5 items. Course-specific FAQ stays on `/course`.

Optional later: compact “who it’s for” chips; ecosystem strip per [spec-ecosystem.md](./spec-ecosystem.md).

## Acceptance

- Order is hero → loop → principles → evolution → fundamentals → course → content → videos → FAQ.
- Loop is reachable from the hero without scrolling guesswork (`#intentpowered-loop`, offset for the fixed header).
- Hero + loop + FAQ + carousels stay readable without client-only copy for core text.
- CTAs: framework explore in hero; primary course conversion in hero **and** the course band.
- **Motion:** bands follow [spec-design-layout.md](./spec-design-layout.md); `prefers-reduced-motion` respected. Loop: traveling arc highlight + active node; static fallback.
- **Responsive:** 55/45 stacks on small screens (copy readable; diagram scales, no horizontal page scroll).

## Non-goals

- Replacing the header logo with the full loop.
- Blog authoring on this page; posts live under `/blog`.
