import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { SectionBackdrop } from "@/components/section-backdrop";
import { GradientText } from "@/components/gradient-text";
import { VideoGrid } from "@/components/video-grid";
import { keywordsForPage } from "@/lib/seo-keywords";
import { videos } from "@/lib/videos-data";

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Hand-picked YouTube videos on AI in software: agents, intent, tools, and how teams ship — wider than specs alone. Play in page with one click.",
  keywords: keywordsForPage(
    "videos",
    "AI engineering",
    "LLM agents",
    "AI-assisted development",
    "YouTube",
  ),
};

export default function VideosPage() {
  return (
    <div className="full-bleed relative overflow-hidden">
      <SectionBackdrop tone="emerald" />
      <div className="relative mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 sm:pt-12">
        <Reveal className="relative max-w-2xl space-y-4">
          <h1>
            Curated <GradientText className="font-semibold">videos</GradientText>
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Explainers and keynotes on AI tools, agent workflows, and engineering practice — not only spec-driven
            development. Click a card to play in a modal — swap the list in the codebase when you find better
            references.
          </p>
        </Reveal>
        <Reveal className="relative mt-14" delay={0.06}>
          <VideoGrid videos={videos} />
        </Reveal>
      </div>
    </div>
  );
}
