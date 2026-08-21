/** Keyword clusters for metadata and content planning. Full strategy: `docs/specs/spec-seo-meta.md`. */

export const keywordClusters = {
  /** Core SDD queries and named practice. */
  sddCore: [
    "spec-driven development",
    "spec driven development",
    "SDD",
    "what is spec driven development",
    "software specifications",
    "living specification",
    "acceptance criteria",
  ],
  /** Intent layer on top of SDD. */
  intent: [
    "intent-driven engineering",
    "intent driven engineering",
    "intent-driven engineer",
    "software intent",
    "outcome-driven development",
    "intent contracts",
  ],
  /** How work is tracked vs specified. */
  ticketsAndSpecs: [
    "tickets vs specs",
    "specs vs user stories",
    "Jira tickets vs specifications",
    "engineering alignment",
  ],
  /** Workflow and team practice. */
  practice: [
    "spec driven development workflow",
    "SDD for small teams",
    "spec-driven development process",
    "delivery alignment",
    "engineering practices",
  ],
  /** Tools and kits. */
  tools: [
    "spec-driven development tools",
    "spec driven development frameworks",
    "SDD frameworks",
    "GitHub Spec Kit",
    "OpenSpec",
    "Kiro spec driven development",
  ],
  /** AI / agents in the loop. */
  agents: [
    "AI agents software development",
    "directing AI agents",
    "prompt engineering vs specs",
    "AI-assisted development",
    "AI-driven development",
    "spec for AI coding",
  ],
  /** Course / learning. */
  course: [
    "spec driven development course",
    "SDD course",
    "become an intent-driven engineer",
    "intent-driven engineering course",
  ],
  /** Ecosystem / standards. */
  ecosystem: [
    "spec driven development ecosystem",
    "MCP spec driven development",
    "A2A agent protocol",
    "software engineering standards",
  ],
} as const;

export type KeywordClusterId = keyof typeof keywordClusters;

/** Default `<meta name="keywords">` core set (not a ranking lever; keep short). */
export const baseKeywords = [
  "spec driven development",
  "SDD",
  "intent-driven engineering",
  "software specifications",
  "acceptance criteria",
] as const;

export function uniqueKeywords(
  ...lists: readonly (readonly string[])[]
): string[] {
  return [...new Set(lists.flatMap((list) => [...list]))];
}

export function keywordsFromClusters(
  ...ids: KeywordClusterId[]
): string[] {
  return uniqueKeywords(...ids.map((id) => keywordClusters[id]));
}

/** Clusters plus optional extra phrases for one route. */
export function keywordsForPage(
  clusters: readonly KeywordClusterId[],
  ...extra: string[]
): string[] {
  return uniqueKeywords(keywordsFromClusters(...clusters), extra);
}
