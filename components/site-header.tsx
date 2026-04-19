"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, MenuIcon } from "lucide-react";
import { mainNav } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

function navLinkClass(active: boolean) {
  return cn(
    "text-sm font-medium transition-colors",
    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
  );
}

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function MobileMainNav() {
  const pathname = usePathname();

  return (
    <div className="relative z-[45] md:hidden">
      <Sheet>
        <SheetTrigger
          className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
          aria-label="Open menu"
          aria-controls="mobile-main-nav"
          onClick={() => {
            if (process.env.NODE_ENV === "development") {
              console.log("[MobileMainNav] hamburger SheetTrigger: click");
            }
          }}
        >
          <MenuIcon className="size-4" />
        </SheetTrigger>
        <SheetContent
          id="mobile-main-nav"
          side="right"
          className="flex h-full max-h-[100dvh] w-[min(100%,20rem)] flex-col gap-0 p-0"
        >
          <SheetHeader className="border-b border-border p-4 text-left">
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>
          <nav
            className="flex min-h-0 flex-1 flex-col overflow-y-auto p-2"
            aria-label="Mobile main"
          >
            {mainNav.map(({ href, label }) => {
              const active = isNavActive(pathname, href);
              return (
                <SheetClose
                  key={href}
                  nativeButton={false}
                  render={<Link href={href} />}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  {label}
                </SheetClose>
              );
            })}
          </nav>
          <SheetFooter className="border-t border-border sm:gap-0">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Theme
              </span>
              <ThemeToggle />
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-40 w-full border-b border-border/60 bg-white shadow-[0_1px_0_0_rgb(0_0_0/0.03)] dark:bg-background dark:shadow-[0_1px_0_0_rgb(0_0_0/0.06)]">
      <a
        href="#main-content"
        className="bg-background text-foreground fixed left-4 top-4 z-[100] -translate-y-[200%] rounded-full border border-border px-4 py-2 text-sm font-medium shadow-md outline-none transition-transform duration-200 ease-out focus:translate-y-0 focus-visible:ring-2 focus-visible:ring-ring"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <Link
          href="/"
          aria-label={`${siteConfig.name} (home)`}
          className="flex shrink-0 items-center outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
        >
          <Image
            src="/logo-ai-driven.png"
            alt=""
            width={180}
            height={45}
            className="h-9 w-auto sm:h-10"
            priority
          />
        </Link>

        <nav
          className="hidden flex-1 justify-center gap-1.5 md:flex"
          aria-label="Main"
        >
          {mainNav.map(({ href, label }) => {
            const active = isNavActive(pathname, href);
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

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <ThemeToggle className="hidden md:inline-flex" />
          <Button
            variant="outline"
            nativeButton={false}
            className="h-10 gap-2 border-primary/80 bg-background px-5 text-sm font-semibold text-primary shadow-sm hover:bg-primary/10 hover:text-primary"
            render={<Link href="/sign-in" />}
          >
            <LogIn className="size-4 shrink-0" aria-hidden />
            Sign in
          </Button>

          <MobileMainNav />
        </div>
      </div>
    </header>
  );
}
