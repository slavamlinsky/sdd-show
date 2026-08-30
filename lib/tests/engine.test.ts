import assert from "node:assert/strict";
import test from "node:test";
import { innerTests } from "./catalog.ts";
import { welcomeBasic, welcomeBasicBank } from "./welcome-basic.ts";
import {
  allAnswered,
  createSitting,
  formatElapsed,
  pickVisibleOptions,
  scoreAgainstTest,
  sittingSize,
} from "./engine.ts";

function sequentialRandom() {
  let i = 0;
  return () => {
    i += 1;
    return (i % 10) / 10;
  };
}

test("welcome bank has 60 items with required mix and option pools", () => {
  assert.equal(welcomeBasicBank.length, 60);
  const tags = Object.fromEntries(
    ["ai-first", "sdd", "ide", "glossary", "ecosystem-lite"].map((t) => [
      t,
      welcomeBasicBank.filter((q) => q.tags.includes(t as never)).length,
    ]),
  );
  assert.equal(tags["ai-first"], 12);
  assert.equal(tags["sdd"], 14);
  assert.equal(tags["ide"], 12);
  assert.equal(tags["glossary"], 16);
  assert.equal(tags["ecosystem-lite"], 6);

  const ids = new Set(welcomeBasicBank.map((q) => q.id));
  assert.equal(ids.size, 60);

  for (const q of welcomeBasicBank) {
    assert.ok(q.distractors.length === 5 || q.distractors.length === 6, q.id);
    assert.ok(!q.distractors.includes(q.correct), q.id);
    assert.equal(new Set(q.distractors).size, q.distractors.length, q.id);
  }
});

test("sitting size for welcome-basic is 30", () => {
  assert.equal(sittingSize(60, 0.5), 30);
  assert.equal(sittingSize(welcomeBasic.bank.length, welcomeBasic.sampleRatio), 30);
});

test("createSitting samples unique ids and four options including correct", () => {
  const sitting = createSitting(welcomeBasic, sequentialRandom());
  assert.equal(sitting.questionIds.length, 30);
  assert.equal(new Set(sitting.questionIds).size, 30);
  const byId = new Map(welcomeBasic.bank.map((q) => [q.id, q]));
  for (const id of sitting.questionIds) {
    const q = byId.get(id);
    assert.ok(q);
    const opts = sitting.optionsById[id];
    assert.equal(opts?.length, 4);
    assert.ok(opts?.includes(q.correct), id);
  }
  assert.equal(allAnswered(sitting), false);
});

test("pickVisibleOptions always includes the correct answer", () => {
  const q = welcomeBasicBank[0];
  assert.ok(q);
  const opts = pickVisibleOptions(q, sequentialRandom());
  assert.equal(opts.length, 4);
  assert.ok(opts.includes(q.correct));
});

test("scoreAgainstTest counts matches and applies pass bar", () => {
  const sitting = createSitting(welcomeBasic, sequentialRandom());
  const byId = new Map(welcomeBasic.bank.map((q) => [q.id, q]));
  for (const id of sitting.questionIds) {
    sitting.answers[id] = byId.get(id)?.correct ?? "";
  }
  const perfect = scoreAgainstTest(sitting, welcomeBasic);
  assert.equal(perfect.correct, 30);
  assert.equal(perfect.percent, 100);
  assert.equal(perfect.passed, true);

  sitting.answers[sitting.questionIds[0] ?? ""] = "wrong";
  const almost = scoreAgainstTest(sitting, welcomeBasic);
  assert.equal(almost.correct, 29);
});

test("formatElapsed is human readable", () => {
  assert.equal(formatElapsed(0), "0 sec");
  assert.equal(formatElapsed(45_000), "45 sec");
  assert.equal(formatElapsed(60_000), "1 min");
  assert.equal(formatElapsed(124_000), "2 min 4 sec");
});

test("inner catalog publishes only welcome-basic", () => {
  assert.equal(innerTests.filter((t) => t.published).length, 1);
  assert.equal(innerTests.find((t) => t.published)?.slug, "welcome-basic");
});
