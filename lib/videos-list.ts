import type { VideoEntry } from "@/lib/videos-data";

export const VIDEO_PAGE_SIZES = [6, 12, 24, 48] as const;
export type VideoPageSize = (typeof VIDEO_PAGE_SIZES)[number];
export const DEFAULT_VIDEO_PAGE_SIZE: VideoPageSize = 12;

export const VIDEO_SORTS = [
  "featured",
  "newest",
  "title-asc",
  "title-desc",
] as const;
export type VideoSort = (typeof VIDEO_SORTS)[number];
export const DEFAULT_VIDEO_SORT: VideoSort = "newest";

export const VIDEO_SORT_LABELS: Record<VideoSort, string> = {
  featured: "Featured",
  newest: "Newest",
  "title-asc": "Title A–Z",
  "title-desc": "Title Z–A",
};

export function parseVideoSortQuery(
  value: string | null | undefined,
): VideoSort {
  if (value && (VIDEO_SORTS as readonly string[]).includes(value)) {
    return value as VideoSort;
  }
  return DEFAULT_VIDEO_SORT;
}

export function parseVideoPageSizeQuery(
  value: string | null | undefined,
): VideoPageSize {
  const n = Number(value);
  if ((VIDEO_PAGE_SIZES as readonly number[]).includes(n)) {
    return n as VideoPageSize;
  }
  return DEFAULT_VIDEO_PAGE_SIZE;
}

export function parseVideoPageQuery(value: string | null | undefined): number {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
}

export function buildVideoOrderIndex(
  videos: VideoEntry[],
): Map<string, number> {
  return new Map(videos.map((video, index) => [video.id, index]));
}

export function sortVideos(
  videos: VideoEntry[],
  sort: VideoSort,
  orderIndex: Map<string, number>,
): VideoEntry[] {
  const sorted = [...videos];
  const byIndex = (a: VideoEntry, b: VideoEntry) =>
    (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0);

  switch (sort) {
    case "featured":
      return sorted.sort(byIndex);
    case "newest":
      return sorted.sort((a, b) => byIndex(b, a));
    case "title-asc":
      return sorted.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
      );
    case "title-desc":
      return sorted.sort((a, b) =>
        b.title.localeCompare(a.title, undefined, { sensitivity: "base" }),
      );
  }
}

export type PaginatedVideos<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  rangeStart: number;
  rangeEnd: number;
};

export function paginateVideos<T>(
  items: T[],
  page: number,
  pageSize: number,
): PaginatedVideos<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const clampedPage = Math.min(Math.max(1, page), totalPages);
  const start = (clampedPage - 1) * pageSize;
  const end = Math.min(start + pageSize, totalItems);

  return {
    items: items.slice(start, end),
    page: clampedPage,
    pageSize,
    totalPages,
    totalItems,
    rangeStart: totalItems === 0 ? 0 : start + 1,
    rangeEnd: end,
  };
}
