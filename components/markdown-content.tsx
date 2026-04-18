import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  if (u.hostname === "img.youtube.com" && u.pathname.startsWith("/vi/")) return true;
  if (u.hostname === "i.ytimg.com") return true;
  return false;
}

const figureShell =
  "relative my-6 block aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/60 bg-muted/20 not-italic shadow-sm";

const figureMediaClass = "h-full w-full object-cover";

const markdownComponents = {
  h2: ({ ...props }: React.ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-8 font-heading text-xl font-semibold tracking-tight first:mt-0" {...props} />
  ),
  h3: ({ ...props }: React.ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-6 font-heading text-lg font-medium tracking-tight" {...props} />
  ),
  p: ({ ...props }: React.ComponentPropsWithoutRef<"p">) => (
    <p className="text-[15px] leading-relaxed text-muted-foreground [&:not(:first-child)]:mt-4" {...props} />
  ),
  ul: ({ ...props }: React.ComponentPropsWithoutRef<"ul">) => (
    <ul className="mt-4 list-disc pl-5 text-[15px] leading-relaxed text-muted-foreground" {...props} />
  ),
  ol: ({ ...props }: React.ComponentPropsWithoutRef<"ol">) => (
    <ol className="mt-4 list-decimal pl-5 text-[15px] leading-relaxed text-muted-foreground" {...props} />
  ),
  li: ({ ...props }: React.ComponentPropsWithoutRef<"li">) => (
    <li className="mt-1 marker:text-foreground/60" {...props} />
  ),
  a: ({ ...props }: React.ComponentPropsWithoutRef<"a">) => (
    <a className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80" {...props} />
  ),
  strong: ({ ...props }: React.ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  blockquote: ({ ...props }: React.ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-l-2 border-border pl-4 italic text-muted-foreground"
      {...props}
    />
  ),
  code: ({ ...props }: React.ComponentPropsWithoutRef<"code">) => (
    <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground" {...props} />
  ),
  hr: () => <hr className="my-10 border-border/60" />,
  img: ({ src, alt }: React.ComponentPropsWithoutRef<"img">) => {
    if (!src || typeof src !== "string") return null;

    const unoptimized = isSvgPath(src);

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
      <span className={figureShell}>
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
    <article className="prose-brand max-w-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
