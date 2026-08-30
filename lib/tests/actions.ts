"use server";

import { displayNameFromAuth } from "@/lib/auth-display";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { getInnerTest } from "@/lib/tests/catalog";
import { elapsedMs, scoreAgainstTest, sittingSize } from "@/lib/tests/engine";
import { sittingPayloadLooksValid } from "@/lib/tests/leaderboard";
import type { SittingState } from "@/lib/tests/types";

export type SaveTestAttemptResult =
  | { ok: true }
  | { ok: false; error: string };

const MAX_ELAPSED_MS = 48 * 60 * 60 * 1000;

export type SaveTestAttemptInput = {
  testSlug: string;
  questionIds: string[];
  answers: Record<string, string>;
  startedAt: number;
  finishedAt: number;
};

export async function saveTestAttempt(
  input: SaveTestAttemptInput,
): Promise<SaveTestAttemptResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Leaderboard is not available in this environment yet." };
  }

  const user = await getAuthUser();
  if (!user?.id) {
    return { ok: false, error: "Sign in to save your score." };
  }

  const test = getInnerTest(input.testSlug);
  if (!test?.published) {
    return { ok: false, error: "That test is not available." };
  }

  const expectedSize = sittingSize(test.bank.length, test.sampleRatio);
  const sitting: SittingState = {
    testSlug: input.testSlug,
    questionIds: input.questionIds,
    optionsById: {},
    answers: input.answers,
    startedAt: input.startedAt,
    finishedAt: input.finishedAt,
  };

  if (!sittingPayloadLooksValid(sitting, expectedSize, test.bank)) {
    return { ok: false, error: "That sitting could not be saved." };
  }

  if (
    !Number.isFinite(input.startedAt) ||
    !Number.isFinite(input.finishedAt) ||
    input.finishedAt < input.startedAt
  ) {
    return { ok: false, error: "That sitting could not be saved." };
  }

  const elapsed = elapsedMs(sitting);
  if (elapsed > MAX_ELAPSED_MS) {
    return { ok: false, error: "That sitting could not be saved." };
  }

  const score = scoreAgainstTest(sitting, test);
  const displayName = displayNameFromAuth(
    user.email ?? "",
    user.user_metadata as Record<string, unknown> | null,
  );

  const supabase = await createClient();
  const { error } = await supabase.from("test_attempts").insert({
    user_id: user.id,
    test_slug: test.slug,
    display_name: displayName.slice(0, 80) || "Player",
    question_ids: sitting.questionIds,
    answers: sitting.answers,
    correct_count: score.correct,
    total_count: score.total,
    percent: score.percent,
    started_at: new Date(sitting.startedAt).toISOString(),
    finished_at: new Date(sitting.finishedAt!).toISOString(),
    elapsed_ms: elapsed,
  });

  if (error) {
    if (isDuplicateSitting(error.message)) return { ok: true };
    if (isMissingTable(error.message)) {
      return {
        ok: false,
        error: "Leaderboard storage is not set up yet. Apply pending migrations.",
      };
    }
    console.error("[test-attempts/save]", error.message);
    return { ok: false, error: "Could not save your score. Try again in a moment." };
  }

  return { ok: true };
}

function isDuplicateSitting(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("test_attempts_sitting_unique") ||
    lower.includes("duplicate key")
  );
}

function isMissingTable(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("test_attempts") &&
    (lower.includes("does not exist") ||
      lower.includes("could not find the table") ||
      lower.includes("schema cache"))
  );
}
