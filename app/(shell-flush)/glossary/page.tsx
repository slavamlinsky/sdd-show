import type { Metadata } from "next";
import { ArrowRightIcon, Lightbulb } from "lucide-react";
import Link from "next/link";
import { GradientText } from "@/components/gradient-text";
import { Reveal } from "@/components/reveal";
import { SectionBackdrop } from "@/components/section-backdrop";
import { GlossaryAccordion } from "@/components/glossary-accordion";
import { buttonVariants } from "@/components/ui/button";
import { glossaryTerms } from "@/lib/glossary-data";
import { keywordsForPage } from "@/lib/seo-keywords";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Glossary & Core Concepts",
  description:
    "Foundational vocabulary for the AI-driven product lifecycle: Product, Design, Build, and Quality. Short definitions; deep-dive narratives on the blog, videos for visual insights, and courses for end-to-end workflow.",
  keywords: keywordsForPage(
    "glossary",
    "SDD",
    "AI development",
    "prompt engineering",
    "product marketing"
  ),
};

export default function GlossaryPage() {
  const sorted = [...glossaryTerms].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="full-bleed relative overflow-hidden">
      <SectionBackdrop tone="violet" />
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <Reveal className="max-w-3xl space-y-4">
            <h1>
              <GradientText className="font-semibold">Glossary</GradientText>
              <span className="text-foreground"> &amp; Core Concepts</span>
            </h1>
            <p className="leading-relaxed text-muted-foreground">
              Foundational vocabulary for the AI-driven product lifecycle:{" "}
              <span className="text-foreground/90">Product</span>, <span className="text-foreground/90">Design</span>,{" "}
              <span className="text-foreground/90">Build</span>, and <span className="text-foreground/90">Quality</span>.
              Definitions are kept short by design. Explore the blog for deep-dive narratives, watch our latest videos for
              visual insights, or enroll in our courses for a complete, end-to-end workflow.
            </p>
          </Reveal>
          <Reveal delay={0.04} className="shrink-0">
            <Link
              href="#suggest-term"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border-primary/25 bg-background/80 px-6 text-sm font-semibold text-primary shadow-sm backdrop-blur-sm hover:bg-primary/5 sm:w-auto"
              )}
            >
              <Lightbulb className="size-4 shrink-0" aria-hidden />
              Suggest something new
            </Link>
          </Reveal>
        </div>

        <Reveal distance={14}>
          <GlossaryAccordion terms={sorted} />
        </Reveal>

        <section
          id="suggest-term"
          className="relative mt-20 mb-20 overflow-hidden rounded-[1.75rem] border border-border/60 bg-gradient-to-br from-primary/[0.06] via-muted/30 to-sky-500/[0.05] px-6 py-10 shadow-sm ring-1 ring-foreground/[0.04] sm:mb-24 sm:px-10 lg:mb-28"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_70%)]"
            aria-hidden
          />
          <div className="relative flex flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-lg font-semibold tracking-tight sm:text-xl">Suggest a term or fix</h2>
            <p className="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              A lightweight submission flow (and moderation) is planned for{" "}
              <span className="font-medium text-foreground">v2</span>. For now, this anchor is reserved for that feature — see the glossary spec.
            </p>
            <Link
              href="https://github.com/slavamlinsky/sdd-show/blob/main/docs/specs/spec-glossary.md"
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-2 inline-flex h-12 items-center gap-2 rounded-xl px-8 text-base font-semibold shadow-md shadow-primary/20 hover:shadow-primary/25"
              )}
            >
              Read the glossary spec
              <ArrowRightIcon className="size-4 shrink-0" aria-hidden />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
