import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/absolute-url";

const STATIC_PATHS = [
  "/",
  "/blog",
  "/course",
  "/ecosystem",
  "/glossary",
  "/videos",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" || path === "/blog" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: absoluteUrl(`/blog/${post.meta.slug}`),
    lastModified: post.meta.date,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...posts];
}
