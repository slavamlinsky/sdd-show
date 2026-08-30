import type { InnerQuestion, InnerTest, SittingState } from "./types.ts";

export const SITTING_MIN = 20;
export const SITTING_MAX = 50;
export const OPTIONS_ON_SCREEN = 4;
export const DISTRACTORS_SHOWN = OPTIONS_ON_SCREEN - 1;

export function sittingSize(bankLength: number, sampleRatio: number): number {
  const raw = Math.round(bankLength * sampleRatio);
  return Math.min(SITTING_MAX, Math.max(SITTING_MIN, raw));
}

/** Fisher–Yates. Inject `random` in tests. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const a = out[i];
    const b = out[j];
    if (a === undefined || b === undefined) continue;
    out[i] = b;
    out[j] = a;
  }
  return out;
}

export function pickVisibleOptions(
  question: InnerQuestion,
  random: () => number = Math.random,
): string[] {
  const pool = shuffle(question.distractors, random).slice(0, DISTRACTORS_SHOWN);
  return shuffle([question.correct, ...pool], random);
}

export function createSitting(
  test: InnerTest,
  random: () => number = Math.random,
): SittingState {
  const size = sittingSize(test.bank.length, test.sampleRatio);
  const sampled = shuffle(test.bank, random).slice(0, size);
  const optionsById: Record<string, string[]> = {};
  for (const q of sampled) {
    optionsById[q.id] = pickVisibleOptions(q, random);
  }
  return {
    testSlug: test.slug,
    questionIds: sampled.map((q) => q.id),
    optionsById,
    answers: {},
    startedAt: Date.now(),
  };
}

export function questionsById(bank: InnerQuestion[]): Map<string, InnerQuestion> {
  return new Map(bank.map((q) => [q.id, q]));
}

export function scoreSitting(
  sitting: SittingState,
  bank: InnerQuestion[],
): { correct: number; total: number; percent: number; passed: boolean; passPercent: number } {
  const lookup = questionsById(bank);
  let correct = 0;
  for (const id of sitting.questionIds) {
    const q = lookup.get(id);
    if (q && sitting.answers[id] === q.correct) correct += 1;
  }
  const total = sitting.questionIds.length;
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { correct, total, percent, passed: false, passPercent: 0 };
}

export function scoreAgainstTest(sitting: SittingState, test: InnerTest) {
  const base = scoreSitting(sitting, test.bank);
  return {
    ...base,
    passPercent: test.passPercent,
    passed: base.percent >= test.passPercent,
  };
}

export function elapsedMs(sitting: SittingState, now = Date.now()): number {
  const end = sitting.finishedAt ?? now;
  return Math.max(0, end - sitting.startedAt);
}

export function formatElapsed(ms: number): string {
  const totalSec = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m === 0) return `${s} sec`;
  if (s === 0) return `${m} min`;
  return `${m} min ${s} sec`;
}

export function allAnswered(sitting: SittingState): boolean {
  return sitting.questionIds.every((id) => Boolean(sitting.answers[id]));
}
