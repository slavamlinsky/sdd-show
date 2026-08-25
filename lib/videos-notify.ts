import type { Pillar } from "@/lib/taxonomy";

type NotifyPayload = {
  youtubeUrl: string;
  youtubeId: string;
  whyItMatters: string;
  categories: Pillar[];
  submitterName: string;
  submitterEmail: string | null;
};

function notifyEmail(): string | null {
  return (
    process.env.VIDEO_NOTIFY_EMAIL?.trim() ||
    process.env.GLOSSARY_NOTIFY_EMAIL?.trim() ||
    null
  );
}

export function isVideoEmailNotifyConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && notifyEmail());
}

/** Inbox notification via Resend until an admin UI exists. */
export async function sendVideoSuggestionEmail(
  payload: NotifyPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = notifyEmail();
  if (!apiKey || !to) {
    return { ok: false, error: "Email notifications are not configured." };
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "SDD Show <onboarding@resend.dev>";

  const body = [
    "New video suggestion",
    "",
    `URL: ${payload.youtubeUrl}`,
    `YouTube id: ${payload.youtubeId}`,
    `Topics: ${payload.categories.length ? payload.categories.join(", ") : "(none)"}`,
    payload.submitterEmail
      ? `From: ${payload.submitterName} <${payload.submitterEmail}>`
      : `From: ${payload.submitterName} (guest)`,
    "",
    "Why it matters:",
    payload.whyItMatters,
    "",
    "—",
    "Saved to Supabase when the video_suggestions table is configured.",
    "Review in Table Editor → video_suggestions (status = pending) or your inbox.",
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Video suggestion: ${payload.youtubeId}`,
        text: body,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[videos-notify]", res.status, detail);
      return { ok: false, error: "Could not send notification email." };
    }

    return { ok: true };
  } catch (err) {
    console.error("[videos-notify]", err);
    return { ok: false, error: "Could not send notification email." };
  }
}
