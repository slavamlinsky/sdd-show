"use client";

import Image from "next/image";
import { useState } from "react";
import { getYoutubeThumbnailUrls } from "@/lib/videos-data";

export function YoutubePoster({
  youtubeId,
  title,
  className,
  sizes,
  priority = false,
}: {
  youtubeId: string;
  title: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  const urls = getYoutubeThumbnailUrls(youtubeId);
  const [urlIndex, setUrlIndex] = useState(0);
  const src = urls[Math.min(urlIndex, urls.length - 1)];

  return (
    <Image
      src={src}
      alt=""
      title={title}
      fill
      unoptimized
      priority={priority}
      className={className}
      sizes={sizes}
      onError={() => {
        setUrlIndex((i) => (i < urls.length - 1 ? i + 1 : i));
      }}
    />
  );
}
