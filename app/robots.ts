import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

const allowAll = { userAgent: "*", allow: "/", disallow: ["/sign-in", "/account", "/auth/"] };

const aiCrawlers = [
  "GPTBot",
  "Google-Extended",
  "ClaudeBot",
  "PerplexityBot",
  "Applebot-Extended",
  "CCBot",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      allowAll,
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/sign-in", "/account", "/auth/"],
      })),
    ],
    sitemap: `${siteConfig.url.replace(/\/$/, "")}/sitemap.xml`,
  };
}
