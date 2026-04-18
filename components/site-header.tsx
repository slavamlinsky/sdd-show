"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { mainNav } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function navLinkClass(active: boolean) {
  return cn(
    "text-sm font-medium transition-colors",
    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/70">
      <a
        href="#main-content"
        className="bg-background text-foreground fixed left-4 top-4 z-[100] -translate-y-[200%] rounded-full border border-border px-4 py-2 text-sm font-medium shadow-md outline-none transition-transform duration-200 ease-out focus:translate-y-0 focus-visible:ring-2 focus-visible:ring-ring"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight text-foreground"
        >
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-1.5 md:flex" aria-label="Main">
          {mainNav.map(({ href, label }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  navLinkClass(active),
                  "rounded-full px-3.5 py-2 transition-colors",
                  active && "bg-muted font-medium text-foreground"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" aria-label="Open menu">
                  <MenuIcon className="size-4" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-[min(100%,20rem)] gap-0 p-0">
              <SheetHeader className="border-b border-border p-4 text-left">
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col p-2" aria-label="Mobile main">
                {mainNav.map(({ href, label }) => {
                  const active =
                    href === "/"
                      ? pathname === "/"
                      : pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-sm font-medium",
                        active
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      )}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
