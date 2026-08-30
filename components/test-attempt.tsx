"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { getInnerTest } from "@/lib/tests/catalog";
import { allAnswered } from "@/lib/tests/engine";
import {
  getSittingServerSnapshot,
  getSittingSnapshot,
  saveSitting,
  subscribeSitting,
} from "@/lib/tests/attempt-storage";
import { cn } from "@/lib/utils";

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
          No active sitting in this browser tab. Start from the intro so we can
          pick a random set of questions.
        </p>
        <Link
          href={`/tests/${slug}`}
          className={cn(buttonVariants({ size: "lg" }), "rounded-xl")}
        >
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
      <p className="text-sm font-medium text-muted-foreground">
        Question {index + 1} of {total}
      </p>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
        aria-hidden
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
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
            return (
              <label
                key={option}
                htmlFor={inputId}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm leading-relaxed shadow-sm ring-1 ring-foreground/3 transition-colors",
                  selected
                    ? "border-primary/50 bg-primary/8 ring-primary/15"
                    : "border-border/60 bg-card/80 hover:border-border hover:bg-card",
                )}
              >
                <input
                  id={inputId}
                  type="radio"
                  name={questionId}
                  value={option}
                  checked={selected}
                  className="mt-1 size-4 shrink-0 accent-primary"
                  onChange={() =>
                    saveSitting({
                      ...sitting,
                      answers: { ...sitting.answers, [questionId]: option },
                    })
                  }
                />
                <span>{option}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          className="rounded-xl"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          Back
        </Button>
        {index < total - 1 ? (
          <Button
            className="rounded-xl"
            onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
          >
            Next
          </Button>
        ) : (
          <Button
            className="rounded-xl"
            disabled={!canSubmit}
            onClick={() => {
              saveSitting({ ...sitting, finishedAt: Date.now() });
              router.push(`/tests/${slug}/result`);
            }}
          >
            Submit
          </Button>
        )}
      </div>
      {index === total - 1 && !canSubmit ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Answer all questions first. Use Back to fill any you skipped.
        </p>
      ) : null}
    </div>
  );
}
