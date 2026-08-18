import type { Metadata } from "next";
import { Lightbulb } from "lucide-react";
import Link from "next/link";
import { GradientText } from "@/components/gradient-text";
import { GlossaryExplorer } from "@/components/glossary-explorer";
import { GlossarySuggestForm } from "@/components/glossary-suggest-form";
import { Reveal } from "@/components/reveal";
import { SectionBackdrop } from "@/components/section-backdrop";
import { buttonVariants } from "@/components/ui/button";
import { glossaryTerms } from "@/lib/glossary-data";
import { keywordsForPage } from "@/lib/seo-keywords";
import { getAuthUser } from "@/lib/supabase/server";
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
    "product marketing",
  ),
};

export default async function GlossaryPage({
  searchParams,
}: {
  searchParams: Promise<{ pillars?: string }>;
}) {
  const sorted = [...glossaryTerms].sort((a, b) =>
    a.title.localeCompare(b.title),
  );
  const user = await getAuthUser();
  const signedIn = Boolean(user?.email);
  const { pillars } = await searchParams;

  return (
    <div className="full-bleed relative overflow-hidden">
      <SectionBackdrop tone="violet" />
      <div className="relative mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 sm:pt-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <Reveal className="max-w-3xl space-y-4">
            <h1>
              <span className="text-foreground">Glossary &amp; </span>
              <GradientText className="font-semibold">
                Core Concepts
              </GradientText>
            </h1>
            <p className="leading-relaxed text-muted-foreground">
              Foundational vocabulary for the AI-driven product lifecycle:{" "}
              <span className="text-foreground/90">Product</span>,{" "}
              <span className="text-foreground/90">Design</span>,{" "}
              <span className="text-foreground/90">Build</span>, and{" "}
              <span className="text-foreground/90">Quality</span>. Definitions
              are kept short by design. Explore the blog for deep-dive
              narratives, watch our latest videos for visual insights, or enroll
              in our courses for a complete, end-to-end workflow.
            </p>
          </Reveal>
          <Reveal delay={0.04} className="shrink-0">
            <Link
              href="#suggest-term"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border-primary/25 bg-accent/80 px-6 text-sm font-semibold text-primary shadow-sm backdrop-blur-sm hover:bg-primary/5 sm:w-auto",
              )}
            >
              <Lightbulb className="size-4 shrink-0" aria-hidden />
              Suggest something new
            </Link>
          </Reveal>
        </div>

        <Reveal distance={14}>
          <GlossaryExplorer terms={sorted} initialPillars={pillars ?? null} />
        </Reveal>

        <section
          id="suggest-term"
          className="relative mt-20 mb-20 overflow-hidden rounded-[1.75rem] border border-border/60 bg-linear-to-br from-primary/6 via-muted/30 to-sky-500/5 px-6 py-10 shadow-sm ring-1 ring-foreground/4 sm:mb-24 sm:px-10 lg:mb-28"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_70%)]"
            aria-hidden
          />
          <div className="relative space-y-6">
            <div className="mx-auto max-w-lg text-center">
              <h2 className="font-heading text-xl font-semibold gradient-text-fill sm:text-3xl">
                Suggest new term
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                If any term you often use is missing, add its name and a short
                definition. We review every suggestion; nothing is published
                until it is approved.
              </p>
            </div>
            <GlossarySuggestForm signedIn={signedIn} />
          </div>
        </section>
      </div>
    </div>
  );
}
