import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. Built with specs first.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <Link className="text-muted-foreground hover:text-foreground" href="/course">
            Course
          </Link>
          <Link className="text-muted-foreground hover:text-foreground" href="/blog">
            Blog
          </Link>
          <a
            className="text-muted-foreground hover:text-foreground"
            href="https://github.com/slavamlinsky/sdd-show"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
