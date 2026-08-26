"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { VideoGrid } from "@/components/video-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PILLAR_FILTER_ORDER, PILLAR_UI } from "@/lib/pillar-ui";
import type { Pillar } from "@/lib/taxonomy";
import type { VideoEntry } from "@/lib/videos-data";
import {
  allPillarsOn,
  filterVideos,
  parsePillarsQuery,
  serializePillarsQuery,
} from "@/lib/videos-filter";
import {
  buildVideoOrderIndex,
  DEFAULT_VIDEO_PAGE_SIZE,
  DEFAULT_VIDEO_SORT,
  paginateVideos,
  parseVideoPageQuery,
  parseVideoPageSizeQuery,
  sortVideos,
  VIDEO_PAGE_SIZES,
  type VideoPageSize,
} from "@/lib/videos-list";
import { cn } from "@/lib/utils";

const SEARCH_DEBOUNCE_MS = 250;

const perPageTriggerClass = cn(
  "h-9 min-w-[6.5rem] gap-1.5 rounded-md border-border/80 bg-background px-2.5 text-sm text-foreground shadow-none",
  "hover:bg-muted/60 data-popup-open:bg-muted/60",
  "dark:bg-card dark:hover:bg-muted/40",
);

const perPageContentClass =
  "rounded-md font-sans shadow-md ring-1 ring-foreground/10";

type Props = {
  videos: VideoEntry[];
  initialPillars?: string | null;
  initialPage?: string | null;
  initialPer?: string | null;
};

function countLabel(
  filteredTotal: number,
  catalogTotal: number,
  rangeStart: number,
  rangeEnd: number,
): string {
  if (filteredTotal === 0) {
    return filteredTotal === catalogTotal
      ? "0 videos"
      : `0 of ${catalogTotal} videos`;
  }
  if (filteredTotal === catalogTotal) {
    return rangeStart === rangeEnd
      ? `${rangeStart} of ${catalogTotal} videos`
      : `${rangeStart}–${rangeEnd} of ${catalogTotal} videos`;
  }
  return rangeStart === rangeEnd
    ? `${rangeStart} of ${filteredTotal} matching videos (${catalogTotal} total)`
    : `${rangeStart}–${rangeEnd} of ${filteredTotal} matching videos (${catalogTotal} total)`;
}

