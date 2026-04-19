"use client";

import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  GraduationCap,
  MenuIcon,
  Newspaper,
  Video,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RefObject } from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { mainNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const NAV_ICONS: Record<(typeof mainNav)[number]["href"], LucideIcon> = {
  "/glossary": BookOpen,
  "/videos": Video,
  "/course": GraduationCap,
  "/blog": Newspaper,
};

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type MobileNavDrawerProps = {
  headerRef: RefObject<HTMLElement | null>;
};

/**
 * Mobile nav: ~70% drawer from the right, dimmed + blurred area only below the header
 * (header stays clear — avoids old iOS hit-testing issues on full-screen invisible layers).
 */
export function MobileNavDrawer({ headerRef }: MobileNavDrawerProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(64);
  const pathname = usePathname();
  const scrollLockY = useRef(0);

  const closeMobile = useCallback(() => setOpen(false), []);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const measure = () => {
      setHeaderHeight(Math.round(el.getBoundingClientRect().height));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [headerRef]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mounted || typeof document === "undefined") return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
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
  }, [open, mounted, closeMobile]);

  const layer =
    mounted &&
    createPortal(
      <div
        className={cn(
          "md:hidden fixed left-0 right-0 z-[45] [touch-action:manipulation]",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        style={{
          top: headerHeight,
          height: `calc(100dvh - ${headerHeight}px)`,
        }}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          className={cn(
            "absolute inset-0 bg-foreground/35 supports-backdrop-filter:backdrop-blur-sm transition-opacity duration-300 ease-out motion-reduce:transition-none [touch-action:manipulation]",
            open ? "opacity-100" : "opacity-0"
          )}
          aria-label="Close menu"
          onClick={closeMobile}
        />
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal={open ? true : undefined}
          aria-label="Main navigation"
          tabIndex={open ? -1 : undefined}
          className={cn(
            "absolute right-0 top-0 z-10 flex h-full w-[70%] min-w-[13.5rem] flex-col border-l border-border bg-background text-foreground shadow-xl",
            "transform-gpu transition-transform duration-300 ease-out motion-reduce:transition-none",
            "[touch-action:manipulation] [-webkit-overflow-scrolling:touch]",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex min-h-0 flex-1 flex-col pb-[env(safe-area-inset-bottom,0px)]">
            <nav
              className="flex flex-1 flex-col gap-2 overflow-y-auto overscroll-y-contain px-3 py-4"
              aria-label="Mobile"
            >
              {mainNav.map(({ href, label }) => {
                const active = isNavActive(pathname, href);
                const Icon = NAV_ICONS[href];
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMobile}
                    tabIndex={open ? undefined : -1}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border-b border-border px-3 py-4 text-lg font-medium [-webkit-tap-highlight-color:transparent]",
                      "hover:bg-muted active:bg-muted/80",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/90"
                    )}
                  >
                    <Icon className="size-5 shrink-0 text-primary/80" aria-hidden />
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
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <button
        type="button"
        className={cn(
          "md:hidden inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-primary shadow-sm",
          "hover:bg-muted [-webkit-tap-highlight-color:transparent] [touch-action:manipulation]"
        )}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? (
          <XIcon className="h-5 w-5" aria-hidden />
        ) : (
          <MenuIcon className="h-5 w-5" aria-hidden />
        )}
      </button>
      {layer}
    </>
  );
}
