import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    return (
      <span className="relative my-6 block aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/60 bg-muted/20 not-italic shadow-sm">
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 42rem"
          unoptimized={src.endsWith(".svg")}
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
