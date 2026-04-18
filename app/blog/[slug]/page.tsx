import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/markdown-content";
import { Reveal } from "@/components/reveal";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { ArrowLeftIcon } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.meta.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(ellipse_70%_55%_at_30%_-30%,rgba(99,102,241,0.07),transparent_65%)]"
        aria-hidden
      />
      <Reveal>
        <Link
          href="/blog"
          className="relative inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeftIcon className="size-4" />
          Back to blog
        </Link>
        <article className="relative mt-10">
          <header className="border-b border-border/60 pb-10">
            <time className="text-xs font-semibold tracking-wide text-muted-foreground uppercase" dateTime={post.meta.date}>
              {new Date(post.meta.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <h1 className="font-heading mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              {post.meta.title}
            </h1>
            <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted-foreground">{post.meta.description}</p>
          </header>
          <div className="pt-12">
            <MarkdownContent markdown={post.content} />
          </div>
        </article>
      </Reveal>
    </div>
  );
}
