import {
  allPillarsOn,
  parsePillarsQuery,
  serializePillarsQuery,
} from "@/lib/glossary-filter";
import { PILLARS, type Pillar } from "@/lib/taxonomy";
import type { VideoEntry } from "@/lib/videos-data";

export { allPillarsOn, parsePillarsQuery, serializePillarsQuery };

export function filterVideos(
  videos: VideoEntry[],
  query: string,
  pillarsOn: Set<Pillar>,
): VideoEntry[] {
  const q = query.trim().toLowerCase();
  const allOn = pillarsOn.size === PILLARS.length;

  return videos.filter((video) => {
    if (video.category) {
      if (!pillarsOn.has(video.category as Pillar)) return false;
    } else if (!allOn) {
      return false;
    }
    if (!q) return true;
    return (
      video.title.toLowerCase().includes(q) ||
      (video.channelTitle?.toLowerCase().includes(q) ?? false) ||
      (video.category?.toLowerCase().includes(q) ?? false)
    );
  });
}
