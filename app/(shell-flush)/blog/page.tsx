import type { Metadata } from "next";
import Link from "next/link";
import { BlogReadingTime } from "@/components/blog-reading-time";
import { GradientText } from "@/components/gradient-text";
import { Reveal } from "@/components/reveal";
import { SectionBackdrop } from "@/components/section-backdrop";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { blogCardAnons, blogCardTitle, blogReadingTimeMinutes, getAllPosts } from "@/lib/blog";
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
    <div className="full-bleed relative overflow-hidden">
      <SectionBackdrop tone="sky" />
      <div className="relative mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 sm:pt-12">
        <Reveal className="max-w-2xl space-y-4">
          <h1>
            Our <GradientText>AI-driven blog</GradientText>
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Short posts and useful articles about modern software development. Ideal if you are learning the basics or pitching clearer practices to your team.
          </p>
        </Reveal>

        <ul className="relative mt-16 flex flex-col gap-6 rounded-[2rem] border border-border/40 bg-gradient-to-b from-rose-500/[0.05] via-muted/15 to-transparent px-4 py-8 sm:px-8 sm:py-10">
          {posts.map((post, i) => {
            const { meta } = post;
            return (
            <li key={meta.slug} className="list-none">
              <Reveal delay={i * 0.05} distance={14}>
                <Card className="rounded-[1.75rem] border-border/60 shadow-sm ring-1 ring-foreground/[0.04] transition-shadow hover:shadow-md">
                  <CardHeader className="gap-3 p-7 sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      <time dateTime={meta.date}>
                        {new Date(meta.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      <BlogReadingTime minutes={blogReadingTimeMinutes(post)} className="text-muted-foreground" />
                    </div>
                    <CardTitle className="font-heading text-2xl leading-snug">
                      <Link href={`/blog/${meta.slug}`} className="hover:text-primary">
                        {blogCardTitle(meta)}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-[15px] leading-relaxed sm:text-base">
                      {blogCardAnons(meta)}
                    </CardDescription>
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
            );
          })}
        </ul>
      </div>
    </div>
  );
}
