import type { SittingState } from "./types.ts";

const key = (slug: string) => `sdd-test-attempt:${slug}`;

const listeners = new Set<() => void>();
const memory = new Map<string, SittingState>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeSitting(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

let cache: { slug: string; raw: string | null; parsed: SittingState | null } | null =
  null;

function parseSitting(slug: string, raw: string | null): SittingState | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as SittingState;
    if (value.testSlug === slug && Array.isArray(value.questionIds)) return value;
  } catch {
    return null;
  }
  return null;
}

function readSitting(slug: string): SittingState | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(key(slug));
  } catch {
    raw = null;
  }
  if (cache && cache.slug === slug && cache.raw === raw) return cache.parsed;
  const parsed = parseSitting(slug, raw) ?? memory.get(slug) ?? null;
  cache = { slug, raw, parsed };
  return parsed;
}

export function getSittingSnapshot(slug: string): SittingState | null {
  return readSitting(slug);
}

export function getSittingServerSnapshot(): SittingState | null {
  return null;
}

export function loadSitting(slug: string): SittingState | null {
  return readSitting(slug);
}

export function saveSitting(sitting: SittingState): void {
  const raw = JSON.stringify(sitting);
  memory.set(sitting.testSlug, sitting);
  try {
    sessionStorage.setItem(key(sitting.testSlug), raw);
  } catch {
    // Private mode / blocked storage — same-tab memory still works.
  }
  cache = { slug: sitting.testSlug, raw, parsed: sitting };
  emit();
}

export function clearSitting(slug: string): void {
  memory.delete(slug);
  try {
    sessionStorage.removeItem(key(slug));
  } catch {
    // ignore
  }
  cache = null;
  emit();
}
