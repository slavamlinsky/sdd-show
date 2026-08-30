import type { Metadata } from "next";
import { keywordsForPage, type KeywordClusterId } from "@/lib/seo-keywords";
import { siteConfig } from "@/lib/site-config";

export const OG_LOCALE = "en_US";
export const OG_IMAGE_WIDTH = 1280;
export const OG_IMAGE_HEIGHT = 720;
/** Indexable titles: human, glanceable, 50–58 characters, ending with a period. */
export const SEO_TITLE_MIN = 50;
export const SEO_TITLE_MAX = 58;
/** Meta description length for indexable pages. */
export const SEO_DESC_MIN = 140;
export const SEO_DESC_MAX = 155;

export type PageSeoId =
  | "home"
  | "blog"
  | "course"
  | "ecosystem"
  | "glossary"
  | "videos"
  | "tests"
  | "signIn"
  | "account";

/** Zero (auth/`noindex`), one, or two primary keyword clusters per URL. */
export type PrimaryKeywordClusters =
  | readonly []
  | readonly [KeywordClusterId]
  | readonly [KeywordClusterId, KeywordClusterId];

export type PageSeo = {
  /**
   * Document and OG title. Ends with a period. No brand suffix.
   * Indexable pages: human sentence; `SEO_TITLE_MIN`–`SEO_TITLE_MAX`.
   * Auth pages (`signIn`, `account`): `noindex`; use “Intent-Driven Community” in
   * title and description; exempt from `SEO_TITLE_MIN`/`SEO_TITLE_MAX` and the
   * corresponding `SEO_DESC_MIN`/`SEO_DESC_MAX` length rules.
   */
  title: string;
  description: string;
  path: string;
  clusters: PrimaryKeywordClusters;
  extraKeywords?: readonly string[];
  ogImage: string;
  /** Open Graph / Twitter title when it should differ from `title`. */
  ogTitle?: string;
  ogType?: "website" | "article";
  index?: boolean;
};

export const pageSeo: Record<PageSeoId, PageSeo> = {
  home: {
    title: siteConfig.title,
    description: siteConfig.description,
    path: "/",
    clusters: ["sddCore", "intent"],
    ogImage: siteConfig.defaultShareImage,
    ogType: "website",
  },
  blog: {
    title: "Essays on specs, tickets, SDD workflows, and tools.",
    description:
      "Practical writing on tickets vs specs, SDD workflows, Spec Kit and friends, and intent-driven engineering. Short pieces you can use on Monday.",
    path: "/blog",
    clusters: ["sddCore", "ticketsAndSpecs"],
    extraKeywords: ["SDD blog", "spec driven development articles"],
    ogImage: "/images/og-blog.png",
  },
  course: {
    title: "Become an intent-driven engineer - course for developers.",
    description:
      "Become an intent-driven engineer: direct AI agents with written intent and specs, not longer prompts. For software developers, founders, leads, and PMs.",
    path: "/course",
    clusters: ["course", "intent"],
    ogImage: "/images/og-course.png",
  },
  ecosystem: {
    title: "A field guide to Spec Kit, OpenSpec, Kiro, and MCP.",
    description:
      "See how Spec Kit, OpenSpec, Kiro, and MCP sit together: tools you can use, ways of working, and standards around spec-driven and intent-driven practice.",
    path: "/ecosystem",
    clusters: ["tools", "ecosystem"],
    ogImage: "/images/og-ecosystem.png",
  },
  glossary: {
    title: "A short glossary for SDD, specs, and software intent.",
    description:
      "A compact glossary for spec-driven development: specs, acceptance criteria, living docs, intent, and related terms across product, design, and quality.",
    path: "/glossary",
    clusters: ["sddCore", "intent"],
    extraKeywords: ["SDD glossary", "spec driven development terms"],
    ogImage: "/images/og-glossary.png",
  },
  videos: {
    title: "Talks and walkthroughs on AI-driven development work.",
    description:
      "Hand-picked talks on AI-driven development, agents, and specs. Play them on this page when you want a walkthrough instead of another article.",
    path: "/videos",
    clusters: ["agents", "sddCore"],
    extraKeywords: ["AI engineering videos", "spec driven development videos"],
    ogImage: "/images/og-videos.png",
  },
  tests: {
    title: "Short self-checks on SDD, specs, and software intent.",
    description:
      "Take a short quiz on spec-driven development and intent-driven engineering. Random questions, no timer, optional leaderboard if you sign in.",
    path: "/tests",
    clusters: ["sddCore", "intent"],
    extraKeywords: ["SDD quiz", "intent-driven engineering quiz"],
    ogImage: siteConfig.defaultShareImage,
  },
  signIn: {
    title: "Sign in to the Intent-Driven Community.",
    description:
      "Sign in to the Intent-Driven Community with a magic link or Google. New visitors get an account automatically.",
    path: "/sign-in",
    clusters: [],
    ogImage: siteConfig.defaultShareImage,
    index: false,
  },
  account: {
    title: "Your Intent-Driven Community account.",
    description:
      "See your Intent-Driven Community profile: name and email from your sign-in provider. Display-name editing comes later.",
    path: "/account",
    clusters: [],
    ogImage: siteConfig.defaultShareImage,
    index: false,
  },
};

const postClusters: Record<string, PrimaryKeywordClusters> = {
  "what-is-spec-driven-development": ["sddCore", "ticketsAndSpecs"],
  "tickets-vs-specs": ["ticketsAndSpecs", "sddCore"],
  "sdd-workflow-for-small-teams": ["practice", "sddCore"],
  "intent-driven-engineering": ["intent", "agents"],
  "sdd-tools-and-frameworks": ["tools", "ecosystem"],
};

export function clustersForPostSlug(slug: string): PrimaryKeywordClusters {
  return postClusters[slug] ?? ["sddCore"];
}

export function keywordsForSeo(page: PageSeo): string[] {
  return keywordsForPage(page.clusters, ...(page.extraKeywords ?? []));
}

type ShareFields = {
  title: string;
  description: string;
  path: string;
  image: string;
  ogTitle?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
};

/** Canonical, Open Graph, and Twitter tags with `metadataBase` resolving image URLs. */
export function shareMetadata({
  title,
  description,
  path,
  image,
  ogTitle = title,
  ogType = "website",
  publishedTime,
}: ShareFields): Pick<Metadata, "alternates" | "openGraph" | "twitter"> {
  return {
    alternates: { canonical: path },
    openGraph: {
      type: ogType,
      locale: OG_LOCALE,
      url: path,
      siteName: siteConfig.name,
      title: ogTitle,
      description,
      images: [
        {
          url: image,
          alt: ogTitle,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image],
    },
  };
}

export function metadataFromPageSeo(page: PageSeo): Metadata {
  const keywords = keywordsForSeo(page);
  const index = page.index !== false;
  const title: Metadata["title"] = page.title;

  const share = index
    ? shareMetadata({
        title: page.title,
        description: page.description,
        path: page.path,
        image: page.ogImage,
        ogTitle: page.ogTitle ?? page.title,
        ogType: page.ogType ?? "website",
      })
    : {};

  return {
    title,
    description: page.description,
    keywords: keywords.length > 0 ? keywords : undefined,
    robots: index ? undefined : { index: false, follow: false },
    ...share,
  };
}
