import { siteConfig } from "./site-config";

/** Absolute URL from a site-root path (`/blog/foo`). */
export function absoluteUrl(pathname: string): string {
  const base = siteConfig.url.replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}
