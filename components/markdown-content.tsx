import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/** Path only, for extension checks (query strings, hash, case). */
function pathForExtension(src: string): string {
  return src.split(/[?#]/)[0] ?? "";
}

function isSvgPath(src: string): boolean {
  return pathForExtension(src).toLowerCase().endsWith(".svg");
}

function parseRemoteUrl(src: string): URL | null {
  const s = src.trim();
  try {
    if (s.startsWith("//")) return new URL(`https:${s}`);
    return new URL(s);
  } catch {
    return null;
  }
}

function isRemoteSrc(src: string): boolean {
  const s = src.trim();
  return /^https?:\/\//i.test(s) || s.startsWith("//");
}

/** Must stay aligned with `next.config` images.remotePatterns. */
function isNextAllowedRemote(src: string): boolean {
  const u = parseRemoteUrl(src);
  if (!u || (u.protocol !== "http:" && u.protocol !== "https:")) return false;
  if (u.hostname === "img.youtube.com" && u.pathname.startsWith("/vi/"))
    return true;
  if (u.hostname === "i.ytimg.com") return true;
  return false;
}

/** Shared frame for blog figures; aspect ratio varies (see `figureAspectForSrc`). */
const figureShellBase =
  "relative my-6 block w-full overflow-hidden rounded-xl border border-border/60 bg-muted/20 not-italic shadow-sm";

/** Default wide figure (~2:1). Intent-driven article hero figures use 16:9 — see spec-blog.md. */
const figureAspectDefault = "aspect-video";
/** 16:9 — Tailwind `aspect-video`. */
const figureAspectVideo = "aspect-video";

function figureAspectForSrc(src: string): string {
  const path = pathForExtension(src).toLowerCase();
  if (
    path.includes("intent-driven-user") ||
    path.includes("intent-driven-schema")
  ) {
    return figureAspectVideo;
  }
  return figureAspectDefault;
}

const figureMediaClass = "h-full w-full object-cover object-center";

const markdownComponents = {
  h2: ({ ...props }: React.ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-8 font-heading text-xl font-semibold tracking-tight first:mt-0"
      {...props}
    />
  ),
  h3: ({ ...props }: React.ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-6 font-heading text-lg font-medium tracking-tight"
      {...props}
    />
  ),
  p: ({ ...props }: React.ComponentPropsWithoutRef<"p">) => (
    <p
      className="text-[15px] leading-relaxed text-muted-foreground not-first:mt-4"
      {...props}
    />
  ),
  ul: ({ ...props }: React.ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="mt-4 list-disc pl-5 text-[15px] leading-relaxed text-muted-foreground"
      {...props}
    />
  ),
  ol: ({ ...props }: React.ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="mt-4 list-decimal pl-5 text-[15px] leading-relaxed text-muted-foreground"
      {...props}
    />
  ),
  li: ({ ...props }: React.ComponentPropsWithoutRef<"li">) => (
    <li className="mt-1 marker:text-foreground/60" {...props} />
  ),
  a: ({ ...props }: React.ComponentPropsWithoutRef<"a">) => (
    <a
      className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
      {...props}
    />
  ),
  strong: ({ ...props }: React.ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  blockquote: ({ ...props }: React.ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="mx-auto my-6 w-[90%] rounded-xl border border-border/50 bg-muted/30 px-4 py-4 not-italic leading-relaxed text-muted-foreground sm:px-5 [&_p]:mt-0 [&_p+p]:mt-3"
      {...props}
    />
  ),
  code: ({ ...props }: React.ComponentPropsWithoutRef<"code">) => (
    <code
      className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-border/60" />,
  table: ({ ...props }: React.ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 w-full overflow-x-auto rounded-lg border border-border/60 bg-muted/10">
      <table
        className="w-full min-w-[18rem] border-collapse text-left text-[15px] text-muted-foreground"
        {...props}
      />
    </div>
  ),
  thead: ({ ...props }: React.ComponentPropsWithoutRef<"thead">) => (
    <thead
      className="border-b border-border bg-muted/40 text-foreground"
      {...props}
    />
  ),
  tbody: ({ ...props }: React.ComponentPropsWithoutRef<"tbody">) => (
    <tbody {...props} />
  ),
  tr: ({ ...props }: React.ComponentPropsWithoutRef<"tr">) => (
    <tr className="border-b border-border/50 last:border-b-0" {...props} />
  ),
  th: ({ ...props }: React.ComponentPropsWithoutRef<"th">) => (
    <th
      className="px-3 py-2.5 align-top text-sm font-semibold tracking-tight"
      {...props}
    />
  ),
  td: ({ ...props }: React.ComponentPropsWithoutRef<"td">) => (
    <td className="px-3 py-2.5 align-top" {...props} />
  ),
  img: ({ src, alt }: React.ComponentPropsWithoutRef<"img">) => {
    if (!src || typeof src !== "string") return null;

    const unoptimized = isSvgPath(src);
    const figureShell = cn(figureShellBase, figureAspectForSrc(src));

    if (isRemoteSrc(src) && !isNextAllowedRemote(src)) {
      return (
        <span className={figureShell}>
          {/* eslint-disable-next-line @next/next/no-img-element -- remote host not in next.config remotePatterns */}
          <img
            src={src}
            alt={alt ?? ""}
            className={figureMediaClass}
            loading="lazy"
            decoding="async"
          />
        </span>
      );
    }

    return (
      <span className={figureShell + "  mx-auto sm:w-9/10"}>
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          className={figureMediaClass}
          sizes="(max-width: 768px) 100vw, 42rem"
          unoptimized={unoptimized}
        />
      </span>
    );
  },
};

export function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <article className="prose-brand max-w-4xl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
