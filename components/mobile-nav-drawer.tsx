"use client";

import { createPortal } from "react-dom";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { mainNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Mobile nav: backdrop + panel portaled to body only while open.
 * Older iOS Safari often still hit-tests a fullscreen fixed layer even with
 * opacity:0 + pointer-events:none, which blocks the hamburger — Supabase-style
 * menus avoid leaving that layer mounted when closed.
 */
export function MobileNavDrawer() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const titleId = useId();
  const panelId = useId();
  const scrollLockY = useRef(0);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mounted || typeof document === "undefined") return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    if (!open) {
      return;
    }

    document.addEventListener("keydown", onKeyDown);
    scrollLockY.current = window.scrollY;
    const { body } = document;
    body.style.position = "fixed";
    body.style.top = `-${scrollLockY.current}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo(0, scrollLockY.current);
    };
  }, [open, mounted]);

  /** Same chip language as `HomePillars` icons — larger tap target (size-14) helps older phones. */
  const menuTriggerChip = cn(
    "flex size-14 shrink-0 items-center justify-center rounded-2xl border-0 shadow-none outline-none",
    "bg-gradient-to-br from-violet-500/12 via-white to-sky-500/15 ring-1 ring-violet-500/15",
    "dark:from-violet-500/20 dark:via-card dark:to-sky-500/20 dark:ring-violet-400/20",
    "text-violet-600 dark:text-sky-400",
    "cursor-pointer [touch-action:manipulation] [-webkit-tap-highlight-color:transparent]",
    "hover:opacity-90 active:opacity-80"
  );

  return (
    <div className="relative z-[60] md:hidden">
      <button
        type="button"
        className={menuTriggerChip}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? (
          <XIcon className="size-6 pointer-events-none" strokeWidth={1.65} aria-hidden />
        ) : (
          <MenuIcon className="size-6 pointer-events-none" strokeWidth={1.65} aria-hidden />
        )}
      </button>
      {mounted && open
        ? createPortal(
            <>
              <div
                role="presentation"
                className="fixed inset-0 z-[200] bg-black/30 [touch-action:manipulation]"
                aria-hidden
                onClick={() => setOpen(false)}
              />
              <div
                id={panelId}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className={cn(
                  "fixed top-0 right-0 z-[201] flex h-[100vh] w-[min(100vw,20rem)] flex-col overflow-hidden border-l border-border bg-popover text-popover-foreground shadow-xl md:hidden",
                  "pb-[env(safe-area-inset-bottom,0px)] pt-[env(safe-area-inset-top,0px)]",
                  "[touch-action:manipulation] [-webkit-overflow-scrolling:touch]"
                )}
              >
                <div className="flex shrink-0 items-center justify-between border-b border-border p-4">
                  <h2
                    id={titleId}
                    className="font-heading text-base font-medium text-foreground"
                  >
                    Menu
                  </h2>
                  <button
                    type="button"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon-sm" }),
                      "-mr-1 shrink-0 cursor-pointer [-webkit-tap-highlight-color:transparent]"
                    )}
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                  >
                    <XIcon className="size-4 pointer-events-none" aria-hidden />
                  </button>
                </div>
                <nav
                  className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain p-2"
                  aria-label="Mobile main"
                >
                  {mainNav.map(({ href, label }) => {
                    const active = isNavActive(pathname, href);
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "rounded-lg px-3 py-2.5 text-sm font-medium [-webkit-tap-highlight-color:transparent]",
                          active
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground active:bg-muted/80 hover:bg-muted/60 hover:text-foreground"
                        )}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="mt-auto shrink-0 border-t border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      Theme
                    </span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </>,
            document.body
          )
        : null}
    </div>
  );
}
