import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";
import { GradientText } from "./gradient-text";

type Phase = {
  range: string;
  title: string;
  subtitle?: string;
  process: string;
  /** Friction, challenge, issue, or future-facing note */
  note?: { label: string; text: string };
};

const phases: Phase[] = [
  {
    range: "2018-2020",
    title: "Requirement driven",
    subtitle: "the classic era",
    process:
      "Business teams write PRDs; developers manually translate prose into logic in the editor.",
    note: {
      label: "Friction",
      text: 'The "thinking gap" sat in manual coding, speed capped by typing, context switching, syntax mistakes.',
    },
  },
  {
    range: "2020-2022",
    title: "Test driven",
    subtitle: "the disciplined era",
    process: "Write the test first, then the code. Behavior is agreed before implementation lands.",
    note: {
      label: "Challenge",
      text: "Can feel redundant when AI can draft code and tests at once, unless tests still anchor intent.",
    },
  },
  {
    range: "2023-2024",
    title: 'Prompt engineering',
    subtitle: "vibe coding era",
    process:
      "Natural-language prompts in chat produce huge diffs in minutes and iteration looks fast on the surface.",
    note: {
      label: "Issue",
      text: 'Speed without direction: teams babysit hallucinations and one-shot code that never matched a contract.',
    },
  },
  {
    range: "2025",
    title: "Spec-driven development",
    subtitle: "the structured era",
    process:
      "The source of truth is specification — not the code. Models are guided by an explicit behavior contract.",
  },
  {
    range: "2026+",
    title: "Intent-driven engineering",
    subtitle: "the autonomous era",
    process:
      'Define outcomes and success criteria (the "what") and let agents reason through the "how" across tools and systems, within guardrails you wrote down.',
  },
];

export function HomeEvolutionTimeline() {
  return (
    <section
      className="full-bleed relative overflow-hidden border-y border-border/40 bg-gradient-to-b from-background via-muted/15 to-background py-16 sm:py-24"
      aria-labelledby="evolution-timeline-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_70%_80%_at_50%_-20%,rgba(99,102,241,0.08),transparent_65%)]"
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center" distance={18}>
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">How we got here</p>
          <h2
            id="evolution-timeline-heading"
            className="mt-2 font-heading text-2xl font-semibold text-balance tracking-tight sm:text-3xl"
          >
            From manual friction{" "}
            <GradientText>
              to AI-driven speed
            </GradientText>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            A vertical journey through the evolution of the software development lifecycle. From documents and manual
            testing, to prompts, and now to intent and executable specs as the new leverage.
          </p>
        </Reveal>

        <div className="relative mx-auto mt-14 max-w-4xl md:mt-20">
          {/* Center axis — desktop */}
          <div
            className="pointer-events-none absolute left-1/2 top-3 bottom-3 hidden w-px -translate-x-1/2 bg-gradient-to-b from-border via-primary/45 to-violet-500/50 md:block"
            aria-hidden
          />

          <ol className="relative m-0 flex list-none flex-col gap-0 p-0">
            {phases.map((phase, i) => {
              const onRight = i % 2 === 0;
              return (
                <li key={phase.range} className="relative pb-4 last:pb-0 md:last:pb-4">
                  {/* Mobile: rail + card */}
                  <Reveal delay={i * 0.07} distance={18} className="contents">
                    <div className="flex flex-col gap-4 md:hidden [&>*:first-child]:hidden">
                      <div className="flex w-5 shrink-0 items-start justify-center pt-1">
                        <span
                          className="size-3 shrink-0 rounded-full border-2 border-background bg-primary shadow-[0_0_0_3px_rgba(99,102,241,0.25)]"
                          aria-hidden
                        />
                      </div>
                      <PhaseCard phase={phase} align="left" />
                    </div>

                    {/* Desktop: alternating sides (first era on the right) */}
                    <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:gap-x-3 md:gap-y-0 md:items-center">
                      <div
                        className={cn(
                          "min-w-0",
                          onRight ? "col-start-1 invisible" : "col-start-1 justify-self-end text-right"
                        )}
                      >
                        {!onRight ? <PhaseCard phase={phase} align="right" /> : null}
                      </div>

                      <div className="relative col-start-2 flex flex-col items-center justify-center">
                        <span
                          className="relative z-10 size-3 shrink-0 rounded-full border-[3px] border-background bg-primary shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
                          aria-hidden
                        />
                      </div>

                      <div
                        className={cn(
                          "min-w-0",
                          onRight ? "col-start-3 justify-self-start text-left" : "col-start-3 invisible"
                        )}
                      >
                        {onRight ? <PhaseCard phase={phase} align="left" /> : null}
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function PhaseCard({ phase, align }: { phase: Phase; align: "left" | "right" }) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-border/60 bg-card/95 p-4 shadow-sm ring-1 ring-foreground/[0.04] sm:p-5",
        align === "right" && "md:text-right"
      )}
    >
      <p className="text-xs font-semibold tabular-nums tracking-wide text-primary">{phase.range}</p>
      <h3 className="mt-1 font-heading text-xl font-semibold tracking-tight text-primary sm:text-2xl">
        {phase.title}
      </h3>
      <h4 className="font-heading text-sm md:text-base font-medium tracking-tight text-gray-400">
        {phase.subtitle}
      </h4>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground/90">Process: </span>
        {phase.process}
      </p>
      {phase.note ? (
        <p
          className={cn(
            "mt-3 border-t border-border/50 pt-3 text-sm leading-relaxed text-muted-foreground",
            align === "right" && "md:text-right"
          )}
        >
          <span className="font-semibold text-foreground/85">{phase.note.label}: </span>
          {phase.note.text}
        </p>
      ) : null}
    </article>
  );
}
