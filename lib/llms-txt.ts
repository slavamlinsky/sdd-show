import type { BlogPost } from "./blog";
import { absoluteUrl } from "./absolute-url";
import { siteConfig } from "./site-config";

const PRIMARY_PAGES: { path: string; label: string; note: string }[] = [
  {
    path: "/",
    label: "Home",
    note: "Intent-driven engineering community landing page",
  },
  {
    path: "/course",
    label: "Course",
    note: "Become an Intent-Driven Engineer: syllabus and workflow practice",
  },
  {
    path: "/ecosystem",
    label: "Ecosystem",
    note: "Tools, approaches, and standards around spec-driven development",
  },
  {
    path: "/glossary",
    label: "Glossary",
    note: "Shared terms for specs, SDD, and intent-driven engineering",
  },
  {
    path: "/tests",
    label: "Tests",
    note: "Self-checks on spec-driven development and intent-driven engineering",
  },
  {
    path: "/videos",
    label: "Videos",
    note: "Walkthroughs and talks",
  },
  {
    path: "/blog",
    label: "Blog",
    note: "Short articles on spec-driven development and related practice",
  },
];

/** Plain-text map of key URLs for humans and LLM crawlers (`/llms.txt`). */
export function buildLlmsTxt(posts: BlogPost[]): string {
  const lines: string[] = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "Canonical site for definitions, a course, an ecosystem map, and articles on spec-driven development and intent-driven engineering.",
    "",
    "## Primary pages",
    "",
  ];

  for (const page of PRIMARY_PAGES) {
    lines.push(`- [${page.label}](${absoluteUrl(page.path)}): ${page.note}`);
  }

  lines.push("", "## Blog", "");

  for (const post of posts) {
    const url = absoluteUrl(`/blog/${post.meta.slug}`);
    const title = post.meta.name?.trim() || post.meta.title;
    lines.push(`- [${title}](${url}): ${post.meta.description}`);
  }

  lines.push(
    "",
    "## Machine-readable",
    "",
    `- Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    `- Robots: ${absoluteUrl("/robots.txt")}`,
    "",
  );

  return lines.join("\n");
}
