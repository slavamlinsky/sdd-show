"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from "lucide-react";
import type { VideoEntry } from "@/lib/videos-data";
import { YoutubePoster } from "@/components/youtube-poster";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getActiveCarouselPageIndex,
  getCarouselPageCount,
  getCarouselSlidesPerView,
} from "@/lib/carousel-active-index";
import { cn } from "@/lib/utils";

const SCROLLBAR_HIDE =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

type Props = { videos: VideoEntry[] };

/** Home strip: same snap carousel pattern as `HomeLatestPostsCarousel`; in-page playback. */
export function HomeVideosCarousel({ videos }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(() =>
    Math.max(1, videos.length)
  );
  const [player, setPlayer] = useState<VideoEntry | null>(null);

  const syncActiveFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || videos.length === 0) return;
    const slides = slideWrapRefs.current;
    const V = getCarouselSlidesPerView(track, slides, videos.length);
    setPageCount(getCarouselPageCount(videos.length, V));
    setActivePage(getActiveCarouselPageIndex(track, slides, videos.length));
  }, [videos.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => syncActiveFromScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    syncActiveFromScroll();
    const ro = new ResizeObserver(() => syncActiveFromScroll());
    ro.observe(track);
    return () => {
      track.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [syncActiveFromScroll, videos.length]);

  const scrollToPage = useCallback((page: number) => {
    const track = trackRef.current;
    const el = slideWrapRefs.current[page];
    if (!track || !el) return;
    const pad = parseFloat(getComputedStyle(track).paddingLeft) || 16;
    track.scrollTo({
      left: Math.max(0, el.offsetLeft - pad),
      behavior: "smooth",
    });
  }, []);

  const scrollPageBy = useCallback(
    (dir: -1 | 1) => {
      const track = trackRef.current;
      if (!track || videos.length === 0) return;
      const slides = slideWrapRefs.current;
      const cur = getActiveCarouselPageIndex(track, slides, videos.length);
      const V = getCarouselSlidesPerView(track, slides, videos.length);
      const pages = getCarouselPageCount(videos.length, V);
      const next = Math.max(0, Math.min(pages - 1, cur + dir));
      scrollToPage(next);
    },
    [videos.length, scrollToPage]
  );

  useEffect(() => {
    slideWrapRefs.current = slideWrapRefs.current.slice(0, videos.length);
  }, [videos.length]);

  if (videos.length === 0) return null;

  return (
    <>
      <div className="w-full">
        <div className="relative">
          <div
            ref={trackRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Video picks"
            className={cn(
              /* Container on the track so 100cqw = content-box width inside padding (slide widths match row math). */
              "@container/videos flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-smooth px-4 py-3 sm:gap-6 sm:px-5 sm:py-4",
              "scroll-pl-4 scroll-pr-4 sm:scroll-pl-5 sm:scroll-pr-5",
              SCROLLBAR_HIDE
            )}
          >
            {videos.map((video, i) => (
              <div
                key={video.id}
                ref={(el) => {
                  slideWrapRefs.current[i] = el;
                }}
                data-index={i}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${videos.length}`}
                className={cn(
                  "min-w-0 shrink-0 snap-start",
                  /* cqw = track content box; gaps sm+: 1.25rem, default 1rem */
                  "w-[100cqw]",
                  "md:w-[calc((100cqw-1.25rem)/2)]",
                  "lg:w-[calc((100cqw-2.5rem)/3)]"
                )}
              >
                <button
                  type="button"
                  onClick={() => setPlayer(video)}
                  className={cn(
                    "group block h-full w-full rounded-2xl text-left outline-none transition-[transform,box-shadow,border-color] duration-200",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  )}
                >
                  <Card className="h-full cursor-pointer gap-0 overflow-hidden rounded-2xl border-border/70 py-0 shadow-sm ring-1 ring-foreground/3 transition-shadow group-hover:border-border group-hover:shadow-md">
                    <div className="relative aspect-video w-full shrink-0 overflow-hidden border-b border-border/40 bg-muted/30">
                      <YoutubePoster
                        youtubeId={video.youtubeId}
                        title={video.title}
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 767px) 90vw, (max-width: 1023px) 42vw, 32vw"
                      />
                      <span
                        className="absolute inset-0 flex items-center justify-center bg-foreground/10 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden
                      >
                        <span className="flex size-12 items-center justify-center rounded-full bg-background/95 shadow-md ring-1 ring-border sm:size-14">
                          <PlayIcon className="size-6 text-foreground sm:size-7" />
                        </span>
                      </span>
                    </div>
                    <CardHeader className="gap-2 p-4 sm:p-5">
                      {video.category ? (
                        <span className="w-fit rounded-md border border-border/80 bg-muted/50 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          {video.category}
                        </span>
                      ) : null}
                      <CardTitle className="line-clamp-2 font-heading text-base leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg">
                        {video.title}
                      </CardTitle>
                      {video.channelTitle ? (
                        <p className="line-clamp-1 text-xs text-muted-foreground sm:text-sm">
                          {video.channelTitle}
                        </p>
                      ) : null}
                    </CardHeader>
                  </Card>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 px-4 sm:px-5">
            <button
              type="button"
              aria-label="Previous videos"
              className={cn(
                "inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-sm",
                "transition-colors hover:bg-muted hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
              onClick={() => scrollPageBy(-1)}
            >
              <ChevronLeftIcon className="size-5" />
            </button>

            <div
              className="flex items-center gap-2 px-1"
              role="tablist"
              aria-label="Video slide indicators"
            >
              {Array.from({ length: pageCount }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === activePage}
                  aria-label={`Go to video page ${i + 1} of ${pageCount}`}
                  className={cn(
                    "size-2.5 cursor-pointer rounded-full transition-[transform,background-color]",
                    i === activePage
                      ? "scale-110 bg-primary"
                      : "bg-muted-foreground/35 hover:bg-muted-foreground/55"
                  )}
                  onClick={() => scrollToPage(i)}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Next videos"
              className={cn(
                "inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-sm",
                "transition-colors hover:bg-muted hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
              onClick={() => scrollPageBy(1)}
            >
              <ChevronRightIcon className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <Dialog open={!!player} onOpenChange={(open) => !open && setPlayer(null)}>
        <DialogContent
          showCloseButton
          className="max-w-[calc(100%-1rem)] gap-0 overflow-hidden border-0 bg-black p-0 sm:max-w-3xl"
        >
          {player ? (
            <>
              <DialogTitle className="sr-only">{player.title}</DialogTitle>
              <div className="aspect-video w-full bg-black">
                <iframe
                  className="size-full"
                  src={`https://www.youtube.com/embed/${player.youtubeId}?autoplay=1`}
                  title={player.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
