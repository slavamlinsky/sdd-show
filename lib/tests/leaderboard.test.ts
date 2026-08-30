import assert from "node:assert/strict";
import test from "node:test";
import { welcomeBasic } from "./welcome-basic.ts";
import {
  isLegalAnswer,
  rankBestAttempts,
  sittingPayloadLooksValid,
} from "./leaderboard.ts";
import { sittingSize } from "./engine.ts";

test("ranks best percent then fastest then earliest finish per user", () => {
  const rows = rankBestAttempts(
    [
      {
        userId: "a",
        testSlug: "welcome-basic",
        displayName: "Ada",
        percent: 80,
        elapsedMs: 120_000,
        finishedAt: "2026-08-01T00:00:00.000Z",
      },
      {
        userId: "a",
        testSlug: "welcome-basic",
        displayName: "Ada",
        percent: 90,
        elapsedMs: 200_000,
        finishedAt: "2026-08-02T00:00:00.000Z",
      },
      {
        userId: "b",
        testSlug: "welcome-basic",
        displayName: "Bea",
        percent: 90,
        elapsedMs: 100_000,
        finishedAt: "2026-08-03T00:00:00.000Z",
      },
      {
        userId: "c",
        testSlug: "welcome-basic",
        displayName: "Cam",
        percent: 90,
        elapsedMs: 100_000,
        finishedAt: "2026-08-01T00:00:00.000Z",
      },
    ],
    10,
  );

  assert.equal(rows.map((r) => r.displayName).join(","), "Cam,Bea,Ada");
  assert.equal(rows[0]?.rank, 1);
  assert.equal(rows[2]?.percent, 90);
});

test("sitting payload must match sitting size and legal answers", () => {
  const size = sittingSize(welcomeBasic.bank.length, welcomeBasic.sampleRatio);
  const questions = welcomeBasic.bank.slice(0, size);
  const answers = Object.fromEntries(
    questions.map((q) => [q.id, q.correct]),
  );
  assert.equal(
    sittingPayloadLooksValid(
      {
        testSlug: welcomeBasic.slug,
        questionIds: questions.map((q) => q.id),
        answers,
      },
      size,
      welcomeBasic.bank,
    ),
    true,
  );
  assert.equal(isLegalAnswer(questions[0]!, "not an option"), false);
});
