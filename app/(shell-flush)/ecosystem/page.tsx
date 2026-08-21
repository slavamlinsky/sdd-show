import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { GradientText } from "@/components/gradient-text";
import { Reveal } from "@/components/reveal";
import { SectionBackdrop } from "@/components/section-backdrop";
import { ecosystemCategories, ecosystemMeta } from "@/lib/ecosystem-data";
import { metadataFromPageSeo, pageSeo } from "@/lib/seo-page-meta";
import { cn } from "@/lib/utils";

export const metadata: Metadata = metadataFromPageSeo(pageSeo.ecosystem);

const iconChipClass = cn(
  "flex size-11 shrink-0 items-center justify-center rounded-xl",
  "bg-linear-to-br from-violet-500/12 via-white to-sky-500/15 ring-1 ring-violet-500/15",
  "dark:from-violet-500/20 dark:via-card dark:to-sky-500/20 dark:ring-violet-400/20",
);

export default function EcosystemPage() {
  return (
    <div className="full-bleed relative overflow-hidden">
      <SectionBackdrop tone="sky" />
      <div className="relative mx-auto w-full max-w-6xl px-4 pt-6 pb-16 sm:px-6 sm:pt-12 sm:pb-24">
        <Reveal className="max-w-2xl space-y-4">
          <h1>
            {ecosystemMeta.titleLead}{" "}
            <GradientText className="font-semibold">
              {ecosystemMeta.titleAccent}
            </GradientText>
          </h1>
          <p className="leading-relaxed text-muted-foreground">
            {ecosystemMeta.lead}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {ecosystemMeta.aside}
          </p>
        </Reveal>

        <ul className="mt-12 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3 sm:gap-5">
          {ecosystemCategories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <li key={cat.id}>
                <Reveal delay={i * 0.05} distance={12} className="h-full">
                  <a
                    href={`#${cat.id}`}
                    className="flex h-full flex-col gap-3 rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm ring-1 ring-foreground/3 hover:border-border hover:bg-card hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    <div className="flex items-center gap-2 justify-between">
                      <div>
                        <h2 className="font-heading text-primary text-xl font-semibold tracking-tight sm:text-2xl">
                          {cat.title}
                        </h2>
                        <p className="text-sm font-medium text-foreground">
                          {cat.question}
                        </p>
                      </div>
                      <span className={iconChipClass} aria-hidden>
                        <Icon
                          className="size-5 text-violet-600 dark:text-sky-400"
                          strokeWidth={1.75}
                        />
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {cat.lead}
                    </p>
                  </a>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <div className="mt-20 space-y-20">
          {ecosystemCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <section
                key={cat.id}
                id={cat.id}
                aria-labelledby={`${cat.id}-heading`}
                className="scroll-mt-24"
              >
                <Reveal className="flex items-start gap-4">
                  <span className={iconChipClass} aria-hidden>
                    <Icon
                      className="size-5 text-violet-600 dark:text-sky-400"
                      strokeWidth={1.75}
                    />
                  </span>
                  <div>
                    <h2
                      id={`${cat.id}-heading`}
                      className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl"
                    >
                      {cat.title}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {cat.question}
                    </p>
                    <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                      {cat.lead}
                    </p>
                  </div>
                </Reveal>
                <ul className="mt-8 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.items.map((item) => (
                    <li key={item.name}>
                      <article className="flex h-full flex-col rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm ring-1 ring-foreground/3">
                        <h3 className="font-heading text-base font-semibold tracking-tight">
                          {item.name}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {item.blurb}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium">
                          {item.glossarySlug ? (
                            <Link
                              href={`/glossary#${item.glossarySlug}`}
                              className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                            >
                              <BookOpen className="size-3.5" aria-hidden />
                              Glossary
                            </Link>
                          ) : null}
                          {item.href ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                            >
                              Site
                              <ArrowUpRight className="size-3.5" aria-hidden />
                            </a>
                          ) : null}
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
