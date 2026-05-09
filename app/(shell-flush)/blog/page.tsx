import type { Metadata } from "next";
import Image from "next/image";
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
import {
  blogCardAnons,
  blogCardPreviewImage,
  blogCardTitle,
  blogReadingTimeMinutes,
  getAllPosts,
} from "@/lib/blog";
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

        <ul className="relative mt-16 flex flex-col gap-6">
          {posts.map((post, i) => {
            const { meta } = post;
            const previewSrc = blogCardPreviewImage(post);
            const href = `/blog/${meta.slug}`;
            return (
              <li key={meta.slug} className="list-none">
                <Reveal delay={i * 0.05} distance={14}>
                  <Card className="overflow-hidden px-4 md:px-6 rounded-2xl border-border/60 shadow-sm ring-1 ring-foreground/[0.04] transition-shadow hover:shadow-md sm:rounded-[1.75rem]">
                    <div className="flex flex-col sm:flex-row sm:items-stretch">
                      {previewSrc ? (
                        <Link
                          href={href}
                          className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted/40 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring sm:aspect-auto sm:w-44 md:w-72 sm:min-h-[11rem]"
                          aria-label={`Open article: ${blogCardTitle(meta)}`}
                        >
                          <Image
                            src={previewSrc}
                            alt={`“${blogCardTitle(meta)}”`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 288px"
                          />
                        </Link>
                      ) : null}
                      <CardHeader className="flex flex-1 flex-col gap-3 p-6 sm:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                          <time dateTime={meta.date}>
                            {new Date(meta.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </time>
                          <BlogReadingTime
                            minutes={blogReadingTimeMinutes(post)}
                            className="text-muted-foreground"
                          />
                        </div>
                        <CardTitle className="font-heading text-2xl leading-snug">
                          <Link href={href} className="hover:text-primary">
                            {blogCardTitle(meta)}
                          </Link>
                        </CardTitle>
                        <CardDescription className="text-[15px] leading-relaxed sm:text-base">
                          {blogCardAnons(meta)}
                        </CardDescription>
                        <Link
                          href={href}
                          className={cn(
                            buttonVariants({ variant: "link" }),
                            "h-auto p-0 text-base font-semibold text-primary",
                          )}
                        >
                          Read full article →
                        </Link>
                      </CardHeader>
                    </div>
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
