"use client";

import { useState } from "react";
import { PlayIcon } from "lucide-react";
import type { VideoEntry } from "@/lib/videos-data";
import { YoutubePoster } from "@/components/youtube-poster";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export function VideoGrid({ videos }: { videos: VideoEntry[] }) {
  const [active, setActive] = useState<VideoEntry | null>(null);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <button
            key={video.id}
            type="button"
            onClick={() => setActive(video)}
            className={cn(
              "group text-left",
              "rounded-3xl border border-border/70 bg-card ring-1 ring-foreground/[0.04] transition-all duration-300",
              "motion-safe:hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5 hover:ring-foreground/10",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <span className="relative block aspect-video w-full overflow-hidden rounded-t-3xl bg-muted">
              <YoutubePoster
                youtubeId={video.youtubeId}
                title={video.title}
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <span
                className="absolute inset-0 flex items-center justify-center bg-foreground/10 opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-background/95 shadow-md ring-1 ring-border">
                  <PlayIcon className="size-7 text-foreground" />
                </span>
              </span>
            </span>
            <span className="flex flex-col gap-2 px-4 py-4">
              {video.category ? (
                <span className="w-fit rounded-md border border-border/80 bg-muted/50 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {video.category}
                </span>
              ) : null}
              <span className="font-heading text-sm font-medium leading-snug text-foreground">
                {video.title}
              </span>
              {video.channelTitle ? (
                <span className="text-xs text-muted-foreground">{video.channelTitle}</span>
              ) : null}
            </span>
          </button>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent
          showCloseButton
          className="max-w-[calc(100%-1rem)] gap-0 overflow-hidden border-0 bg-black p-0 sm:max-w-3xl"
        >
          {active ? (
            <>
              <DialogTitle className="sr-only">{active.title}</DialogTitle>
              <div className="aspect-video w-full bg-black">
                <iframe
                  className="size-full"
                  src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1`}
                  title={active.title}
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
