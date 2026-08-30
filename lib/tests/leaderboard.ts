import type { InnerQuestion, SittingState } from "./types.ts";

export type LeaderboardRow = {
  rank: number;
  userId: string;
  testSlug: string;
  displayName: string;
  percent: number;
  elapsedMs: number;
  finishedAt: string;
};

export type LeaderboardAttempt = {
  userId: string;
  testSlug: string;
  displayName: string;
  percent: number;
  elapsedMs: number;
  finishedAt: string;
};

/** Best sitting per user per slug, then rank within each test. */
export function rankBestAttempts(
  attempts: readonly LeaderboardAttempt[],
  limitPerTest = 10,
): LeaderboardRow[] {
  const cap = Math.max(1, Math.min(limitPerTest, 50));
  const best = new Map<string, LeaderboardAttempt>();
  for (const row of attempts) {
    const key = `${row.userId}\0${row.testSlug}`;
    const prev = best.get(key);
    if (!prev || isBetterAttempt(row, prev)) best.set(key, row);
  }
  const grouped = new Map<string, LeaderboardAttempt[]>();
  for (const row of best.values()) {
    const list = grouped.get(row.testSlug) ?? [];
    list.push(row);
    grouped.set(row.testSlug, list);
  }
  const out: LeaderboardRow[] = [];
  for (const [, list] of grouped) {
    list.sort(compareAttempts);
    list.slice(0, cap).forEach((row, i) => {
      out.push({ ...row, rank: i + 1 });
    });
  }
  out.sort((a, b) => a.testSlug.localeCompare(b.testSlug) || a.rank - b.rank);
  return out;
}

function isBetterAttempt(a: LeaderboardAttempt, b: LeaderboardAttempt): boolean {
  return compareAttempts(a, b) < 0;
}

function compareAttempts(a: LeaderboardAttempt, b: LeaderboardAttempt): number {
  if (a.percent !== b.percent) return b.percent - a.percent;
  if (a.elapsedMs !== b.elapsedMs) return a.elapsedMs - b.elapsedMs;
  return a.finishedAt.localeCompare(b.finishedAt);
}

export function isLegalAnswer(question: InnerQuestion, answer: string): boolean {
  return answer === question.correct || question.distractors.includes(answer);
}

export function sittingPayloadLooksValid(
  sitting: Pick<SittingState, "testSlug" | "questionIds" | "answers">,
  expectedSize: number,
  bank: InnerQuestion[],
): boolean {
  if (sitting.questionIds.length !== expectedSize) return false;
  if (new Set(sitting.questionIds).size !== sitting.questionIds.length) return false;
  const lookup = new Map(bank.map((q) => [q.id, q]));
  for (const id of sitting.questionIds) {
    const q = lookup.get(id);
    const answer = sitting.answers[id];
    if (!q || !answer || !isLegalAnswer(q, answer)) return false;
  }
  return true;
}
