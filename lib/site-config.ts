export const siteConfig = {
  name: "Intent Driven Engineering Community",
  title: "Intent-Driven Engineering — Beyond Spec-Driven Development.",
  description:
    "Intent-driven engineering extends spec-driven development with shared intent, outcome-focused execution, and AI-assisted workflows.",
  url: "https://sdd-show.vercel.app",
  /** Site-level SEO keywords merged with `baseKeywords` in root layout metadata. */
  keywords: [
    "intent-driven engineering",
    "software intent",
    "outcome-driven development",
    "delivery alignment",
    "living specifications",
    "engineering leadership",
  ] as const,
  /**
   * When a post has no `socialImage` and no local inline figure, link previews use this asset (path from site root).
   */
  defaultBlogShareImage: "/logo-ai-driven.png",
} as const;
