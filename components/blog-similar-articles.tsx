import Image from "next/image";
import Link from "next/link";
import { BlogReadingTime } from "@/components/blog-reading-time";
import { Reveal } from "@/components/reveal";
import {
  blogCardAnons,
  blogCardPreviewImage,
  blogCardTitle,
  blogReadingTimeMinutes,
  type BlogPost,
} from "@/lib/blog";
import { cn } from "@/lib/utils";

type Props = { posts: BlogPost[]; className?: string };

/** Related rail below article body: internal links + scan-friendly cards. */
export function BlogSimilarArticles({ posts, className }: Props) {
  if (posts.length === 0) return null;

  return (
    <aside
      aria-labelledby="blog-similar-heading"
      className={cn("mt-16 border-t border-border/60 pt-12", className)}
    >
      <h2
        id="blog-similar-heading"
        className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
      >
        Similar articles
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Other posts you might want to read next.
      </p>
      <ul className="mt-8 grid list-none gap-6 xl:gap-16 p-0 sm:grid-cols-2">
        {posts.map((p, i) => {
          const thumb = blogCardPreviewImage(p);
          const meta = p.meta;
          return (
            <li key={meta.slug} className="min-w-0">
              <Reveal delay={i * 0.05} distance={12}>
                <Link
                  href={`/blog/${meta.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 ring-1 ring-foreground/[0.03] transition-[border-color,box-shadow] hover:border-border hover:shadow-md"
                >
                  {thumb ? (
                    <div className="relative aspect-video w-full shrink-0 overflow-hidden border-b border-border/40 bg-muted/20">
                      <Image
                        src={thumb}
                        alt=""
                        fill
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                      />
                    </div>
                  ) : (
                    <div className="h-2 shrink-0 bg-gradient-to-r from-violet-500/15 via-transparent to-sky-500/15" aria-hidden />
                  )}
                  <div className="flex min-w-0 flex-1 flex-col gap-2 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[11px] font-semibold text-muted-foreground">
                      <time dateTime={meta.date}>
                        {new Date(meta.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                      <BlogReadingTime minutes={blogReadingTimeMinutes(p)} />
                    </div>
                    <span className="font-heading text-base font-semibold leading-snug text-foreground group-hover:text-primary">
                      {blogCardTitle(meta)}
                    </span>
                    <span className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {blogCardAnons(meta)}
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
