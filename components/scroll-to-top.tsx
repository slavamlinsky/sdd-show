"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Show after this many CSS pixels of vertical scroll (any scroll container). */
const SHOW_AFTER_PX = 280;

function getViewportScrollY(): number {
  if (typeof window === "undefined") return 0;
  return Math.max(
    window.scrollY ?? 0,
    window.pageYOffset ?? 0,
    document.documentElement?.scrollTop ?? 0,
    document.body?.scrollTop ?? 0
  );
}

function isVerticallyScrollable(el: HTMLElement): boolean {
  const overflowY = getComputedStyle(el).overflowY;
  if (
    overflowY !== "auto" &&
    overflowY !== "scroll" &&
    overflowY !== "overlay"
  ) {
    return false;
  }
  return el.scrollHeight > el.clientHeight;
}

/** Nearest scroll container first (sentinel → … → document), same list used for visibility and scroll-to-top. */
function collectScrollableAncestors(start: HTMLElement | null): HTMLElement[] {
  const out: HTMLElement[] = [];
  if (!start || typeof window === "undefined") return out;
  let el: HTMLElement | null = start;
  while (el) {
    if (isVerticallyScrollable(el)) {
      out.push(el);
    }
    el = el.parentElement;
  }
  return out;
}

function getMaxVerticalScroll(sentinel: HTMLElement | null): number {
  let max = getViewportScrollY();
  for (const el of collectScrollableAncestors(sentinel)) {
    max = Math.max(max, el.scrollTop);
  }
  return max;
}

function scrollPageToTop(behavior: ScrollBehavior, sentinel: HTMLElement | null) {
  for (const el of collectScrollableAncestors(sentinel)) {
    el.scrollTo({ top: 0, behavior });
  }
  document.documentElement.scrollTo({ top: 0, behavior });
  document.body.scrollTo({ top: 0, behavior });
  if (window.scrollY > 0) {
    window.scrollTo({ top: 0, behavior });
  }
}

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!visible) {
      buttonRef.current?.blur();
    }
  }, [visible]);

  useEffect(() => {
    let scrollableWithListeners: HTMLElement[] = [];

    const update = () => {
      setVisible(getMaxVerticalScroll(sentinelRef.current) > SHOW_AFTER_PX);
    };

    const refreshScrollableListeners = () => {
      for (const el of scrollableWithListeners) {
        el.removeEventListener("scroll", update);
      }
      scrollableWithListeners = collectScrollableAncestors(sentinelRef.current);
      for (const el of scrollableWithListeners) {
        el.addEventListener("scroll", update, { passive: true });
      }
    };

    const onResize = () => {
      refreshScrollableListeners();
      update();
    };

    update();
    requestAnimationFrame(() => requestAnimationFrame(update));
    refreshScrollableListeners();

    window.addEventListener("scroll", update, { passive: true });
    document.addEventListener("scroll", update, { capture: true, passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pageshow", update);

    return () => {
      for (const el of scrollableWithListeners) {
        el.removeEventListener("scroll", update);
      }
      window.removeEventListener("scroll", update);
      document.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pageshow", update);
    };
  }, []);

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden
        className="pointer-events-none h-px w-full shrink-0"
      />
      <div
        className={cn(
          "fixed bottom-6 right-4 z-[90] transition-opacity duration-200 sm:bottom-8 sm:right-8",
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <button
          ref={buttonRef}
          type="button"
          disabled={!visible}
          tabIndex={visible ? 0 : -1}
          aria-hidden={!visible ? true : undefined}
          aria-label="Scroll to top"
          className={cn(
            /* Outline / transparent chip (e.g. footer-style): shows page behind, accent border + icon */
            "pointer-events-auto flex size-11 cursor-pointer items-center justify-center rounded-md border-2 border-primary",
            "bg-transparent text-primary shadow-none",
            "transition-colors hover:bg-primary/10 active:bg-primary/15",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:pointer-events-none disabled:opacity-40"
          )}
          onClick={() => {
            if (!visible) return;
            const reduce =
              typeof window !== "undefined" &&
              window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
            scrollPageToTop(behavior, sentinelRef.current);
          }}
        >
          <ChevronUpIcon className="size-5 shrink-0" strokeWidth={2.25} aria-hidden />
        </button>
      </div>
    </>
  );
}
