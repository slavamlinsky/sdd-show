/**
 * Site-wide category pillars (browse / filters in v2) + shared tag vocabulary.
 * @see docs/specs/spec-taxonomy.md
 */

export const PILLARS = ["Product", "Build", "Quality", "Design"] as const;
export type Pillar = (typeof PILLARS)[number];

export function isPillar(value: string): value is Pillar {
  return (PILLARS as readonly string[]).includes(value);
}

/** Controlled tag slugs → short display labels (glossary, later blog/video). */
export const TAG_LABELS: Record<string, string> = {
  ai: "AI",
  llm: "LLM",
  api: "API",
  documentation: "Documentation",
  security: "Security",
  methodology: "Methodology",
  planning: "Planning",
  growth: "Growth",
  process: "Process",
  evaluation: "Evaluation",
  inference: "Inference",
  cro: "CRO",
  roi: "ROI",
  ux: "UX",
};

export function formatTag(slug: string): string {
  return TAG_LABELS[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
