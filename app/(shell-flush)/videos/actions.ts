"use server";

import { after } from "next/server";
import { displayNameFromAuth } from "@/lib/auth-display";
import {
  parseSuggestVideoInput,
  type SuggestVideoResult,
} from "@/lib/videos-suggest";
import { fetchYoutubeOembed } from "@/lib/videos-oembed";
import {
  isVideoEmailNotifyConfigured,
  sendVideoSuggestionEmail,
} from "@/lib/videos-notify";
import {
  persistVideoUpdatesSubscription,
  type VideoSubscribeResult,
} from "@/lib/videos-subscribe";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import type { Pillar } from "@/lib/taxonomy";

type SuggestPayload = {
  youtubeUrl: string;
  whyItMatters: string;
  categories?: string[];
  website?: string;
};

const SUGGEST_ERROR = {
  notConfigured: {
    code: "videos_not_configured",
    message: "Suggestions aren’t available in this environment yet.",
  },
  missingTable: {
    code: "videos_missing_table",
    message:
      "Video suggestion storage is not set up yet. Apply pending migrations (see README), or add RESEND_API_KEY + GLOSSARY_NOTIFY_EMAIL (or VIDEO_NOTIFY_EMAIL) for email-only suggestions.",
  },
  noServiceRole: {
    code: "videos_no_service_role",
    message:
      "Could not save your suggestion. Add SUPABASE_SERVICE_ROLE_KEY to .env.local, or configure Resend email — see README.",
  },
  insertFailed: {
    code: "videos_insert_failed",
    message: "Could not save your suggestion. Try again in a moment.",
  },
} as const;

type InsertFailure = {
  ok: false;
  code:
    | typeof SUGGEST_ERROR.insertFailed.code
    | typeof SUGGEST_ERROR.missingTable.code
    | typeof SUGGEST_ERROR.noServiceRole.code;
  missingTable?: boolean;
};

function isMissingTableError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("video_suggestions") &&
    (lower.includes("does not exist") ||
      lower.includes("could not find the table") ||
      lower.includes("schema cache"))
  );
}

function insertFailureFromError(message: string): InsertFailure {
  if (isMissingTableError(message)) {
    return {
      ok: false,
      code: SUGGEST_ERROR.missingTable.code,
      missingTable: true,
    };
  }
  return { ok: false, code: SUGGEST_ERROR.insertFailed.code };
}

async function insertSuggestion(data: {
  youtubeUrl: string;
  youtubeId: string;
  whyItMatters: string;
  categories: Pillar[];
  userId: string | null;
  submitterName: string;
  submitterEmail: string | null;
}): Promise<{ ok: true } | InsertFailure> {
  const row = {
    youtube_url: data.youtubeUrl,
    youtube_id: data.youtubeId,
    why_it_matters: data.whyItMatters,
    categories: data.categories,
    status: "pending" as const,
    submitted_by: data.userId,
    submitter_name: data.submitterName,
    submitter_email: data.submitterEmail,
  };

  const service = createServiceClient();
  if (service) {
    const { error } = await service.from("video_suggestions").insert(row);
    if (!error) return { ok: true };
    console.error("[videos-suggest/service]", error.message);
    return insertFailureFromError(error.message);
  }

  if (!data.userId) {
    return { ok: false, code: SUGGEST_ERROR.noServiceRole.code };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("video_suggestions").insert({
    youtube_url: row.youtube_url,
    youtube_id: row.youtube_id,
    why_it_matters: row.why_it_matters,
    categories: row.categories,
    submitter_name: row.submitter_name,
    submitter_email: row.submitter_email,
  });

  if (!error) return { ok: true };
  console.error("[videos-suggest/user]", error.message);
  return insertFailureFromError(error.message);
}

function fail(
  spec: (typeof SUGGEST_ERROR)[keyof typeof SUGGEST_ERROR],
): SuggestVideoResult {
  return { ok: false, error: spec.message, code: spec.code };
}

export async function suggestVideo(
  raw: SuggestPayload,
): Promise<SuggestVideoResult> {
  if (raw.website?.trim()) {
    return { ok: true };
  }

  const parsed = parseSuggestVideoInput(raw);
  if (!parsed.ok) {
    return { ok: false, error: parsed.error, code: "videos_validation_failed" };
  }

  const user = await getAuthUser();
  const submitterEmail = user?.email ?? null;
  const submitterName = user?.email
    ? displayNameFromAuth(
        user.email,
        user.user_metadata as Record<string, unknown> | undefined,
      )
    : "Guest";

  const notifyPayload = {
    youtubeUrl: parsed.data.youtubeUrl,
    youtubeId: parsed.data.youtubeId,
    whyItMatters: parsed.data.whyItMatters,
    categories: parsed.data.categories,
    submitterName,
    submitterEmail,
  };

  if (!isSupabaseConfigured()) {
    if (isVideoEmailNotifyConfigured()) {
      const mailed = await sendVideoSuggestionEmail(notifyPayload);
      if (mailed.ok) return { ok: true };
    }
    return fail(SUGGEST_ERROR.notConfigured);
  }

  const saved = await insertSuggestion({
    ...notifyPayload,
    userId: user?.id ?? null,
  });

  if (saved.ok) {
    if (isVideoEmailNotifyConfigured()) {
      after(async () => {
        const mailed = await sendVideoSuggestionEmail(notifyPayload);
        if (!mailed.ok) {
          console.error("[videos-suggest/notify]", mailed.error);
        }
      });
    }
    return { ok: true };
  }

  if (saved.code === SUGGEST_ERROR.noServiceRole.code) {
    if (isVideoEmailNotifyConfigured()) {
      const mailed = await sendVideoSuggestionEmail(notifyPayload);
      if (mailed.ok) return { ok: true };
    }
    return fail(SUGGEST_ERROR.noServiceRole);
  }

  if (isVideoEmailNotifyConfigured()) {
    const mailed = await sendVideoSuggestionEmail(notifyPayload);
    if (mailed.ok) return { ok: true };
  }

  if (saved.missingTable) return fail(SUGGEST_ERROR.missingTable);
  return fail(SUGGEST_ERROR.insertFailed);
}

export async function setVideoUpdatesSubscription(
  subscribed: boolean,
): Promise<VideoSubscribeResult> {
  return persistVideoUpdatesSubscription(subscribed);
}

export type YoutubePreviewResult =
  | {
      ok: true;
      youtubeId: string;
      title: string;
      channelTitle: string;
      thumbnailUrl: string;
    }
  | { ok: false; error: string };

export async function lookupYoutubePreview(
  youtubeUrl: string,
): Promise<YoutubePreviewResult> {
  const result = await fetchYoutubeOembed(youtubeUrl);
  if (!result.ok) return result;
  return { ok: true, ...result.preview };
}
