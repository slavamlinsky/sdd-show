"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { BlogReadingTime } from "@/components/blog-reading-time";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getActiveCarouselPageIndex,
  getCarouselPageCount,
  getCarouselSlidesPerView,
} from "@/lib/carousel-active-index";
import { cn } from "@/lib/utils";

export type HomeLatestPostItem = {
  slug: string;
  title: string;
  anons: string;
  date: string;
  readingMinutes: number;
  imageSrc: string | null;
};

const SCROLLBAR_HIDE =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

type Props = { items: HomeLatestPostItem[] };

export function HomeLatestPostsCarousel({ items }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(() =>
    Math.max(1, items.length)
  );

  const syncActiveFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;
    const slides = slideWrapRefs.current;
    const V = getCarouselSlidesPerView(track, slides, items.length);
    setPageCount(getCarouselPageCount(items.length, V));
    setActivePage(getActiveCarouselPageIndex(track, slides, items.length));
  }, [items.length]);

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
  }, [syncActiveFromScroll, items.length]);

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
      if (!track || items.length === 0) return;
      const slides = slideWrapRefs.current;
      const cur = getActiveCarouselPageIndex(track, slides, items.length);
      const V = getCarouselSlidesPerView(track, slides, items.length);
      const pages = getCarouselPageCount(items.length, V);
      const next = Math.max(0, Math.min(pages - 1, cur + dir));
      scrollToPage(next);
    },
    [items.length, scrollToPage]
  );

  useEffect(() => {
    slideWrapRefs.current = slideWrapRefs.current.slice(0, items.length);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div className="w-full">
      <div className="relative">
        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Latest blog posts"
          className={cn(
            "@container/latest flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-smooth px-4 py-3 sm:gap-6 sm:px-5 sm:py-4",
            "scroll-pl-4 scroll-pr-4 sm:scroll-pl-5 sm:scroll-pr-5",
            SCROLLBAR_HIDE
          )}
        >
          {items.map((item, i) => (
            <div
              key={item.slug}
              ref={(el) => {
                slideWrapRefs.current[i] = el;
              }}
              data-index={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
              className={cn(
                "min-w-0 shrink-0 snap-start",
                "w-[100cqw]",
                "md:w-[calc((100cqw-1.25rem)/2)]",
                "lg:w-[calc((100cqw-2.5rem)/3)]"
              )}
            >
              <Link
                href={`/blog/${item.slug}`}
                className={cn(
                  "group block h-full rounded-2xl outline-none transition-[transform,box-shadow,border-color] duration-200",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                <Card className="h-full overflow-hidden rounded-2xl border-border/70 pt-0 shadow-sm ring-1 ring-foreground/3 transition-shadow group-hover:shadow-md group-hover:border-border">
                  {item.imageSrc ? (
                    <div className="relative aspect-video w-full shrink-0 overflow-hidden border-b border-border/40 bg-muted/30">
                      <Image
                        src={item.imageSrc}
                        alt=""
                        fill
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 767px) 90vw, (max-width: 1023px) 42vw, 32vw"
                      />
                    </div>
                  ) : (
                    <div
                      className="h-1.5 shrink-0 bg-linear-to-r from-violet-500/25 via-sky-500/20 to-emerald-500/25"
                      aria-hidden
                    />
                  )}
                  <CardHeader className="gap-3 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      <time dateTime={item.date}>
                        {new Date(item.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                      <BlogReadingTime
                        minutes={item.readingMinutes}
                        className="text-muted-foreground"
                      />
                    </div>
                    <CardTitle className="font-heading text-lg leading-snug text-foreground transition-colors group-hover:text-primary">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-[15px] leading-relaxed">
                      {item.anons}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 px-4 sm:px-5">
          <button
            type="button"
            aria-label="Previous posts"
            className={cn(
              "inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-sm",
              "transition-colors hover:bg-muted hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            onClick={() => scrollPageBy(-1)}
          >
            <ChevronLeftIcon className="size-5" />
          </button>

          <div className="flex items-center gap-2 px-1" role="tablist" aria-label="Slide indicators">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === activePage}
                aria-label={`Go to page ${i + 1} of ${pageCount}`}
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
            aria-label="Next posts"
            className={cn(
              "inline-flex cursor-pointer size-10 items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-sm",
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
  );
}
