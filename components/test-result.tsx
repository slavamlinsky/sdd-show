"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  CircleX,
  Clock3,
  GraduationCap,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { TestStartButton } from "@/components/test-start-button";
import { TestLeaderboard } from "@/components/test-leaderboard";
import { GradientText } from "@/components/gradient-text";
import { saveTestAttempt } from "@/lib/tests/actions";
import type { LeaderboardRow } from "@/lib/tests/leaderboard";
import {
  testGradientCta,
  testOutlineCta,
} from "@/lib/tests/chrome";
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

export function TestResult({
  test,
  signedIn,
  currentUserId,
  currentUserName,
  leaderboard,
}: {
  test: InnerTest;
  signedIn: boolean;
  currentUserId?: string | null;
  currentUserName?: string | null;
  leaderboard: LeaderboardRow[];
}) {
  const router = useRouter();
  const hydrated = useHydrated();
  const savedKey = useRef<string | null>(null);
  const inflightKey = useRef<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const sitting = useSyncExternalStore(
    subscribeSitting,
    () => getSittingSnapshot(test.slug),
    getSittingServerSnapshot,
  );
  const byId = useMemo(
    () => new Map(test.bank.map((q) => [q.id, q])),
    [test.bank],
  );

  useEffect(() => {
    if (!hydrated || !signedIn || !sitting?.finishedAt) return;
    const key = `${test.slug}:${sitting.startedAt}`;
    if (savedKey.current === key || inflightKey.current === key) return;
    inflightKey.current = key;
    let cancelled = false;
    void saveTestAttempt({
      testSlug: test.slug,
      questionIds: sitting.questionIds,
      answers: sitting.answers,
      startedAt: sitting.startedAt,
      finishedAt: sitting.finishedAt,
    }).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        savedKey.current = key;
        setSaveMessage("Score saved to the leaderboard.");
        router.refresh();
        return;
      }
      inflightKey.current = null;
      setSaveMessage(result.error);
    }).catch(() => {
      if (cancelled) return;
      inflightKey.current = null;
      setSaveMessage("Could not save your score. Try again in a moment.");
    });
    return () => {
      cancelled = true;
    };
  }, [hydrated, signedIn, sitting, test.slug, router]);

  if (!hydrated) {
    return (
      <p className="text-sm text-muted-foreground">Loading your result…</p>
    );
  }

  if (!sitting?.finishedAt) {
    return (
      <div className="max-w-xl space-y-4">
        <p className="text-muted-foreground">
          No finished sitting for this test in this tab.
        </p>
        <Link href={`/tests/${test.slug}`} className={testGradientCta}>
          Go to the intro
        </Link>
      </div>
    );
  }

  const score = scoreAgainstTest(sitting, test);

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div
        className={cn(
          "overflow-hidden rounded-[1.75rem] border p-6 shadow-sm ring-1 sm:p-8",
          score.passed
            ? "border-emerald-400/30 bg-linear-to-br from-emerald-500/12 via-card to-sky-500/10 ring-emerald-500/15"
            : "border-amber-400/30 bg-linear-to-br from-amber-500/12 via-card to-violet-500/10 ring-amber-500/15",
        )}
      >
        <div className="flex items-start gap-4">
          <span
            className={cn(
              "flex size-14 shrink-0 items-center justify-center rounded-2xl",
              score.passed
                ? "bg-linear-to-br from-emerald-500 to-sky-500 text-white"
                : "bg-linear-to-br from-amber-500 to-violet-500 text-white",
            )}
            aria-hidden
          >
            {score.passed ? (
              <Sparkles className="size-7" strokeWidth={1.75} />
            ) : (
              <Target className="size-7" strokeWidth={1.75} />
            )}
          </span>
          <div className="min-w-0 space-y-2">
            <h1 className="text-3xl sm:text-4xl">
              {score.passed ? (
                <>
                  Solid <GradientText>grasp</GradientText>
                </>
              ) : (
                <>
                  Worth another <GradientText>pass</GradientText>
                </>
              )}
            </h1>
            <p className="text-sm text-muted-foreground">
              A self-check, not a certificate.
            </p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/50 bg-background/70 px-4 py-3">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Target className="size-3.5" aria-hidden />
              Score
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums">
              {score.correct} / {score.total}
            </dd>
          </div>
          <div className="rounded-2xl border border-border/50 bg-background/70 px-4 py-3">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5" aria-hidden />
              Percent
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums">
              {score.percent}%
              <span className="ml-1 text-sm font-medium text-muted-foreground">
                of {score.passPercent}%
              </span>
            </dd>
          </div>
          <div className="rounded-2xl border border-border/50 bg-background/70 px-4 py-3">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Clock3 className="size-3.5" aria-hidden />
              Time
            </dt>
            <dd className="mt-1 text-lg font-semibold">
              {formatElapsed(elapsedMs(sitting))}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-wrap gap-3">
        <TestStartButton slug={test.slug} label="Try again" icon={RotateCcw} />
        <Link href="/tests" className={testOutlineCta}>
          Back to tests
        </Link>
        <Link href="/course" className={testOutlineCta}>
          <GraduationCap className="size-5" aria-hidden />
          Course
        </Link>
      </div>

      {saveMessage ? (
        <p className="text-sm text-muted-foreground">{saveMessage}</p>
      ) : null}

      <TestLeaderboard
        rows={leaderboard}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        signedIn={signedIn}
        signInNext={`/tests/${test.slug}/result`}
        headingId="result-leaderboard-heading"
      />

      <section aria-labelledby="review-heading" className="space-y-4">
        <h2
          id="review-heading"
          className="font-heading text-2xl font-semibold tracking-tight"
        >
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
                className={cn(
                  "rounded-2xl border bg-card/80 p-5 shadow-sm ring-1",
                  ok
                    ? "border-emerald-400/25 ring-emerald-500/10"
                    : "border-rose-400/25 ring-rose-500/10",
                )}
              >
                <p className="flex items-start gap-2 text-sm font-medium">
                  {ok ? (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <CircleX className="mt-0.5 size-5 shrink-0 text-rose-600 dark:text-rose-400" />
                  )}
                  <span
                    className={
                      ok
                        ? "text-emerald-800 dark:text-emerald-300"
                        : "text-rose-800 dark:text-rose-300"
                    }
                  >
                    Question {i + 1}
                  </span>
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
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    <BookOpen className="size-3.5" aria-hidden />
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
