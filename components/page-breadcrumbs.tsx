import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type PageBreadcrumbItem = {
  name: string;
  href?: string;
};

export function PageBreadcrumbs({
  items,
  className,
}: {
  items: PageBreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("relative", className)}>
      <ol className="flex min-w-0 flex-wrap items-center gap-1.5 text-sm font-medium text-muted-foreground">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li
              key={`${item.name}-${index}`}
              className="flex min-w-0 items-center gap-1.5"
            >
              {index > 0 ? (
                <ChevronRightIcon
                  className="size-3.5 shrink-0 opacity-50"
                  aria-hidden
                />
              ) : null}
              {last || !item.href ? (
                <span
                  className="min-w-0 truncate text-foreground/80"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="shrink-0 rounded-md transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
