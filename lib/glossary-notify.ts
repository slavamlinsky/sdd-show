import type { Pillar } from "@/lib/taxonomy";

type NotifyPayload = {
  title: string;
  shortDefinition: string;
  categories: Pillar[];
  submitterName: string;
  submitterEmail: string;
};

function notifyEmail(): string | null {
  return process.env.GLOSSARY_NOTIFY_EMAIL?.trim() || null;
}

export function isGlossaryEmailNotifyConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && notifyEmail());
}

/** Send you an inbox notification via Resend (optional until admin UI exists). */
export async function sendGlossarySuggestionEmail(
  payload: NotifyPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = notifyEmail();
  if (!apiKey || !to) {
    return { ok: false, error: "Email notifications are not configured." };
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "SDD Show <onboarding@resend.dev>";

  const body = [
    "New glossary term suggestion",
    "",
    `Term: ${payload.title}`,
    `Pillars: ${payload.categories.join(", ")}`,
    `From: ${payload.submitterName} <${payload.submitterEmail}>`,
    "",
    "Definition:",
    payload.shortDefinition,
    "",
    "—",
    "Saved to Supabase when the glossary_terms table is configured.",
    "Review in Table Editor → glossary_terms (status = pending) or your inbox.",
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Glossary suggestion: ${payload.title}`,
      text: body,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[glossary-notify]", res.status, detail);
    return { ok: false, error: "Could not send notification email." };
  }

  return { ok: true };
}