export function VideosExplorer({
  videos,
  initialPillars = null,
  initialPage = null,
  initialPer = null,
}: Props) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [pillarsOn, setPillarsOn] = useState<Set<Pillar>>(
    () => parsePillarsQuery(initialPillars) ?? allPillarsOn(),
  );
  const [page, setPage] = useState(() => parseVideoPageQuery(initialPage));
  const [pageSize, setPageSize] = useState<VideoPageSize>(() =>
    parseVideoPageSizeQuery(initialPer),
  );

  const orderIndex = useMemo(() => buildVideoOrderIndex(videos), [videos]);
  const skipPageReset = useRef(true);

  useEffect(() => {
    const id = window.setTimeout(
      () => setDebouncedQuery(query),
      SEARCH_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(id);
  }, [query]);

  useEffect(() => {
    if (skipPageReset.current) {
      skipPageReset.current = false;
      return;
    }
    setPage(1);
  }, [debouncedQuery, pillarsOn, pageSize]);

  function togglePillar(pillar: Pillar) {
    setPillarsOn((current) => {
      const next = new Set(current);
      if (next.has(pillar)) {
        if (next.size === 1) return allPillarsOn();
        next.delete(pillar);
        return next;
      }
      next.add(pillar);
      return next;
    });
  }

  const filtered = useMemo(
    () => filterVideos(videos, debouncedQuery, pillarsOn),
    [videos, debouncedQuery, pillarsOn],
  );

  const sorted = useMemo(
    () => sortVideos(filtered, DEFAULT_VIDEO_SORT, orderIndex),
    [filtered, orderIndex],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const effectivePage = Math.min(Math.max(1, page), totalPages);

  const paged = useMemo(
    () => paginateVideos(sorted, effectivePage, pageSize),
    [sorted, effectivePage, pageSize],
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    const serialized = serializePillarsQuery(pillarsOn);
    if (serialized) url.searchParams.set("pillars", serialized);
    else url.searchParams.delete("pillars");

    url.searchParams.delete("sort");

    if (pageSize === DEFAULT_VIDEO_PAGE_SIZE) url.searchParams.delete("per");
    else url.searchParams.set("per", String(pageSize));

    if (effectivePage <= 1) url.searchParams.delete("page");
    else url.searchParams.set("page", String(effectivePage));

    window.history.replaceState(
      null,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, [pillarsOn, effectivePage, pageSize]);

  const summary = countLabel(
    filtered.length,
    videos.length,
    paged.rangeStart,
    paged.rangeEnd,
  );

  return (
    <div className="mt-8">
      <div
        id="video-filters"
        className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-8"
      >
        <div className="relative min-w-0 w-full lg:w-1/2">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos…"
            aria-label="Search videos"
            className="h-11 rounded-xl bg-white pr-10 pl-10 shadow-sm dark:bg-card"
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-2.5 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>

        <div
          className="grid w-full grid-cols-4 gap-2 lg:w-1/2 lg:gap-4"
          role="group"
          aria-label="Filter by topic"
        >
          {PILLAR_FILTER_ORDER.map((pillar) => {
            const on = pillarsOn.has(pillar);
            const { icon: Icon, idle, active } = PILLAR_UI[pillar];
            return (
              <button
                key={pillar}
                type="button"
                aria-pressed={on}
                onClick={() => togglePillar(pillar)}
                className={cn(
                  "flex min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 text-[11px] font-semibold shadow-sm transition-all sm:flex-row sm:gap-1.5 sm:text-xs",
                  on ? active : `${idle} opacity-55 grayscale-[0.35]`,
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="truncate">{pillar}</span>
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p
          className="mt-10 text-center text-sm text-muted-foreground"
          role="status"
        >
          No videos match this search and topic mix. Try another query or turn
          more topics on.
        </p>
      ) : (
        <>
          <div className="mt-6">
            <VideoGrid videos={paged.items} />
          </div>

          <footer
            className="mb-12 mt-10 border-t border-border/60 pt-6"
            aria-label="Video list pagination"
          >
            <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr] w-full mx-auto max-w-5xl">
              <p
                className="text-sm text-muted-foreground sm:justify-self-start"
                role="status"
              >
                {summary}
              </p>

              {paged.totalPages > 1 ? (
                <nav
                  className="flex items-center justify-center gap-1 sm:justify-self-center"
                  aria-label="Video pages"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 gap-1 px-2.5"
                    disabled={paged.page <= 1}
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
                  >
                    <ChevronLeft className="size-4" aria-hidden />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  <span className="min-w-28 px-1 text-center text-sm tabular-nums text-muted-foreground">
                    Page {paged.page} of {paged.totalPages}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 gap-1 px-2.5"
                    disabled={paged.page >= paged.totalPages}
                    onClick={() =>
                      setPage((current) =>
                        Math.min(paged.totalPages, current + 1),
                      )
                    }
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="size-4" aria-hidden />
                  </Button>
                </nav>
              ) : (
                <div className="hidden sm:block" aria-hidden />
              )}

              <div className="flex justify-end sm:justify-self-end">
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => {
                    if (value) {
                      setPageSize(parseVideoPageSizeQuery(value));
                    }
                  }}
                >
                  <SelectTrigger
                    className={perPageTriggerClass}
                    aria-label={`Show ${pageSize} videos per page`}
                  >
                    <SelectValue placeholder="Per page" />
                  </SelectTrigger>
                  <SelectContent
                    align="end"
                    sideOffset={6}
                    className={perPageContentClass}
                  >
                    {VIDEO_PAGE_SIZES.map((size) => (
                      <SelectItem
                        key={size}
                        value={String(size)}
                        className="cursor-pointer rounded-sm"
                      >
                        {size} per page
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
