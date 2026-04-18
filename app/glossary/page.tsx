import type { Metadata } from "next";
import Link from "next/link";
import { GradientText } from "@/components/gradient-text";
import { Reveal } from "@/components/reveal";
import { glossaryTerms, getGlossaryTerm } from "@/lib/glossary-data";
import { keywordsForPage } from "@/lib/seo-keywords";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Definitions for spec driven development (SDD) and related terms: specs, acceptance criteria, traceability, and more.",
  keywords: keywordsForPage("glossary", "software terms", "PRD", "RFC"),
};

export default function GlossaryPage() {
  const sorted = [...glossaryTerms].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_70%_60%_at_50%_-30%,rgba(99,102,241,0.08),transparent_65%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal className="max-w-2xl space-y-4">
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            <GradientText className="font-semibold">Glossary</GradientText>
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Core vocabulary around spec driven development. Terms are short by design — use the blog for narratives and
            the course for a full workflow.
          </p>
        </Reveal>

        <ul className="mt-16 flex flex-col gap-8">
          {sorted.map((term, i) => (
            <li key={term.slug} id={term.slug} className="scroll-mt-28 list-none">
              <Reveal delay={(i % 5) * 0.04} distance={14}>
                <article className="rounded-[1.75rem] border border-border/60 bg-card/90 px-7 py-9 shadow-sm ring-1 ring-foreground/[0.04] backdrop-blur-sm sm:px-10">
                  <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">{term.title}</h2>
                  <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                    {term.shortDefinition}
                  </p>
                  {term.relatedSlugs && term.relatedSlugs.length > 0 ? (
                    <div className="mt-8 flex flex-wrap gap-2 border-t border-border/50 pt-8">
                      <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">See also</span>
                      <ul className="flex flex-wrap gap-2">
                        {term.relatedSlugs.map((slug) => {
                          const related = getGlossaryTerm(slug);
                          if (!related) return null;
                          return (
                            <li key={slug}>
                              <Link
                                href={`/glossary#${slug}`}
                                className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                              >
                                {related.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
