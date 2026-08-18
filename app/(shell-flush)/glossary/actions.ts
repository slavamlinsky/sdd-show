"use server";

import { displayNameFromAuth } from "@/lib/auth-display";
import {
  parseSuggestTermInput,
  slugifySuggestionTitle,
  type SuggestTermResult,
} from "@/lib/glossary-suggest";
import {
  isGlossaryEmailNotifyConfigured,
  sendGlossarySuggestionEmail,
} from "@/lib/glossary-notify";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import type { Pillar } from "@/lib/taxonomy";

type Payload = {
  title: string;
  shortDefinition: string;
  categories: string[];
  website?: string;
};

function isMissingTableError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("glossary_terms") &&
    (lower.includes("does not exist") ||
      lower.includes("could not find the table") ||
      lower.includes("schema cache"))
  );
}

async function insertSuggestion(
  userId: string,
  data: {
    title: string;
    shortDefinition: string;
    categories: Pillar[];
    submitterName: string;
    submitterEmail: string;
  }
): Promise<{ ok: true } | { ok: false; error: string; missingTable?: boolean }> {
  const row = {
    slug: slugifySuggestionTitle(data.title),
    title: data.title,
    short_definition: data.shortDefinition,
    categories: data.categories,
    tags: [] as string[],
    status: "pending" as const,
    source: "suggestion" as const,
    submitted_by: userId,
    submitter_name: data.submitterName,
    submitter_email: data.submitterEmail,
  };

  const service = createServiceClient();
  if (service) {
    const { error } = await service.from("glossary_terms").insert(row);
    if (!error) return { ok: true };
    console.error("[glossary-suggest/service]", error.message);
    if (isMissingTableError(error.message)) {
      return { ok: false, error: error.message, missingTable: true };
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.from("glossary_terms").insert({
    slug: row.slug,
    title: row.title,
    short_definition: row.short_definition,
    categories: row.categories,
    tags: row.tags,
    submitter_name: row.submitter_name,
    submitter_email: row.submitter_email,
  });

  if (!error) return { ok: true };

  console.error("[glossary-suggest/user]", error.message);
  return {
    ok: false,
    error: error.message,
    missingTable: isMissingTableError(error.message),
  };
}

export async function suggestGlossaryTerm(raw: Payload): Promise<SuggestTermResult> {
  if (raw.website?.trim()) {
    return { ok: true };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "Suggestions aren’t available in this environment yet.",
    };
  }

  const user = await getAuthUser();
  if (!user?.email) {
    return { ok: false, error: "Please sign in to suggest a term." };
  }

  const parsed = parseSuggestTermInput(raw);
  if (!parsed.ok) return parsed;

  const submitterName = displayNameFromAuth(
    user.email,
    user.user_metadata as Record<string, unknown> | undefined
  );
  const notifyPayload = {
    title: parsed.data.title,
    shortDefinition: parsed.data.shortDefinition,
    categories: parsed.data.categories,
    submitterName,
    submitterEmail: user.email,
  };

  const saved = await insertSuggestion(user.id, notifyPayload);

  if (saved.ok) {
    if (isGlossaryEmailNotifyConfigured()) {
      void sendGlossarySuggestionEmail(notifyPayload);
    }
    return { ok: true };
  }

  if (isGlossaryEmailNotifyConfigured()) {
    const mailed = await sendGlossarySuggestionEmail(notifyPayload);
    if (mailed.ok) {
      return { ok: true };
    }
  }

  if (saved.missingTable) {
    return {
      ok: false,
      error:
        "Glossary storage is not set up yet. Run supabase/migrations/20260818_glossary_terms.sql in the Supabase SQL Editor, or add RESEND_API_KEY + GLOSSARY_NOTIFY_EMAIL for email-only suggestions.",
    };
  }

  if (!createServiceClient()) {
    return {
      ok: false,
      error:
        "Could not save your suggestion. Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Supabase → Settings → API), or configure Resend email — see README.",
    };
  }

  return {
    ok: false,
    error: "Could not save your suggestion. Try again in a moment.",
  };
}
