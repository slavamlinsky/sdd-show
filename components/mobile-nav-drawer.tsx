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
 * Mobile nav: plain overlay + sliding panel (Supabase-style), portaled to body.
 * Avoids modal dialog focus/scroll lock quirks on older iOS Safari vs Sheet/Dialog.
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

  const layer = mounted ? (
    <>
      <div
        role="presentation"
        className={cn(
          "fixed inset-0 z-[200] bg-black/30 transition-opacity duration-200 motion-reduce:transition-none [touch-action:manipulation]",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden
        onClick={() => setOpen(false)}
      />
      <div
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        inert={!open ? true : undefined}
        className={cn(
          "fixed top-0 right-0 z-[201] flex h-[100vh] w-[min(100vw,20rem)] flex-col overflow-hidden border-l border-border bg-popover text-popover-foreground shadow-xl [touch-action:manipulation] motion-reduce:transition-none md:hidden",
          "pb-[env(safe-area-inset-bottom,0px)] pt-[env(safe-area-inset-top,0px)]",
          "transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
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
              "-mr-1 shrink-0"
            )}
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <XIcon className="size-4" aria-hidden />
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
        <div className="mt-auto shrink-0 border-t border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Theme
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  ) : null;

  return (
    <div className="relative z-[45] md:hidden">
      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "[touch-action:manipulation]"
        )}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <MenuIcon className="size-4" aria-hidden />
      </button>
      {mounted && layer ? createPortal(layer, document.body) : null}
    </div>
  );
}
