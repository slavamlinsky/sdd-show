import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { GradientText } from "@/components/gradient-text";
import { VideoGrid } from "@/components/video-grid";
import { videos } from "@/lib/videos-data";

export const metadata: Metadata = {
  title: "Videos",
  description: "Curated YouTube videos about spec driven development and related ideas — watch in place.",
};

export default function VideosPage() {
  return (
    <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.11),transparent_65%)]"
        aria-hidden
      />
      <Reveal className="relative max-w-2xl space-y-4">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Curated <GradientText className="font-semibold">videos</GradientText>
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Hand-picked explainers and talks. Click a card to play in a modal — swap the list in the codebase when you
          find better references.
        </p>
      </Reveal>
      <Reveal className="relative mt-14" delay={0.06}>
        <VideoGrid videos={videos} />
      </Reveal>
    </div>
  );
}
