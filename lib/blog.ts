import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export type BlogFrontmatter = {
  title: string;
  slug: string;
  date: string;
  /** SEO / Open Graph meta description. */
  description: string;
  /** Short label for cards and in-page link text; defaults to `title`. */
  name?: string;
  /** Short reader-facing blurb (cards + article hero); defaults to `description` when omitted (legacy). */
  anons?: string;
  /** Visible article `<h1>`; defaults to `name`, then `title`. */
  heading?: string;
  /**
   * Link-preview / Open Graph image only (site-root path). Not shown as a hero above the article —
   * figures stay in the markdown body. If omitted, previews fall back to the first local inline image, then the site default.
   */
  socialImage?: string;
  /** Override auto reading time (minutes); must be a positive number. */
  readingTimeMinutes?: number;
  author?: string;
};

/** Baseline reading speed for word-count math (technical prose). */
const WORDS_PER_MINUTE = 200;
/** Applied to the estimate so the UI shows a longer, more conservative time (e.g. `2` = double). */
const READING_TIME_DISPLAY_MULTIPLIER = 2;

function wordCountFromMarkdown(md: string): number {
  const stripped = md
    .replace(/\r\n/g, "\n")
    .replace(/^```[\s\S]*?^```/gm, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/^---+$/gm, " ")
    .replace(/[*_~|]+/g, " ");

  return stripped.split(/\s+/).filter((w) => w && /[\w\u00C0-\u024F\u0400-\u04FF]/.test(w)).length;
}

export function estimateReadingMinutesFromMarkdown(markdown: string): number {
  const words = wordCountFromMarkdown(markdown);
  const minutes =
    (words / WORDS_PER_MINUTE) * READING_TIME_DISPLAY_MULTIPLIER;
  return Math.max(1, Math.round(minutes));
}

/** Minutes to read; uses `readingTimeMinutes` from frontmatter when set, else estimates from body. */
export function blogReadingTimeMinutes(post: BlogPost): number {
  const override = post.meta.readingTimeMinutes;
  if (typeof override === "number" && Number.isFinite(override) && override > 0) {
    return Math.max(1, Math.round(override));
  }
  return estimateReadingMinutesFromMarkdown(post.content);
}

/** Card / list link text */
export function blogCardTitle(meta: BlogFrontmatter): string {
  return meta.name?.trim() || meta.title;
}

/** Card excerpt and default hero deck copy */
export function blogCardAnons(meta: BlogFrontmatter): string {
  return meta.anons?.trim() || meta.description;
}

/** Article page main heading */
export function blogPageHeading(meta: BlogFrontmatter): string {
  return meta.heading?.trim() || meta.name?.trim() || meta.title;
}

const MD_IMAGE_RE = /!\[[^\]]*]\(\s*([^)]+?)\s*\)/;

function normalizeAssetPath(src: string): string {
  const s = src.trim().split(/\s+/)[0] ?? "";
  if (!s || s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:")) {
    return "";
  }
  return s.startsWith("/") ? s : `/${s}`;
}

/** First markdown image `src` in body (local paths only), or undefined. */
export function firstMarkdownImageSrc(markdown: string): string | undefined {
  const m = markdown.match(MD_IMAGE_RE);
  if (!m?.[1]) return undefined;
  const path = normalizeAssetPath(m[1]);
  return path || undefined;
}

/**
 * Card thumbnail (e.g. similar articles): **`socialImage`** if set, else first local body image.
 */
export function blogCardPreviewImage(post: BlogPost): string | undefined {
  const fromMeta = post.meta.socialImage?.trim();
  if (fromMeta) return normalizeAssetPath(fromMeta) || undefined;
  return firstMarkdownImageSrc(post.content);
}

/**
 * Open Graph / Twitter preview: **`socialImage`**, else first local inline image, else **`defaultPath`**.
 */
export function blogShareImagePath(post: BlogPost, defaultPath: string): string {
  const fromMeta = post.meta.socialImage?.trim();
  if (fromMeta) {
    const p = normalizeAssetPath(fromMeta);
    if (p) return p;
  }
  const first = firstMarkdownImageSrc(post.content);
  if (first) return first;
  return defaultPath;
}

export type BlogPost = {
  meta: BlogFrontmatter;
  content: string;
};

function parseFile(filename: string): BlogPost | null {
  const full = path.join(BLOG_DIR, filename);
  const raw = fs.readFileSync(full, "utf8");
  const { data, content } = matter(raw);
  const meta = data as BlogFrontmatter;
  if (!meta.slug || !meta.title) return null;
  return { meta, content };
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const file = `${slug}.md`;
  const full = path.join(BLOG_DIR, file);
  if (!fs.existsSync(full)) return null;
  return parseFile(file);
}

export function getAllPosts(): BlogPost[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is BlogPost => p !== null);
  return posts.sort(
    (a, b) =>
      new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  );
}

/**
 * Other posts for “similar” / related rails (newest first, excluding current).
 * MVP: no taxonomy — v2 may filter by `category`; see spec-blog.md.
 */
export function getSimilarPosts(excludeSlug: string, limit = 2): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.meta.slug !== excludeSlug)
    .slice(0, limit);
}
