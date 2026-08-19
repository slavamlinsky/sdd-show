import { blogPageHeading, blogShareImagePath, type BlogPost } from "./blog";
import { absoluteUrl } from "./absolute-url";
import { siteConfig } from "./site-config";

export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: absoluteUrl("/logo.png"),
    },
  };
}

export function articleJsonLd(post: BlogPost): Record<string, unknown> {
  const path = `/blog/${post.meta.slug}`;
  const url = absoluteUrl(path);
  const image = absoluteUrl(
    blogShareImagePath(post, siteConfig.defaultBlogShareImage).trim(),
  );
  const headline = blogPageHeading(post.meta);
  const publisher = {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.png"),
    },
  };

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description: post.meta.description,
    datePublished: post.meta.date,
    dateModified: post.meta.date,
    image,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: post.meta.author
      ? { "@type": "Person", name: post.meta.author }
      : publisher,
    publisher,
  };
}

export type BreadcrumbLdItem = {
  name: string;
  /** Site-root path, e.g. `/` or `/blog/slug`. */
  path: string;
};

export function breadcrumbJsonLd(
  items: BreadcrumbLdItem[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
