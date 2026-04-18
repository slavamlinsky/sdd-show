/** Shared SEO keywords; combine with page-specific terms in route metadata. */
export const baseKeywords = [
  "spec driven development",
  "SDD",
  "software specifications",
  "acceptance criteria",
  "software development",
  "engineering practices",
  "requirements",
  "technical writing",
] as const;

export function keywordsForPage(...extra: string[]): string[] {
  return [...baseKeywords, ...extra];
}
