import type { GlossaryTerm } from "@/lib/glossary-data";
import { isPillar, PILLARS, type Pillar } from "@/lib/taxonomy";

export const PILLAR_SLUG: Record<Pillar, string> = {
  Product: "product",
  Design: "design",
  Build: "build",
  Quality: "quality",
};

const SLUG_TO_PILLAR: Record<string, Pillar> = {
  product: "Product",
  design: "Design",
  build: "Build",
  quality: "Quality",
};

export const PILLAR_HASH_KEYS = Object.keys(SLUG_TO_PILLAR);

export function allPillarsOn(): Set<Pillar> {
  return new Set(PILLARS);
}

/** Parse `?pillars=design,build`. Null = treat as all ON. */
export function parsePillarsQuery(value: string | null | undefined): Set<Pillar> | null {
  if (!value?.trim()) return null;
  const found: Pillar[] = [];
  for (const token of value.split(",")) {
    const key = token.trim().toLowerCase();
    const pillar = SLUG_TO_PILLAR[key];
    if (pillar && isPillar(pillar) && !found.includes(pillar)) found.push(pillar);
  }
  return found.length > 0 ? new Set(found) : null;
}

export function parsePillarHash(hash: string): Pillar | null {
  const key = hash.replace(/^#/, "").trim().toLowerCase();
  return SLUG_TO_PILLAR[key] ?? null;
}

export function serializePillarsQuery(on: Set<Pillar>): string | null {
  if (on.size === PILLARS.length) return null;
  return PILLARS.filter((p) => on.has(p)).map((p) => PILLAR_SLUG[p]).join(",");
}

export function filterGlossaryTerms(
  terms: GlossaryTerm[],
  query: string,
  pillarsOn: Set<Pillar>
): GlossaryTerm[] {
  const q = query.trim().toLowerCase();
  return terms.filter((term) => {
    if (!term.categories.some((c) => pillarsOn.has(c))) return false;
    if (!q) return true;
    return (
      term.title.toLowerCase().includes(q) ||
      term.shortDefinition.toLowerCase().includes(q)
    );
  });
}
