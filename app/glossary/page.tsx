import type { Metadata } from "next";
import { Lightbulb } from "lucide-react";
import Link from "next/link";
import { GradientText } from "@/components/gradient-text";
import { Reveal } from "@/components/reveal";
import { SectionBackdrop } from "@/components/section-backdrop";
import { Badge } from "@/components/ui/badge";
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
            <p className="text-lg leading-relaxed text-muted-foreground">
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

        <ul className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-10">
          {sorted.map((term, i) => (
            <li key={term.slug} id={term.slug} className="scroll-mt-28 list-none">
              <Reveal delay={(i % 5) * 0.04} distance={14}>
                <article className="rounded-[1.75rem] border border-border/60 bg-card/90 px-7 py-9 shadow-sm ring-1 ring-foreground/[0.04] backdrop-blur-sm sm:px-10">
                  <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">{term.title}</h2>
                  <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Pillars">
                    {term.categories.map((label) => (
                      <li key={label}>
                        <Badge variant="outline" size="xs">
                          {label}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground">
                    {term.shortDefinition}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        <section
          id="suggest-term"
          className="relative mt-20 overflow-hidden rounded-[1.75rem] border border-border/60 bg-gradient-to-br from-primary/[0.06] via-muted/30 to-sky-500/[0.05] px-6 py-10 shadow-sm ring-1 ring-foreground/[0.04] sm:px-10"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_70%)]"
            aria-hidden
          />
          <div className="relative space-y-3 text-center">
            <h2 className="font-heading text-lg font-semibold tracking-tight sm:text-xl">Suggest a term or fix</h2>
            <p className="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              A lightweight submission flow (and moderation) is planned for{" "}
              <span className="font-medium text-foreground">v2</span>. For now, this anchor is reserved for that feature — see the glossary spec.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
