import type { Pillar } from "./taxonomy";

export type GlossaryTerm = {
  slug: string;
  title: string;
  shortDefinition: string;
  /** 1–3 pillars from Product | Build | Quality | Design */
  categories: Pillar[];
  /** Optional cross-cutting tags (see spec-taxonomy + lib/taxonomy.ts) */
  tags?: string[];
};

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "acceptance-criteria",
    title: "Acceptance criteria",
    shortDefinition:
      "Specific, verifiable conditions that define “done.” They turn high-level requirements into checklists you can validate manually, in tests, or with automation — unlike requirements, which state broader needs.",
    categories: ["Quality", "Build"],
    tags: ["methodology"],
  },
  {
    slug: "artifact",
    title: "Artifact",
    shortDefinition:
      "A tangible output of your process: specs, diagrams, tickets, test reports, repositories, or release notes. SDD treats artifacts as evidence of what was agreed and what shipped.",
    categories: ["Build", "Product"],
    tags: ["documentation", "process"],
  },
  {
    slug: "context-window",
    title: "Context window",
    shortDefinition:
      "The maximum number of tokens a language model can attend to in one pass. It limits how much spec, code, chat history, and tooling context you can load together in AI-assisted workflows.",
    categories: ["Build"],
    tags: ["ai", "llm"],
  },
  {
    slug: "contract",
    title: "Contract (API / module)",
    shortDefinition:
      "Agreed inputs, outputs, and error behavior at a boundary. Contracts are a compact form of spec for integrations.",
    categories: ["Build"],
    tags: ["api"],
  },
  {
    slug: "evaluation-dataset",
    title: "Evaluation dataset",
    shortDefinition:
      "A labeled set of inputs and expected outputs (or rubrics) used to measure model or system behavior against acceptance-style expectations — central to testing AI features before ship.",
    categories: ["Quality"],
    tags: ["ai", "evaluation"],
  },
  {
    slug: "hallucination-rate",
    title: "Hallucination rate",
    shortDefinition:
      "How often a model produces false, fabricated, or unsupported content on a defined task or benchmark. Teams track it as a quality signal alongside traditional defect rates.",
    categories: ["Quality"],
    tags: ["ai"],
  },
  {
    slug: "implementation",
    title: "Implementation",
    shortDefinition:
      "Code and systems that satisfy the spec. When the spec and reality drift, you either update the code or revise the spec — ideally explicitly.",
    categories: ["Build"],
  },
  {
    slug: "living-document",
    title: "Living document",
    shortDefinition:
      "Specs that update as you learn — not frozen bureaucracy. The goal is truth over time, with a clear trail of what changed.",
    categories: ["Build", "Design"],
    tags: ["documentation", "process"],
  },
  {
    slug: "model-inference",
    title: "Model inference",
    shortDefinition:
      "Running a trained model to generate outputs from inputs in production or evaluation. Latency, cost, and reliability constraints shape how AI features are specced and tested.",
    categories: ["Build"],
    tags: ["ai"],
  },
  {
    slug: "mvp",
    title: "Minimum viable product (MVP)",
    shortDefinition:
      "The smallest version that validates your hypothesis. SDD helps decide what belongs in the MVP slice without silent scope creep.",
    categories: ["Product"],
    tags: ["planning", "growth"],
  },
  {
    slug: "prd",
    title: "PRD (product requirements document)",
    shortDefinition:
      "A product-level document describing goals, users, scope, and metrics. Often pairs with more granular technical specs.",
    categories: ["Product"],
    tags: ["planning", "documentation"],
  },
  {
    slug: "product-market-fit",
    title: "Product–market fit",
    shortDefinition:
      "Evidence that a product satisfies strong demand in a real market. It informs roadmap bets, messaging, and how aggressively you narrow scope in specs.",
    categories: ["Product"],
    tags: ["growth"],
  },
  {
    slug: "prompt-engineering",
    title: "Prompt engineering",
    shortDefinition:
      "Designing and refining natural-language instructions and examples so models produce reliable, on-spec outputs — a core practice when specs and AI tooling meet.",
    categories: ["Build"],
    tags: ["ai"],
  },
  {
    slug: "red-teaming",
    title: "Red teaming",
    shortDefinition:
      "Structured adversarial testing: a group tries to misuse, break, or trick a system to surface safety and quality gaps before users do.",
    categories: ["Quality"],
    tags: ["security"],
  },
  {
    slug: "requirements",
    title: "Requirements",
    shortDefinition:
      "Stakeholder needs, outcomes, and constraints — the *what* and *why*. They stay broader than **acceptance criteria**, which spell out specific, testable conditions for delivery.",
    categories: ["Product"],
    tags: ["planning"],
  },
  {
    slug: "rfc",
    title: "RFC (request for comments)",
    shortDefinition:
      "A written proposal for a notable change: context, decision, alternatives, and consequences — common in open source and larger orgs.",
    categories: ["Build"],
    tags: ["process", "documentation"],
  },
  {
    slug: "spec-driven-development",
    title: "Spec driven development (SDD)",
    shortDefinition:
      "A methodology where written specifications (scope, behavior, acceptance) come *before* implementation so teams and AI agents stay aligned — reducing rework from vague tickets or drifting intent.",
    categories: ["Build", "Product"],
    tags: ["methodology", "ai"],
  },
  {
    slug: "specification",
    title: "Specification",
    shortDefinition:
      "A precise description of what the system should do: inputs, outputs, constraints, and edge cases. Good specs are readable by both humans and contributors who turn them into code.",
    categories: ["Build"],
    tags: ["documentation"],
  },
  {
    slug: "test-driven-development",
    title: "Test-driven development (TDD)",
    shortDefinition:
      "Writing automated tests before production code to drive design and catch regressions. It complements **acceptance criteria** (outcomes) with fast feedback at the unit or service level.",
    categories: ["Build", "Quality"],
    tags: ["methodology"],
  },
  {
    slug: "traceability",
    title: "Traceability",
    shortDefinition:
      "Mapping requirements through specs to development tasks, code, and test cases — linking the *what* to the *how* so audits, refactors, and AI changes stay explainable.",
    categories: ["Quality", "Product", "Build"],
  },
  {
    slug: "use-case",
    title: "Use case",
    shortDefinition:
      "A narrative of an actor achieving a goal with the system. Useful for flows; pair with precise acceptance criteria for edge cases.",
    categories: ["Product", "Design"],
  },
  {
    slug: "use-case-validation",
    title: "Use-case validation",
    shortDefinition:
      "Checking that real user scenarios and outcomes match what was promised in messaging and specs — closing the loop between marketing story and shipped behavior.",
    categories: ["Product", "Quality", "Design"],
    tags: ["growth"],
  },
  {
    slug: "value-proposition",
    title: "Value proposition",
    shortDefinition:
      "A concise statement of who the product helps and what outcome they get. It keeps GTM language aligned with what engineering commits to in specs and roadmaps.",
    categories: ["Product", "Design"],
    tags: ["growth"],
  },
];

const bySlug = new Map(glossaryTerms.map((t) => [t.slug, t]));

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return bySlug.get(slug);
}
