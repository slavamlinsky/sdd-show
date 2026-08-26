"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { lookupYoutubePreview } from "@/app/(shell-flush)/videos/actions";
import { parseYoutubeId } from "@/lib/videos-youtube";
import { cn } from "@/lib/utils";

const PREVIEW_DEBOUNCE_MS = 400;

type PreviewState = {
  youtubeId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
};

type Props = {
  youtubeUrl: string;
  disabled?: boolean;
};

export function SuggestYoutubePreview({ youtubeUrl, disabled = false }: Props) {
  const youtubeId = parseYoutubeId(youtubeUrl);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!youtubeId) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        setLoading(true);
        setError(null);
        setPreview(null);
        try {
          const result = await lookupYoutubePreview(youtubeUrl);
          if (cancelled) return;
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setPreview({
            youtubeId: result.youtubeId,
            title: result.title,
            channelTitle: result.channelTitle,
            thumbnailUrl: result.thumbnailUrl,
          });
        } catch {
          if (!cancelled) {
            setError("Could not load video details. Try again.");
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
    }, PREVIEW_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [youtubeUrl, youtubeId]);

  if (!youtubeId) return null;

  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-muted/30 p-3",
        disabled && "opacity-60",
      )}
      aria-live="polite"
    >
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
          Loading video preview…
        </div>
      ) : preview ? (
        <div className="flex gap-3">
          <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={preview.thumbnailUrl}
              alt=""
              fill
              unoptimized
              className="object-cover"
              sizes="112px"
            />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="line-clamp-2 text-sm font-medium leading-snug">
              {preview.title}
            </p>
            {preview.channelTitle ? (
              <p className="truncate text-xs text-muted-foreground">
                {preview.channelTitle}
              </p>
            ) : null}
          </div>
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground" role="status">
          {error}
        </p>
      ) : null}
    </div>
  );
}
