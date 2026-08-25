"use server";

import { after } from "next/server";
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

const SUGGEST_ERROR = {
  notConfigured: {
    code: "glossary_not_configured",
    message: "Suggestions aren’t available in this environment yet.",
  },
  authRequired: {
    code: "glossary_auth_required",
    message: "Please sign in to suggest a term.",
  },
  missingTable: {
    code: "glossary_missing_table",
    message:
      "Glossary storage is not set up yet. Apply pending migrations (see README), or add RESEND_API_KEY + GLOSSARY_NOTIFY_EMAIL for email-only suggestions.",
  },
  noServiceRole: {
    code: "glossary_no_service_role",
    message:
      "Could not save your suggestion. Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Supabase → Settings → API), or configure Resend email — see README.",
  },
  insertFailed: {
    code: "glossary_insert_failed",
    message: "Could not save your suggestion. Try again in a moment.",
  },
} as const;

type InsertFailure = {
  ok: false;
  code: typeof SUGGEST_ERROR.insertFailed.code | typeof SUGGEST_ERROR.missingTable.code;
  missingTable?: boolean;
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

function insertFailureFromError(message: string): InsertFailure {
  if (isMissingTableError(message)) {
    return { ok: false, code: SUGGEST_ERROR.missingTable.code, missingTable: true };
  }
  return { ok: false, code: SUGGEST_ERROR.insertFailed.code };
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
): Promise<{ ok: true } | InsertFailure> {
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
    return insertFailureFromError(error.message);
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
  return insertFailureFromError(error.message);
}

function fail(
  spec: (typeof SUGGEST_ERROR)[keyof typeof SUGGEST_ERROR]
): SuggestTermResult {
  return { ok: false, error: spec.message, code: spec.code };
}

export async function suggestGlossaryTerm(raw: Payload): Promise<SuggestTermResult> {
  if (raw.website?.trim()) {
    return { ok: true };
  }

  if (!isSupabaseConfigured()) {
    return fail(SUGGEST_ERROR.notConfigured);
  }

  const user = await getAuthUser();
  if (!user?.email) {
    return fail(SUGGEST_ERROR.authRequired);
  }

  const parsed = parseSuggestTermInput(raw);
  if (!parsed.ok) {
    return { ok: false, error: parsed.error, code: "glossary_validation_failed" };
  }

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
      after(async () => {
        const mailed = await sendGlossarySuggestionEmail(notifyPayload);
        if (!mailed.ok) {
          console.error("[glossary-suggest/notify]", mailed.error);
        }
      });
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
    return fail(SUGGEST_ERROR.missingTable);
  }

  if (!createServiceClient()) {
    return fail(SUGGEST_ERROR.noServiceRole);
  }

  return fail(SUGGEST_ERROR.insertFailed);
}
