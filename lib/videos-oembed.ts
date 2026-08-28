import {
  canonicalYoutubeWatchUrl,
  parseYoutubeId,
  youtubeThumbnailUrl,
} from "@/lib/videos-youtube";

export type YoutubeOembedPreview = {
  youtubeId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
};

export type YoutubeOembedResult =
  | { ok: true; preview: YoutubeOembedPreview }
  | { ok: false; error: string };

type OembedResponse = {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
};

export async function fetchYoutubeOembed(
  youtubeUrlOrId: string,
): Promise<YoutubeOembedResult> {
  const youtubeId = parseYoutubeId(youtubeUrlOrId);
  if (!youtubeId) {
    return { ok: false, error: "Paste a valid YouTube link first." };
  }

  const watchUrl = canonicalYoutubeWatchUrl(youtubeId);
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`;

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          ok: false,
          error: "Video not found or not available for embedding.",
        };
      }
      return { ok: false, error: "Could not load video details. Try again." };
    }

    const json = (await response.json()) as OembedResponse;
    if (!json.title?.trim()) {
      return { ok: false, error: "Could not load video details. Try again." };
    }

    return {
      ok: true,
      preview: {
        youtubeId,
        title: json.title.trim(),
        channelTitle: json.author_name?.trim() ?? "",
        thumbnailUrl:
          json.thumbnail_url?.trim() ?? youtubeThumbnailUrl(youtubeId),
      },
    };
  } catch {
    return { ok: false, error: "Could not load video details. Try again." };
  }
}
