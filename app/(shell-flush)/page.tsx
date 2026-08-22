import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { HomeFaq } from "@/components/home-faq";
import { HeroFeaturedVideo } from "@/components/hero-featured-video";
import { HomeCourseCta } from "@/components/home-course-cta";
import { HomeEvolutionTimeline } from "@/components/home-evolution-timeline";
import { HomeIntentPillars } from "@/components/home-intent-pillars";
import { HomeIntentpoweredLoop } from "@/components/home-intentpowered-loop";
import { HomeLatestPostsCarousel } from "@/components/home-latest-posts-carousel";
import { HomePillars } from "@/components/home-pillars";
import { HomeVideosCarousel } from "@/components/home-videos-carousel";
import { GradientText } from "@/components/gradient-text";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import {
  blogCardAnons,
  blogCardPreviewImage,
  blogCardTitle,
  blogReadingTimeMinutes,
  getAllPosts,
} from "@/lib/blog";
import { metadataFromPageSeo, pageSeo } from "@/lib/seo-page-meta";
import { INTENTPOWERED_LOOP_ID } from "@/lib/intentpowered-loop";
import { featuredHeroVideo, videos } from "@/lib/videos-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = metadataFromPageSeo(pageSeo.home);

export default function HomePage() {
  const posts = getAllPosts().slice(0, 4);
  const latestItems = posts.map((post) => ({
    slug: post.meta.slug,
    title: blogCardTitle(post.meta),
    anons: blogCardAnons(post.meta),
    date: post.meta.date,
    readingMinutes: blogReadingTimeMinutes(post),
    imageSrc: blogCardPreviewImage(post) ?? null,
  }));

  const homeCarouselVideos = videos.slice(1, 5);

  return (
    <div className="flex flex-col">
      <section className="full-bleed relative overflow-hidden border-b border-border/50">
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-35%,rgba(99,102,241,0.16),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(14,165,233,0.1),transparent_50%)]"
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 pt-6 pb-8 sm:px-6 sm:pt-12 sm:pb-12">
          <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:gap-10">
            <Reveal className="min-w-0 flex-1 space-y-8" distance={28}>
              <h1 className="text-balance leading-[1.15] sm:leading-[1.12]">
                <GradientText className="font-semibold">
                  Build software from intent
                </GradientText>
                , not tickets or instructions.
              </h1>
              <div className="max-w-[65ch] space-y-8 text-pretty text-base leading-[1.7] text-muted-foreground lg:max-w-none">
                <p>
                  Start with the outcome you want to get. Turn that intent into
                  clear specs, build and ship fast, then validate it with real
                  users.
                </p>
              </div>
              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
                <Link
                  href="/course"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "inline-flex h-12 gap-2 rounded-md px-8 text-base shadow-md shadow-primary/15",
                  )}
                >
                  View course
                  <ArrowRightIcon className="size-4" />
                </Link>
                <Link
                  href={`#${INTENTPOWERED_LOOP_ID}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 rounded-md border-border/80 px-8 text-base justify-center sm:min-w-40",
                  )}
                >
                  Explore the framework
                </Link>
              </div>
            </Reveal>
            <Reveal
              className="relative w-full shrink-0 lg:max-w-lg"
              delay={0.08}
              distance={24}
            >
              <HeroFeaturedVideo video={featuredHeroVideo} />
            </Reveal>
          </div>
        </div>
      </section>

      <HomeIntentpoweredLoop />

      <HomeIntentPillars />

      <HomeEvolutionTimeline />

      <HomePillars />

      <HomeCourseCta />

      <div className="flex w-full flex-col gap-20 py-8 sm:gap-28 sm:py-12">
        <section className="space-y-8">
          <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Most popular from{" "}
                <GradientText className="font-semibold">
                  our content hub
                </GradientText>
              </h2>
              <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Articles about software best practices, SDLC and development
                workflows.
              </p>
            </div>
            <Link
              href="/blog"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "self-start rounded-md sm:self-auto",
              )}
            >
              All articles
              <ArrowRightIcon className="size-4" />
            </Link>
          </Reveal>
          <Reveal distance={18}>
            <HomeLatestPostsCarousel items={latestItems} />
          </Reveal>
        </section>
        <section className="space-y-8">
          <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Curated videos from{" "}
                <GradientText className="font-semibold">
                  our video library
                </GradientText>
              </h2>
              <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Short talks on AI-driven engineering and modern development
                workflows.
              </p>
            </div>
            <Link
              href="/videos"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "self-start rounded-md sm:self-auto",
              )}
            >
              All videos
              <ArrowRightIcon className="size-4" />
            </Link>
          </Reveal>
          <Reveal distance={18}>
            <HomeVideosCarousel videos={homeCarouselVideos} />
          </Reveal>
        </section>
      </div>

      <section
        id="faq"
        className="full-bleed border-y border-border/40 bg-linear-to-b from-muted/25 via-background to-muted/15 text-foreground dark:from-muted/10 dark:to-muted/5"
      >
        <Reveal>
          <HomeFaq />
        </Reveal>
      </section>
    </div>
  );
}
