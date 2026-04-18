import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export type BlogFrontmatter = {
  title: string;
  slug: string;
  date: string;
  description: string;
  author?: string;
};

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
