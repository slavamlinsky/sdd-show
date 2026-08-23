import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { SectionBackdrop } from "@/components/section-backdrop";
import { GradientText } from "@/components/gradient-text";
import { VideoGrid } from "@/components/video-grid";
import { metadataFromPageSeo, pageSeo } from "@/lib/seo-page-meta";
import { videos } from "@/lib/videos-data";

export const metadata: Metadata = metadataFromPageSeo(pageSeo.videos);

export default function VideosPage() {
  return (
    <div className="full-bleed relative overflow-hidden">
      <SectionBackdrop tone="emerald" />
      <div className="relative mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 sm:pt-12">
        <Reveal className="relative max-w-3xl space-y-4">
          <h1>
            Curated{" "}
            <GradientText className="font-semibold">videos</GradientText>
          </h1>
          <p className="leading-relaxed text-muted-foreground">
            Hand-picked videos on software development and building better
            products. Learn from practical explainers, expert talks, and
            real-world examples. Discover new AI tools, modern workflows,
            methodologies, and useful ideas for building and launching startups.
          </p>
        </Reveal>
        <Reveal className="relative mt-14" delay={0.06}>
          <VideoGrid videos={videos} />
        </Reveal>
      </div>
    </div>
  );
}
