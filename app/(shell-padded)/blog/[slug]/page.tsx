import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogReadingTime } from "@/components/blog-reading-time";
import { BlogSimilarArticles } from "@/components/blog-similar-articles";
import { JsonLd } from "@/components/json-ld";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { MarkdownContent } from "@/components/markdown-content";
import { Reveal } from "@/components/reveal";
import {
  blogCardAnons,
  blogPageHeading,
  blogReadingTimeMinutes,
  blogShareImagePath,
  getAllPosts,
  getPostBySlug,
  getSimilarPosts,
} from "@/lib/blog";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
import { keywordsForPage } from "@/lib/seo-keywords";
import { siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.meta.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const { title, description, date, keywords: fmKeywords } = post.meta;
  const path = `/blog/${slug}`;
  const ogImage = blogShareImagePath(
    post,
    siteConfig.defaultBlogShareImage,
  ).trim();
  const keywords = [
    ...new Set([
      ...keywordsForPage("blog", "SDD", post.meta.slug.replace(/-/g, " ")),
      ...(fmKeywords ?? []),
    ]),
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "article",
      locale: "en_US",
      url: path,
      siteName: siteConfig.name,
      title,
      description,
      publishedTime: date,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const similarPosts = getSimilarPosts(slug);
  const heading = blogPageHeading(post.meta);
  const lead = blogCardAnons(post.meta);
  const path = `/blog/${slug}`;

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <JsonLd data={articleJsonLd(post)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: heading, path },
        ])}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_70%_55%_at_30%_-30%,rgba(99,102,241,0.07),transparent_65%)]"
        aria-hidden
      />
      <Reveal>
        <PageBreadcrumbs
          items={[{ name: "Blog", href: "/blog" }, { name: heading }]}
        />
        <article className="relative mt-6">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs font-semibold tracking-wide text-muted-foreground">
            <time dateTime={post.meta.date} className="text-muted-foreground">
              {new Date(post.meta.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <BlogReadingTime
              minutes={blogReadingTimeMinutes(post)}
              className="text-muted-foreground"
            />
          </div>
          <h1 className="mt-4 text-balance sm:text-pretty">{heading}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{lead}</p>
          <div className="pt-12">
            <MarkdownContent markdown={post.content} />
          </div>
        </article>
        <BlogSimilarArticles posts={similarPosts} />
      </Reveal>
    </div>
  );
}
