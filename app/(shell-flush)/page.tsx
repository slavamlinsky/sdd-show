import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { HomeFaq } from "@/components/home-faq";
import { HomePillars } from "@/components/home-pillars";
import { GradientText } from "@/components/gradient-text";
import { Reveal } from "@/components/reveal";
import { SectionBackdrop } from "@/components/section-backdrop";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllPosts } from "@/lib/blog";
import { keywordsForPage } from "@/lib/seo-keywords";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: siteConfig.title },
  description: siteConfig.description,
  keywords: keywordsForPage("software engineering", "documentation", "agile"),
};

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="flex flex-col">
      <section className="full-bleed relative overflow-hidden border-b border-border/50">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-35%,rgba(99,102,241,0.16),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(14,165,233,0.1),transparent_50%)]"
          aria-hidden
        />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20 sm:gap-16 sm:px-6 sm:py-28 lg:flex-row lg:items-center lg:gap-16">
          <Reveal className="flex-1 space-y-8" distance={28}>
            <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              For students and developers
            </p>
            <h1 className="text-balance lg:text-[3.35rem] lg:leading-[1.08]">
              Ship software from{" "}
              <GradientText className="font-semibold">clear specs</GradientText>, not vague tickets.
            </h1>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-[1.125rem]">
              Spec driven development (SDD) means defining behavior and acceptance before you code yourself into a
              corner. Learn the ideas, vocabulary, and a workflow you can use on real projects.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <Link
                href="/course"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "inline-flex h-12 gap-2 rounded-md px-8 text-base shadow-md shadow-primary/15"
                )}
              >
                View course
                <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                href="/glossary"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 rounded-md border-border/80 px-8 text-base justify-center sm:min-w-[10rem]"
                )}
              >
                Open glossary
              </Link>
            </div>
          </Reveal>
          <Reveal className="relative w-full shrink-0 lg:max-w-lg" delay={0.08} distance={24}>
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-xl shadow-foreground/5 ring-1 ring-foreground/[0.04]">
              <Image
                src="/images/hero-placeholder.svg"
                alt="Abstract placeholder illustration for spec driven development"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <HomePillars />

      <div className="flex w-full flex-col gap-20 py-20 sm:gap-28 sm:py-28">
        <section className="relative overflow-hidden rounded-[2rem] border border-border/40 py-8 sm:py-10">
          <SectionBackdrop tone="emerald" heightClass="h-[min(420px,55vh)]" />
          <Reveal className="relative px-2 sm:px-4">
            <HomeFaq />
          </Reveal>
        </section>

        <section className="space-y-8">
          <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                From the <GradientText className="font-semibold">blog</GradientText>
              </h2>
              <p className="max-w-prose text-lg text-muted-foreground">
                Short reads on SDD. New posts land here as we grow the library.
              </p>
            </div>
            <Link
              href="/blog"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "self-start rounded-md sm:self-auto"
              )}
            >
              All articles
              <ArrowRightIcon className="size-4" />
            </Link>
          </Reveal>
          <ul className="grid gap-6 md:grid-cols-3">
            {posts.map(({ meta }, i) => (
              <li key={meta.slug}>
                <Reveal delay={i * 0.06} distance={16}>
                  <Card className="h-full rounded-3xl border-border/70 shadow-sm ring-1 ring-foreground/[0.03] transition-shadow hover:shadow-md">
                    <CardHeader className="gap-3">
                      <time
                        className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                        dateTime={meta.date}
                      >
                        {new Date(meta.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                      <CardTitle className="font-heading text-lg leading-snug">
                        <Link href={`/blog/${meta.slug}`} className="hover:text-primary">
                          {meta.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-[15px] leading-relaxed">
                        {meta.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Link
                        href={`/blog/${meta.slug}`}
                        className="inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        Read article
                      </Link>
                    </CardContent>
                  </Card>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <Reveal>
          <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-br from-amber-500/[0.08] via-muted/45 to-violet-500/[0.06] px-8 py-12 shadow-sm ring-1 ring-foreground/[0.04] sm:px-10 sm:py-14">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">Video library</h2>
                <p className="max-w-xl text-lg text-muted-foreground">
                  Curated talks and explainers. Watch on the site without tab hopping.
                </p>
              </div>
              <Link
                href="/videos"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "h-12 rounded-md px-8 text-base shrink-0"
                )}
              >
                Browse videos
              </Link>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
