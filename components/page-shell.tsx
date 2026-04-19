import type { ReactNode } from "react";

const shellBase = "page-shell mx-auto w-full max-w-6xl px-4 sm:px-6";

/** Standard vertical rhythm below the header (default for article-style routes). */
export function PageShellPadded({ children }: { children: ReactNode }) {
  return <div className={`${shellBase} py-6 sm:py-8`}>{children}</div>;
}

/** Horizontal shell only — for routes whose first band is full-bleed to the header/footer. */
export function PageShellFlush({ children }: { children: ReactNode }) {
  return <div className={shellBase}>{children}</div>;
}
