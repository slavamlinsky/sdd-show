import { z } from "zod";
import { PILLARS, type Pillar } from "@/lib/taxonomy";

export const GLOSSARY_STATUSES = [
  "pending",
  "published",
  "rejected",
  "hidden",
] as const;

export type GlossaryTermStatus = (typeof GLOSSARY_STATUSES)[number];

export type SuggestTermInput = {
  title: string;
  shortDefinition: string;
  categories: string[];
};

export type SuggestTermResult = { ok: true } | { ok: false; error: string };

const TITLE_MIN = 2;
const TITLE_MAX = 80;
const DEF_MIN = 20;
const DEF_MAX = 500;

const titleMessage = `Title must be ${TITLE_MIN}–${TITLE_MAX} characters.`;
const definitionMessage = `Definition must be ${DEF_MIN}–${DEF_MAX} characters (1–3 short sentences).`;
const pillarsMessage = `Pick 1–3 pillars: ${PILLARS.join(", ")}.`;

export const suggestTermSchema = z.object({
  title: z
    .string()
    .trim()
    .min(TITLE_MIN, titleMessage)
    .max(TITLE_MAX, titleMessage),
  shortDefinition: z
    .string()
    .trim()
    .min(DEF_MIN, definitionMessage)
    .max(DEF_MAX, definitionMessage),
  categories: z
    .array(z.enum(PILLARS))
    .min(1, pillarsMessage)
    .max(3, pillarsMessage)
    .refine((items) => new Set(items).size === items.length, {
      message: pillarsMessage,
    }),
});

export type SuggestTermFields = z.infer<typeof suggestTermSchema>;

export function fieldErrorsFromSuggestTerm(
  error: z.ZodError,
): Partial<Record<"title" | "shortDefinition" | "categories", string>> {
  const out: Partial<
    Record<"title" | "shortDefinition" | "categories", string>
  > = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (
      (key === "title" || key === "shortDefinition" || key === "categories") &&
      !out[key]
    ) {
      out[key] = issue.message;
    }
  }
  return out;
}

export function slugifySuggestionTitle(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 56);
  const suffix = crypto.randomUUID().slice(0, 8);
  return `${base || "term"}-${suffix}`;
}

export function parseSuggestTermInput(raw: SuggestTermInput):
  | {
      ok: true;
      data: {
        title: string;
        shortDefinition: string;
        categories: Pillar[];
      };
    }
  | { ok: false; error: string } {
  const parsed = suggestTermSchema.safeParse({
    title: raw.title,
    shortDefinition: raw.shortDefinition,
    categories: raw.categories,
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Check the form and try again.",
    };
  }
  return { ok: true, data: parsed.data };
}
