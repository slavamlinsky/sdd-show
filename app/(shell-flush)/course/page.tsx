import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, PenLineIcon } from "lucide-react";
import { CourseFaq } from "@/components/course-faq";
import { CourseHeroPanel } from "@/components/course-hero-panel";
import { CourseLeadForm } from "@/components/course-lead-form";
import { GradientText } from "@/components/gradient-text";
import { Reveal } from "@/components/reveal";
import { SectionBackdrop } from "@/components/section-backdrop";
import { buttonVariants } from "@/components/ui/button";
import {
  courseAudienceCards,
  courseAudienceChips,
  courseMeta,
  courseModules,
  courseOutro,
  coursePromises,
} from "@/lib/course-data";
import { keywordsForPage } from "@/lib/seo-keywords";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Course",
  description:
    "Become an Intent-Driven Engineer. Stop prompting, start directing. Join the list for launch updates.",
  keywords: keywordsForPage(
    "SDD course",
    "intent-driven engineering",
    "spec-driven development",
    "AI agents",
    "intent-driven engineer",
  ),
};

const iconChipClass = cn(
  "flex size-11 shrink-0 items-center justify-center rounded-xl",
  "bg-linear-to-br from-violet-500/12 via-white to-sky-500/15 ring-1 ring-violet-500/15",
  "dark:from-violet-500/20 dark:via-card dark:to-sky-500/20 dark:ring-violet-400/20",
);

