import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ClipboardList, Lock } from "lucide-react";
import { GradientText } from "@/components/gradient-text";
import { Reveal } from "@/components/reveal";
import { SectionBackdrop } from "@/components/section-backdrop";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  comingSoonInnerTests,
  outerTests,
  publishedInnerTests,
} from "@/lib/tests/catalog";
import { sittingSize } from "@/lib/tests/engine";
import type { TestLevel } from "@/lib/tests/types";
import { metadataFromPageSeo, pageSeo } from "@/lib/seo-page-meta";
import { cn } from "@/lib/utils";

export const metadata: Metadata = metadataFromPageSeo(pageSeo.tests);

const levelLabel: Record<TestLevel, string> = {
  basic: "Basic",
  advanced: "Advanced",
  pro: "Pro",
};

const outerKindLabel = {
  course: "Course",
  exam: "Exam",
  quiz: "Quiz",
  guide: "Guide",
} as const;

const iconChipClass = cn(
  "flex size-11 shrink-0 items-center justify-center rounded-xl",
  "bg-linear-to-br from-violet-500/12 via-white to-sky-500/15 ring-1 ring-violet-500/15",
  "dark:from-violet-500/20 dark:via-card dark:to-sky-500/20 dark:ring-violet-400/20",
);

export default function TestsPage() {
  const published = publishedInnerTests();
  const soon = comingSoonInnerTests();

  return (
    <div className="full-bleed relative overflow-hidden">
      <SectionBackdrop tone="emerald" />
      <div className="relative mx-auto w-full max-w-6xl px-4 pt-6 pb-16 sm:px-6 sm:pt-12 sm:pb-24">
        <Reveal className="max-w-2xl space-y-4">
          <h1>
            Check how well you know SDD and{" "}
            <GradientText className="font-semibold">intent</GradientText>
          </h1>
          <p className="leading-relaxed text-muted-foreground">
            Short self-checks on AI-first development, spec-driven work, and
            Intent-Driven Engineering. Not a certificate.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            Guests can take any inner test. Sign in later to save a score on the
            leaderboard.
          </p>
        </Reveal>

        <section
          aria-labelledby="our-tests-heading"
          className="mt-14 scroll-mt-24"
        >
          <Reveal>
            <h2
              id="our-tests-heading"
              className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Our tests
            </h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Random questions from a larger bank. Four choices on screen. No
              timer while you work.
            </p>
          </Reveal>
          <ul className="mt-8 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
            {published.map((test, i) => {
              const n = sittingSize(test.bank.length, test.sampleRatio);
              return (
                <li key={test.slug}>
                  <Reveal delay={i * 0.05} className="h-full">
                    <article className="flex h-full flex-col rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm ring-1 ring-foreground/3">
                      <div className="flex items-start justify-between gap-3">
                        <span className={iconChipClass} aria-hidden>
                          <ClipboardList
                            className="size-5 text-violet-600 dark:text-sky-400"
                            strokeWidth={1.75}
                          />
                        </span>
                        <Badge variant="primary">{levelLabel[test.level]}</Badge>
                      </div>
                      <h3 className="mt-4 font-heading text-xl font-semibold tracking-tight">
                        {test.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {test.blurb}
                      </p>
                      <p className="mt-4 text-sm text-muted-foreground">
                        {test.bank.length} questions in the bank · ~{n} per
                        attempt
                        {test.estimatedMinutes ? ` · ${test.estimatedMinutes}` : ""}
                      </p>
                      <Link
                        href={`/tests/${test.slug}`}
                        className={cn(
                          buttonVariants({ size: "lg" }),
                          "mt-5 h-11 w-full rounded-xl sm:w-auto",
                        )}
                      >
                        Start
                      </Link>
                    </article>
                  </Reveal>
                </li>
              );
            })}
            {soon.map((test, i) => (
              <li key={test.slug}>
                <Reveal delay={(published.length + i) * 0.05} className="h-full">
                  <article className="flex h-full flex-col rounded-3xl border border-dashed border-border/70 bg-card/40 p-6 ring-1 ring-foreground/3">
                    <div className="flex items-start justify-between gap-3">
                      <span className={iconChipClass} aria-hidden>
                        <Lock
                          className="size-5 text-muted-foreground"
                          strokeWidth={1.75}
                        />
                      </span>
                      <Badge variant="outline">{levelLabel[test.level]}</Badge>
                    </div>
                    <h3 className="mt-4 font-heading text-xl font-semibold tracking-tight">
                      {test.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {test.blurb}
                    </p>
                    <p className="mt-4 text-sm font-medium text-muted-foreground">
                      Coming soon
                    </p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="outer-tests-heading"
          className="mt-20 scroll-mt-24"
        >
          <Reveal>
            <h2
              id="outer-tests-heading"
              className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Tests and courses elsewhere
            </h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              We do not run these. They measure vendor or general AI literacy, not
              this site’s glossary.
            </p>
          </Reveal>
          <ul className="mt-8 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {outerTests.map((item) => (
              <li key={item.href}>
                <article className="flex h-full flex-col rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm ring-1 ring-foreground/3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" size="xs">
                      {outerKindLabel[item.kind]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {item.publisher}
                    </span>
                  </div>
                  <h3 className="mt-3 font-heading text-base font-semibold tracking-tight">
                    {item.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.blurb}
                  </p>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Open
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="leaderboard-heading"
          className="mt-20 scroll-mt-24"
        >
          <Reveal>
            <div className="rounded-[1.75rem] border border-border/60 bg-linear-to-br from-primary/6 via-muted/30 to-sky-500/5 px-6 py-10 shadow-sm ring-1 ring-foreground/4 sm:px-10">
              <h2
                id="leaderboard-heading"
                className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                Leaderboard
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                Sign in and finish a test to appear here. Scores are not saved
                for guests yet.
              </p>
              <Link
                href="/sign-in?next=/tests"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "mt-6 inline-flex h-11 rounded-xl",
                )}
              >
                Sign in
              </Link>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
