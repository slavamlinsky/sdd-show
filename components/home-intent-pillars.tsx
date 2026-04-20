import Link from "next/link";
import { Ban, BarChart3, Handshake, Target } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";
import { GradientText } from "./gradient-text";

/** Matches `HomePillars` icon chip: larger box + smaller glyph = comfortable padding on all sides */
const intentIconChipClass = cn(
  "flex size-14 p-2 shrink-0 items-center justify-center rounded-lg",
  "bg-gradient-to-br from-violet-500/12 via-white to-sky-500/15 ring-1 ring-violet-500/15",
  "dark:from-violet-500/20 dark:via-card dark:to-sky-500/20 dark:ring-violet-400/20"
);

const pillars = [
  {
    title: "Outcome clarity",
    description: "Define the destination using specific numbers, scope, and deadlines. Remove ambiguity so everyone understands what “done” truly means.",
    icon: Target,
    glossarySlug: "outcome-clarity",
  },
  {
    title: "Success metrics",
    description: "Decide in advance how success will be measured and validated. If the outcome cannot be measured, it cannot be optimized.",
    icon: BarChart3,
    glossarySlug: "success-metrics",
  },
  {
    title: "Constraints & Guards",
    description: "Clearly state boundaries, limitations, and what is off-limits. Strong constraints prevent wasted effort and guide better decisions.",
    icon: Ban,
    glossarySlug: "constraints-and-guards",
  },
  {
    title: "Delegation & Trust",
    description: 'Describe the desired result instead of prescribing the process. Focus on the what and allow flexibility in the how.',
    icon: Handshake,
    glossarySlug: "delegation",
  },
] as const;

export function HomeIntentPillars() {
  return (
    <section
      className="border-b border-border/40 bg-gradient-to-b from-muted/20 via-background to-background pb-16 pt-6 sm:pb-20 sm:pt-8"
      aria-labelledby="intent-pillars-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center" distance={16}>
          <h2
            id="intent-pillars-heading"
            className="font-heading text-2xl text-balance font-semibold leading-tight tracking-tight sm:text-3xl"
          >
            Four core principles <GradientText>for intent-driven work</GradientText>
          </h2>
          <p className="mt-8 max-w-[62ch] mx-auto text-sm text-muted-foreground">
          You can learn how to translate high-level intent into a complete, workable system design. Master the ideas,
          vocabulary, and a repeatable workflow you can use on real-world projects.  
          </p>
        </Reveal>
        <ul className="mt-12 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:gap-8">
          {pillars.map((item, i) => {
            const Icon = item.icon;
            return (
              <li key={item.glossarySlug}>
                <Reveal delay={i * 0.06} distance={14}>
                  <div className="flex h-full gap-5 rounded-xl border border-border/60 bg-card/90 p-8 shadow-sm ring-1 ring-foreground/[0.03] backdrop-blur-sm sm:p-8">
                    <span className={intentIconChipClass} aria-hidden>
                      <Icon
                        className="size-10 text-violet-600 dark:text-sky-400"
                        strokeWidth={1.5}
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-heading text-lg font-semibold leading-snug tracking-tight text-foreground">
                        <Link
                          href={`/glossary#${item.glossarySlug}`}
                          className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          {item.title}
                        </Link>
                      </h3>
                      <p className="mt-3 text-[15px] leading-[1.7] text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