export default function CoursePage() {
  return (
    <div className="flex flex-col">
      <section className="full-bleed relative overflow-hidden border-b border-border/50">
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-35%,rgba(99,102,241,0.16),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(14,165,233,0.1),transparent_50%)]"
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 pt-6 pb-12 sm:px-6 sm:pt-12 sm:pb-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-12">
            <Reveal className="min-w-0 flex-1 space-y-5" distance={28}>
              <h1 className="text-balance">
                {courseMeta.titleLead}{" "}
                <GradientText className="font-semibold">
                  {courseMeta.titleAccent}
                </GradientText>
              </h1>
              <p className="max-w-160 text-pretty text-lg font-medium leading-snug text-foreground sm:text-xl">
                {courseMeta.tagline}
              </p>
              <p className="max-w-2xl text-pretty text-muted-foreground">
                {courseMeta.pitch}
              </p>
              <ul className="grid max-w-xl grid-cols-2 gap-2 sm:gap-3">
                {courseAudienceChips.map((chip) => {
                  const Icon = chip.icon;
                  return (
                    <li
                      key={chip.label}
                      className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/70 px-3 py-2.5 text-sm font-medium text-foreground shadow-sm ring-1 ring-foreground/3"
                    >
                      <span
                        className={cn(iconChipClass, "size-9 rounded-lg")}
                        aria-hidden
                      >
                        <Icon
                          className="size-4 text-violet-600 dark:text-sky-400"
                          strokeWidth={1.75}
                        />
                      </span>
                      {chip.label}
                    </li>
                  );
                })}
              </ul>
              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
                <a
                  href="#lead"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "inline-flex h-12 justify-center gap-2 rounded-md px-8 text-base shadow-md shadow-primary/15",
                  )}
                >
                  Get updates
                  <ArrowRightIcon className="size-4" />
                </a>
                <a
                  href="#syllabus"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 justify-center rounded-md border-border/80 px-8 text-base",
                  )}
                >
                  See the syllabus
                </a>
              </div>
            </Reveal>
            <Reveal
              className="relative w-full shrink-0 lg:max-w-md"
              delay={0.08}
              distance={24}
            >
              <CourseHeroPanel />
            </Reveal>
          </div>
        </div>
      </section>

      <section
        className="border-b border-border/40 bg-linear-to-b from-muted/20 via-background to-background py-16 sm:py-20"
        aria-labelledby="course-audience-heading"
      >
        <Reveal className="mx-auto max-w-2xl text-center" distance={16}>
          <h2
            id="course-audience-heading"
            className="font-heading text-2xl text-balance font-semibold tracking-tight sm:text-3xl"
          >
            Who this course is <GradientText>for</GradientText>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Four seats at the table: solo founders, one-person-army builders,
            leads, and PMs.
          </p>
        </Reveal>
        <ul className="mt-12 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:gap-6">
          {courseAudienceCards.map((item, i) => {
            const Icon = item.icon;
            return (
              <li key={item.title}>
                <Reveal delay={i * 0.05} distance={14}>
                  <div className="flex h-full gap-4 rounded-2xl border border-border/60 bg-card/90 p-6 shadow-sm ring-1 ring-foreground/3 sm:p-7">
                    <span className={iconChipClass} aria-hidden>
                      <Icon
                        className="size-5 text-violet-600 dark:text-sky-400"
                        strokeWidth={1.75}
                      />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-heading text-lg font-semibold tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[15px] leading-[1.7] text-muted-foreground">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="relative w-full overflow-hidden py-16 sm:py-24">
        <SectionBackdrop tone="rose" heightClass="h-[min(480px,60vh)]" />
        <div className="relative grid gap-6 md:grid-cols-3 md:gap-8">
          {coursePromises.map((block, i) => {
            const Icon = block.icon;
            return (
              <Reveal
                key={block.title}
                delay={i * 0.06}
                className="space-y-4 rounded-3xl border border-border/50 bg-card/70 p-7 shadow-sm ring-1 ring-foreground/3"
              >
                <span className={iconChipClass} aria-hidden>
                  <Icon
                    className="size-5 text-violet-600 dark:text-sky-400"
                    strokeWidth={1.75}
                  />
                </span>
                <h2 className="font-heading text-xl font-semibold">
                  {block.title}
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  {block.body}
                </p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section
        id="syllabus"
        className="full-bleed scroll-mt-24 border-y border-border/50 bg-linear-to-b from-muted/35 to-muted/15"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <Reveal className="max-w-3xl space-y-4">
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Course <GradientText className="font-semibold">path</GradientText>
            </h2>
            <p className="text-muted-foreground">
              Six modules from the last seven years of practice to how teams
              will actually work with agents. Enrollment is still opening. This
              is the map.
            </p>
          </Reveal>
          <ol className="mt-12 grid list-none grid-cols-1 gap-6 p-0 lg:grid-cols-2 lg:gap-8">
            {courseModules.map((m, i) => {
              const Icon = m.icon;
              return (
                <li key={m.title}>
                  <Reveal delay={i * 0.04} distance={12} className="h-full">
                    <article className="flex h-full flex-col gap-4 rounded-3xl border border-border/70 bg-background px-6 py-6 shadow-sm ring-1 ring-foreground/4 sm:px-8">
                      <div className="flex items-start gap-4">
                        <span className={iconChipClass} aria-hidden>
                          <Icon
                            className="size-5 text-violet-600 dark:text-sky-400"
                            strokeWidth={1.75}
                          />
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-heading text-xl font-semibold text-foreground">
                            {m.title}
                          </h3>
                          <p className="font-mono text-xs font-semibold text-primary">
                            Module {m.n}
                          </p>
                        </div>
                      </div>
                      <p className="text-[15px] leading-relaxed text-muted-foreground">
                        {m.lede}
                      </p>
                      <ul className="mt-auto space-y-2 text-sm leading-relaxed text-muted-foreground">
                        {m.points.map((point) => (
                          <li key={point} className="flex gap-2">
                            <span
                              className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70"
                              aria-hidden
                            />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 sm:py-24">
        <SectionBackdrop tone="violet" heightClass="h-[min(360px,50vh)]" />
        <Reveal className="relative mx-auto max-w-3xl rounded-[2rem] border border-border/60 bg-card/80 px-6 py-10 text-center shadow-sm ring-1 ring-foreground/4 sm:px-12 sm:py-14">
          <span className={cn(iconChipClass, "mx-auto")} aria-hidden>
            <PenLineIcon
              className="size-5 text-violet-600 dark:text-sky-400"
              strokeWidth={1.75}
            />
          </span>
          <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {courseOutro.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {courseOutro.summary}
          </p>
          <p className="mt-6 font-heading text-lg font-semibold text-foreground sm:text-xl">
            {courseOutro.challenge}
          </p>
          <a
            href="#lead"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 inline-flex h-12 gap-2 rounded-md px-8 shadow-md shadow-primary/15",
            )}
          >
            Join the list
            <ArrowRightIcon className="size-4" />
          </a>
        </Reveal>
      </section>

      <CourseFaq />

      <Reveal>
        <section id="lead" className="scroll-mt-28 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl space-y-3 text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Get{" "}
              <GradientText className="font-semibold">notified</GradientText>
            </h2>
            <p className="text-lg text-muted-foreground">
              Add your email if you want a heads-up when enrollment opens. We
              keep it light.
            </p>
          </div>
          <div className="mt-10">
            <CourseLeadForm />
          </div>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Prefer reading first?{" "}
            <Link
              href="/blog"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Browse the blog
            </Link>{" "}
            or{" "}
            <Link
              href="/videos"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              watch curated videos
            </Link>
            .
          </p>
        </section>
      </Reveal>
    </div>
  );
}
