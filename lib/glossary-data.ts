export type GlossaryTerm = {
  slug: string;
  title: string;
  shortDefinition: string;
  /** Where the concept applies — 2–3 short labels shown as outline badges */
  categories: string[];
};

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "spec-driven-development",
    title: "Spec driven development (SDD)",
    shortDefinition:
      "A way of building software where written specifications (scope, behavior, acceptance) come first and guide implementation, tests, and delivery — instead of coding from vague ticket titles alone.",
    categories: ["Development", "Process", "Planning"],
  },
  {
    slug: "specification",
    title: "Specification",
    shortDefinition:
      "A precise description of what the system should do: inputs, outputs, constraints, and edge cases. Good specs are readable by both humans and contributors who turn them into code.",
    categories: ["Development", "Documentation"],
  },
  {
    slug: "acceptance-criteria",
    title: "Acceptance criteria",
    shortDefinition:
      "Testable conditions that define “done.” They turn ambiguous requirements into checklists you can verify manually or automate.",
    categories: ["QA & testing", "Development", "Delivery"],
  },
  {
    slug: "living-document",
    title: "Living document",
    shortDefinition:
      "Specs that update as you learn — not frozen bureaucracy. The goal is truth over time, with a clear trail of what changed.",
    categories: ["Documentation", "Process"],
  },
  {
    slug: "traceability",
    title: "Traceability",
    shortDefinition:
      "Linking goals → specs → code → tests so you can answer why something exists and what would break if it changed.",
    categories: ["QA & testing", "Delivery", "Product"],
  },
  {
    slug: "requirements",
    title: "Requirements",
    shortDefinition:
      "Problems, outcomes, and constraints from stakeholders. They feed specs; specs add precision and technical detail.",
    categories: ["Product", "Planning"],
  },
  {
    slug: "implementation",
    title: "Implementation",
    shortDefinition:
      "Code and systems that satisfy the spec. When the spec and reality drift, you either update the code or revise the spec — ideally explicitly.",
    categories: ["Development", "Delivery"],
  },
  {
    slug: "mvp",
    title: "Minimum viable product (MVP)",
    shortDefinition:
      "The smallest version that validates your hypothesis. SDD helps decide what belongs in the MVP slice without silent scope creep.",
    categories: ["Product", "Planning"],
  },
  {
    slug: "rfc",
    title: "RFC (request for comments)",
    shortDefinition:
      "A written proposal for a notable change: context, decision, alternatives, and consequences — common in open source and larger orgs.",
    categories: ["Process", "Documentation"],
  },
  {
    slug: "prd",
    title: "PRD (product requirements document)",
    shortDefinition:
      "A product-level document describing goals, users, scope, and metrics. Often pairs with more granular technical specs.",
    categories: ["Product", "Planning"],
  },
  {
    slug: "use-case",
    title: "Use case",
    shortDefinition:
      "A narrative of an actor achieving a goal with the system. Useful for flows; pair with precise acceptance criteria for edge cases.",
    categories: ["Product", "Planning"],
  },
  {
    slug: "contract",
    title: "Contract (API / module)",
    shortDefinition:
      "Agreed inputs, outputs, and error behavior at a boundary. Contracts are a compact form of spec for integrations.",
    categories: ["Development", "APIs & integrations"],
  },
];

const bySlug = new Map(glossaryTerms.map((t) => [t.slug, t]));

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return bySlug.get(slug);
}
