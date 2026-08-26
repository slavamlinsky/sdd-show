/** YouTube id is 11 characters: A–Z, a–z, 0–9, `_`, `-`. */
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
]);

export function isYoutubeId(value: string): boolean {
  return YOUTUBE_ID.test(value);
}

function youtubeIdFromPath(pathname: string): string | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  const [head, next] = parts;
  if (
    head === "embed" ||
    head === "shorts" ||
    head === "live" ||
    head === "v" ||
    head === "watch"
  ) {
    return next && isYoutubeId(next) ? next : null;
  }
  return isYoutubeId(head) ? head : null;
}

/**
 * Accept a canonical watch URL, short link, embed/shorts/live path, or a bare 11-char id.
 */
export function parseYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (isYoutubeId(trimmed)) return trimmed;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && isYoutubeId(id) ? id : null;
  }

  if (!YOUTUBE_HOSTS.has(host)) return null;

  const fromQuery = url.searchParams.get("v");
  if (fromQuery && isYoutubeId(fromQuery)) return fromQuery;

  return youtubeIdFromPath(url.pathname);
}

export function canonicalYoutubeWatchUrl(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

export function youtubeThumbnailUrl(
  youtubeId: string,
  quality: "hqdefault" | "mqdefault" = "hqdefault",
): string {
  return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
}
