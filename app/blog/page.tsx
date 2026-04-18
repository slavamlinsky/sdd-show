import type { Metadata } from "next";
import Link from "next/link";
import { GradientText } from "@/components/gradient-text";
import { Reveal } from "@/components/reveal";
import { SectionBackdrop } from "@/components/section-backdrop";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllPosts } from "@/lib/blog";
import { keywordsForPage } from "@/lib/seo-keywords";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles about spec driven development: workflows, vocabulary, and practical tips for teams and solo builders.",
  keywords: keywordsForPage("blog", "SDD articles", "software workflow"),
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="relative overflow-hidden">
      <SectionBackdrop tone="sky" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal className="max-w-2xl space-y-4">
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            SDD <GradientText className="font-semibold">blog</GradientText>
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Short posts on SDD — ideal if you are learning the basics or pitching clearer practices to your team.
          </p>
        </Reveal>

        <ul className="relative mt-16 flex flex-col gap-6 rounded-[2rem] border border-border/40 bg-gradient-to-b from-rose-500/[0.05] via-muted/15 to-transparent px-4 py-8 sm:px-8 sm:py-10">
          {posts.map(({ meta }, i) => (
            <li key={meta.slug} className="list-none">
              <Reveal delay={i * 0.05} distance={14}>
                <Card className="rounded-[1.75rem] border-border/60 shadow-sm ring-1 ring-foreground/[0.04] transition-shadow hover:shadow-md">
                  <CardHeader className="gap-3 p-7 sm:p-8">
                    <time className="text-xs font-semibold tracking-wide text-muted-foreground uppercase" dateTime={meta.date}>
                      {new Date(meta.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <CardTitle className="font-heading text-2xl leading-snug">
                      <Link href={`/blog/${meta.slug}`} className="hover:text-primary">
                        {meta.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-[15px] leading-relaxed sm:text-base">{meta.description}</CardDescription>
                    <Link
                      href={`/blog/${meta.slug}`}
                      className={cn(
                        buttonVariants({ variant: "link" }),
                        "h-auto p-0 text-base font-semibold text-primary"
                      )}
                    >
                      Read full article →
                    </Link>
                  </CardHeader>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
