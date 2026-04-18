export type VideoEntry = {
  id: string;
  title: string;
  youtubeId: string;
  channelTitle?: string;
};

/** Curated placeholders — replace with your preferred SDD / software design talks */
export const videos: VideoEntry[] = [
  {
    id: "v1",
    title: "Introduction: why specs before code",
    youtubeId: "Ke90TjeKbVI",
    channelTitle: "Placeholder channel",
  },
  {
    id: "v2",
    title: "From fuzzy idea to testable acceptance criteria",
    youtubeId: "aircAruvnKk",
    channelTitle: "Placeholder channel",
  },
  {
    id: "v3",
    title: "Design docs that teams actually read",
    youtubeId: "M6EfzoKQFSs",
    channelTitle: "Placeholder channel",
  },
  {
    id: "v4",
    title: "Tracing requirements to implementation",
    youtubeId: "M7lc1UVf-VE",
    channelTitle: "Placeholder channel",
  },
  {
    id: "v5",
    title: "Living documents in fast-moving teams",
    youtubeId: "tgTczHdFOHI",
    channelTitle: "Placeholder channel",
  },
  {
    id: "v6",
    title: "API contracts and safe evolution",
    youtubeId: "vJFA9jqFp0U",
    channelTitle: "Placeholder channel",
  },
];

export function youtubeThumbUrl(youtubeId: string) {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}
