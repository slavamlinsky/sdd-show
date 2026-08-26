import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { SectionBackdrop } from "@/components/section-backdrop";
import { GradientText } from "@/components/gradient-text";
import { VideosExplorer } from "@/components/videos-explorer";
import { VideosHeaderActions } from "@/components/videos-header-actions";
import { metadataFromPageSeo, pageSeo } from "@/lib/seo-page-meta";
import { getAuthUser } from "@/lib/supabase/server";
import { videos } from "@/lib/videos-data";
import { getVideoUpdatesSubscription } from "@/lib/videos-subscribe";

export const metadata: Metadata = metadataFromPageSeo(pageSeo.videos);

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<{
    pillars?: string;
    subscribe?: string;
    page?: string;
    per?: string;
  }>;
}) {
  const { pillars, subscribe, page, per } = await searchParams;
  const user = await getAuthUser();
  const signedIn = Boolean(user?.email);
  const subscribeIntent = signedIn && subscribe === "1";

  const initiallySubscribed = signedIn
    ? await getVideoUpdatesSubscription()
    : false;

  return (
    <div className="full-bleed relative overflow-hidden">
      <SectionBackdrop tone="emerald" />
      <div className="relative mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 sm:pt-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <Reveal className="max-w-3xl space-y-4">
            <h1>
              Curated{" "}
              <GradientText className="font-semibold">videos</GradientText>
            </h1>
            <p className="leading-relaxed text-muted-foreground">
              Hand-picked videos on software development and building better
              products. Learn from practical explainers, expert talks, and
              real-world examples. Discover new AI tools, modern workflows,
              methodologies, and useful ideas for building and launching
              startups.
            </p>
          </Reveal>
          <Reveal delay={0.04}>
            <VideosHeaderActions
              signedIn={signedIn}
              initiallySubscribed={initiallySubscribed}
              subscribeIntent={subscribeIntent}
            />
          </Reveal>
        </div>
        <Reveal className="relative" delay={0.06}>
          <VideosExplorer
            videos={videos}
            initialPillars={pillars ?? null}
            initialPage={page ?? null}
            initialPer={per ?? null}
          />
        </Reveal>
      </div>
    </div>
  );
}
