export type VideoEntry = {
  id: string;
  title: string;
  youtubeId: string;
  channelTitle?: string;
  /** Display label; aligns with spec-taxonomy when v2 filters ship */
  category?: string;
};

/** Featured on the home hero (also listed on `/videos`). */
export const featuredHeroVideo: VideoEntry = {
  id: "intent-driven-engineering-evolution",
  title: "Intent-Driven Engineering: The Evolution of Software Architecture",
  youtubeId: "5VgLY-Mq7CY",
  channelTitle: "Вячеслав Млинський",
  category: "Product",
};

const curatedVideos: VideoEntry[] = [
  {
    id: "augment-sdd-workflow",
    title:
      "Spec-Driven Development Explained: The Workflow That Keeps AI Agents Aligned",
    youtubeId: "2XI-lO7ANYw",
    channelTitle: "Augment Code",
    category: "Build",
  },
  {
    id: "netninja-claude-spec-command",
    title: "Spec Driven Workflow with Claude Code #1 - Making a /spec Command",
    youtubeId: "e_D9M_MJ9Hs",
    channelTitle: "Net Ninja",
    category: "Build",
  },
  {
    id: "awesome-spec-workflow-mess",
    title: "The new spec-driven workflow is a mess...",
    youtubeId: "nnUMJX9013Y",
    channelTitle: "Awesome",
    category: "Build",
  },
  {
    id: "brian-casel-sdd-real-world",
    title: "Spec-Driven Development in the Real World",
    youtubeId: "3le-v1Pme44",
    channelTitle: "Brian Casel",
    category: "Build",
  },
  {
    id: "cesar-soto-sdd-future",
    title: "Is Spec-Driven Development the Future of Software Development?",
    youtubeId: "maIBlxGubeI",
    channelTitle: "César Soto Valero",
    category: "Build",
  },
  {
    id: "ibm-sdd-ai-assisted",
    title: "Spec-Driven Development: AI Assisted Coding Explained",
    youtubeId: "mViFYTwWvcM",
    channelTitle: "IBM Technology",
    category: "Build",
  },
  {
    id: "matt-pocock-7-phases-ai-driven-development",
    title: "The 7 phases of AI-driven development",
    youtubeId: "Ah9p7v7nJWg",
    channelTitle: "Matt Pocock",
    category: "Product",
  },
  {
    id: "executive-producer-intent-engineering-claudesim",
    title: "What is Intent Engineering? Tell AI What You Want, Not How | ClaudeSim",
    youtubeId: "P0wz1LHNHjo",
    channelTitle: "The Executive Producer",
    category: "Product",
  },
];

/** Curated SDD-related talks — edit `lib/videos-data.ts` to update */
export const videos: VideoEntry[] = [featuredHeroVideo, ...curatedVideos];

/**
 * YouTube static thumbnail URLs (no API key).
 * Order: max quality first — `maxresdefault` is often missing; caller should fall back.
 * @see https://img.youtube.com/vi/VIDEO_ID/{maxresdefault,sddefault,hqdefault,mqdefault,default}.jpg
 */
export function getYoutubeThumbnailUrls(videoId: string): string[] {
  return [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  ];
}
