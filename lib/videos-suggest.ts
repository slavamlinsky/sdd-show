import { z } from "zod";
import { PILLARS, type Pillar } from "@/lib/taxonomy";
import {
  canonicalYoutubeWatchUrl,
  parseYoutubeId,
} from "@/lib/videos-youtube";

export const SUGGEST_VIDEO_WHY_MIN = 20;
export const SUGGEST_VIDEO_WHY_MAX = 500;

const youtubeMessage =
  "Paste a YouTube link (watch, youtu.be, Shorts) or an 11-character video id.";
const whyMessage = `Tell us why it matters in ${SUGGEST_VIDEO_WHY_MIN}–${SUGGEST_VIDEO_WHY_MAX} characters.`;
const categoriesMessage = `Pick any of: ${PILLARS.join(", ")}.`;

export const suggestVideoSchema = z.object({
  youtubeUrl: z
    .string()
    .trim()
    .min(1, youtubeMessage)
    .refine((value) => parseYoutubeId(value) !== null, youtubeMessage),
  whyItMatters: z
    .string()
    .trim()
    .min(SUGGEST_VIDEO_WHY_MIN, whyMessage)
    .max(SUGGEST_VIDEO_WHY_MAX, whyMessage),
  categories: z
    .array(z.enum(PILLARS, { message: categoriesMessage }))
    .max(PILLARS.length, categoriesMessage)
    .refine((items) => new Set(items).size === items.length, {
      message: categoriesMessage,
    }),
});

export type SuggestVideoFields = z.infer<typeof suggestVideoSchema>;

/** Client form shape: topic chips + honeypot field. */
export const suggestVideoFormSchema = z.object({
  youtubeUrl: suggestVideoSchema.shape.youtubeUrl,
  whyItMatters: suggestVideoSchema.shape.whyItMatters,
  categories: suggestVideoSchema.shape.categories,
  website: z.string(),
});

export type SuggestVideoFormValues = z.infer<typeof suggestVideoFormSchema>;

export type SuggestVideoResult =
  | { ok: true }
  | { ok: false; error: string; code: string };

export function parseSuggestVideoInput(raw: {
  youtubeUrl: string;
  whyItMatters: string;
  categories?: string[] | null;
}):
  | {
      ok: true;
      data: {
        youtubeId: string;
        youtubeUrl: string;
        whyItMatters: string;
        categories: Pillar[];
      };
    }
  | { ok: false; error: string } {
  const parsed = suggestVideoSchema.safeParse({
    youtubeUrl: raw.youtubeUrl,
    whyItMatters: raw.whyItMatters,
    categories: raw.categories ?? [],
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Check the form and try again.",
    };
  }
  const youtubeId = parseYoutubeId(parsed.data.youtubeUrl);
  if (!youtubeId) {
    return { ok: false, error: youtubeMessage };
  }
  return {
    ok: true,
    data: {
      youtubeId,
      youtubeUrl: canonicalYoutubeWatchUrl(youtubeId),
      whyItMatters: parsed.data.whyItMatters,
      categories: parsed.data.categories,
    },
  };
}
