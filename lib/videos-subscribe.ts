import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient, getAuthUser } from "@/lib/supabase/server";

export const SUBSCRIBE_ERROR = {
  notConfigured: {
    code: "videos_subscribe_not_configured",
    message: "Subscriptions aren’t available in this environment yet.",
  },
  authRequired: {
    code: "videos_subscribe_auth_required",
    message: "Please sign in to subscribe to video updates.",
  },
  missingTable: {
    code: "videos_subscribe_missing_table",
    message:
      "Subscription storage is not set up yet. Apply pending migrations (see README).",
  },
  failed: {
    code: "videos_subscribe_failed",
    message: "Could not update your subscription. Try again in a moment.",
  },
} as const;

export type VideoSubscribeResult =
  | { ok: true; subscribed: boolean }
  | { ok: false; error: string; code: string };

function isMissingTableError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("video_update_subscriptions") &&
    (lower.includes("does not exist") ||
      lower.includes("could not find the table") ||
      lower.includes("schema cache"))
  );
}

export async function getVideoUpdatesSubscription(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const user = await getAuthUser();
  if (!user) return false;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("video_update_subscriptions")
    .select("subscribed")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    if (!isMissingTableError(error.message)) {
      console.error("[videos-subscribe/read]", error.message);
    }
    return false;
  }
  return Boolean(data?.subscribed);
}

export async function persistVideoUpdatesSubscription(
  subscribed: boolean,
): Promise<VideoSubscribeResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: SUBSCRIBE_ERROR.notConfigured.message,
      code: SUBSCRIBE_ERROR.notConfigured.code,
    };
  }

  const user = await getAuthUser();
  if (!user) {
    return {
      ok: false,
      error: SUBSCRIBE_ERROR.authRequired.message,
      code: SUBSCRIBE_ERROR.authRequired.code,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("video_update_subscriptions").upsert(
    {
      user_id: user.id,
      subscribed,
    },
    { onConflict: "user_id" },
  );

  if (!error) return { ok: true, subscribed };

  console.error("[videos-subscribe/write]", error.message);
  if (isMissingTableError(error.message)) {
    return {
      ok: false,
      error: SUBSCRIBE_ERROR.missingTable.message,
      code: SUBSCRIBE_ERROR.missingTable.code,
    };
  }
  return {
    ok: false,
    error: SUBSCRIBE_ERROR.failed.message,
    code: SUBSCRIBE_ERROR.failed.code,
  };
}
