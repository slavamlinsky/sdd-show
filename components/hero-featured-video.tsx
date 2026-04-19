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

export function HeroFeaturedVideo({ video }: { video: VideoEntry }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Play video: ${video.title}`}
        className={cn(
          "group relative block w-full overflow-hidden rounded-[2rem] border border-border/60 bg-card text-left shadow-xl shadow-foreground/5 ring-1 ring-foreground/[0.04]",
          "aspect-video max-h-[min(100vw,22rem)] sm:max-h-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        <YoutubePoster
          youtubeId={video.youtubeId}
          title={video.title}
          priority
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
        <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/50 via-foreground/10 to-transparent p-5 sm:p-6">
          <span className="flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-background/95 shadow-md ring-1 ring-border">
              <PlayIcon className="size-6 text-foreground" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block font-heading text-sm font-semibold leading-snug text-white drop-shadow-sm sm:text-base">
                {video.title}
              </span>
              {video.channelTitle ? (
                <span className="mt-0.5 block text-xs text-white/85">{video.channelTitle}</span>
              ) : null}
            </span>
          </span>
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton
          className="max-w-[calc(100%-1rem)] gap-0 overflow-hidden border-0 bg-black p-0 sm:max-w-3xl"
        >
          <DialogTitle className="sr-only">{video.title}</DialogTitle>
          <div className="aspect-video w-full bg-black">
            <iframe
              className="size-full"
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
