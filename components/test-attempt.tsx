"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { getInnerTest } from "@/lib/tests/catalog";
import { testGradientCta, testOutlineCta } from "@/lib/tests/chrome";
import { allAnswered } from "@/lib/tests/engine";
import {
  getSittingServerSnapshot,
  getSittingSnapshot,
  saveSitting,
  subscribeSitting,
} from "@/lib/tests/attempt-storage";
import { cn } from "@/lib/utils";

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function TestAttempt({ slug }: { slug: string }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const sitting = useSyncExternalStore(
    subscribeSitting,
    () => getSittingSnapshot(slug),
    getSittingServerSnapshot,
  );
  const test = getInnerTest(slug);
  const byId = useMemo(
    () => new Map((test?.bank ?? []).map((q) => [q.id, q])),
    [test],
  );
  const [index, setIndex] = useState(0);

  const sittingOk =
    Boolean(sitting) &&
    !sitting?.finishedAt &&
    (sitting?.questionIds.length ?? 0) > 0;

  useEffect(() => {
    if (!sittingOk) return;
    const onLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [sittingOk]);

  if (!hydrated) {
    return (
      <p className="text-sm text-muted-foreground">Loading this sitting…</p>
    );
  }

  if (!sitting || !sittingOk) {
    return (
      <div className="max-w-xl space-y-4">
        <p className="text-muted-foreground">
          No active sitting in this tab. Start from the intro so we can pick a
          random set of questions.
        </p>
        <Link href={`/tests/${slug}`} className={testGradientCta}>
          Go to the intro
        </Link>
      </div>
    );
  }

  const questionId = sitting.questionIds[index];
  const question = questionId ? byId.get(questionId) : undefined;
  const options = questionId ? sitting.optionsById[questionId] : undefined;
  const total = sitting.questionIds.length;
  const chosen = questionId ? sitting.answers[questionId] : undefined;
  const canSubmit = allAnswered(sitting);

  if (!question || !options || !questionId) {
    return (
      <p className="text-sm text-muted-foreground">
        This sitting is incomplete.{" "}
        <button
          type="button"
          className="text-primary underline-offset-4 hover:underline"
          onClick={() => router.replace(`/tests/${slug}`)}
        >
          Start again
        </button>
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-end justify-between gap-4">
        <p className="text-sm font-medium text-muted-foreground">
          Question {index + 1} of {total}
        </p>
        <p className="text-sm tabular-nums text-muted-foreground">
          {Math.round(((index + 1) / total) * 100)}%
        </p>
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-muted/80 ring-1 ring-foreground/5"
        aria-hidden
      >
        <div
          className="h-full rounded-full bg-linear-to-r from-violet-600 to-sky-500 transition-[width] duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <fieldset className="mt-8">
        <legend className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {question.stem}
        </legend>
        <div className="mt-6 space-y-3">
          {options.map((option, optionIndex) => {
            const selected = chosen === option;
            const inputId = `${questionId}-opt-${optionIndex}`;
            const letter = OPTION_LETTERS[optionIndex] ?? "A";
            return (
              <label
                key={option}
                htmlFor={inputId}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-[15px] leading-relaxed shadow-sm ring-1 transition-all",
                  selected
                    ? "border-violet-400/50 bg-linear-to-r from-violet-500/10 to-sky-500/10 ring-violet-500/20"
                    : "border-border/60 bg-card/80 ring-foreground/3 hover:border-border hover:bg-card hover:shadow-md",
                )}
              >
                <input
                  id={inputId}
                  type="radio"
                  name={questionId}
                  value={option}
                  checked={selected}
                  className="sr-only"
                  onChange={() =>
                    saveSitting({
                      ...sitting,
                      answers: { ...sitting.answers, [questionId]: option },
                    })
                  }
                />
                <span
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl text-xs font-semibold",
                    selected
                      ? "bg-linear-to-br from-violet-600 to-sky-500 text-white"
                      : "bg-muted text-muted-foreground",
                  )}
                  aria-hidden
                >
                  {letter}
                </span>
                <span className="pt-1">{option}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className={testOutlineCta}
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          <ArrowLeft className="size-5" aria-hidden />
          Back
        </button>
        {index < total - 1 ? (
          <button
            type="button"
            className={testGradientCta}
            onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
          >
            Next
            <ArrowRight className="size-5" aria-hidden />
          </button>
        ) : (
          <button
            type="button"
            className={testGradientCta}
            disabled={!canSubmit}
            onClick={() => {
              saveSitting({ ...sitting, finishedAt: Date.now() });
              router.push(`/tests/${slug}/result`);
            }}
          >
            Submit
            <Check className="size-5" aria-hidden />
          </button>
        )}
      </div>
      {index === total - 1 && !canSubmit ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Answer every question first. Use Back if you skipped any.
        </p>
      ) : null}
    </div>
  );
}
