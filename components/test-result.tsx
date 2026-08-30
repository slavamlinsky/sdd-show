"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { CheckCircle2, CircleX } from "lucide-react";
import { TestStartButton } from "@/components/test-start-button";
import { buttonVariants } from "@/components/ui/button";
import { elapsedMs, formatElapsed, scoreAgainstTest } from "@/lib/tests/engine";
import {
  getSittingServerSnapshot,
  getSittingSnapshot,
  subscribeSitting,
} from "@/lib/tests/attempt-storage";
import type { InnerTest } from "@/lib/tests/types";
import { cn } from "@/lib/utils";

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function TestResult({ test }: { test: InnerTest }) {
  const hydrated = useHydrated();
  const sitting = useSyncExternalStore(
    subscribeSitting,
    () => getSittingSnapshot(test.slug),
    getSittingServerSnapshot,
  );
  const byId = useMemo(
    () => new Map(test.bank.map((q) => [q.id, q])),
    [test.bank],
  );

  if (!hydrated) {
    return (
      <p className="text-sm text-muted-foreground">Loading your result…</p>
    );
  }

  if (!sitting?.finishedAt) {
    return (
      <div className="max-w-xl space-y-4">
        <p className="text-muted-foreground">
          No finished sitting for this test in this browser tab.
        </p>
        <Link
          href={`/tests/${test.slug}`}
          className={cn(buttonVariants({ size: "lg" }), "rounded-xl")}
        >
          Go to the intro
        </Link>
      </div>
    );
  }

  const score = scoreAgainstTest(sitting, test);

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Your result</p>
        <h1 className="text-3xl sm:text-4xl">
          {score.passed ? "Solid grasp" : "Worth another pass"}
        </h1>
        <p className="text-lg text-foreground">
          {score.correct} / {score.total} correct ({score.percent}%). Aim was{" "}
          {score.passPercent}%.
        </p>
        <p className="text-muted-foreground">
          Time spent: {formatElapsed(elapsedMs(sitting))}
        </p>
        <p className="text-sm text-muted-foreground">
          Not a certificate — just a self-check against this site’s vocabulary.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <TestStartButton slug={test.slug} label="Try again" />
        <Link
          href="/tests"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-xl")}
        >
          Back to tests
        </Link>
        <Link
          href="/course"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-xl")}
        >
          Course
        </Link>
        <Link
          href="/glossary"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-xl")}
        >
          Glossary
        </Link>
        <Link
          href={`/sign-in?next=${encodeURIComponent("/tests")}`}
          className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "rounded-xl")}
        >
          Sign in to join the leaderboard
        </Link>
      </div>

      <section aria-labelledby="review-heading" className="space-y-4">
        <h2 id="review-heading" className="font-heading text-2xl font-semibold tracking-tight">
          Review
        </h2>
        <ol className="space-y-4">
          {sitting.questionIds.map((id, i) => {
            const q = byId.get(id);
            if (!q) return null;
            const chosen = sitting.answers[id];
            const ok = chosen === q.correct;
            return (
              <li
                key={id}
                className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm ring-1 ring-foreground/3"
              >
                <p className="flex items-start gap-2 text-sm font-medium text-muted-foreground">
                  {ok ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <CircleX className="mt-0.5 size-4 shrink-0 text-destructive" />
                  )}
                  <span>Question {i + 1}</span>
                </p>
                <p className="mt-2 font-medium text-foreground">{q.stem}</p>
                <p className="mt-3 text-sm">
                  <span className="text-muted-foreground">Your answer: </span>
                  {chosen ?? "—"}
                </p>
                {ok ? null : (
                  <p className="mt-1 text-sm">
                    <span className="text-muted-foreground">Correct: </span>
                    {q.correct}
                  </p>
                )}
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {q.explain}
                </p>
                {q.glossarySlug ? (
                  <Link
                    href={`/glossary#${q.glossarySlug}`}
                    className="mt-2 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    See also in the glossary
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
