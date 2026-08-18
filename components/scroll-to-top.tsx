"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Show after this many CSS pixels of vertical scroll (any scroll container). */
const SHOW_AFTER_PX = 280;

function getViewportScrollY(): number {
  if (typeof window === "undefined") return 0;
  const se = document.scrollingElement;
  if (se) return se.scrollTop;
  return window.scrollY ?? 0;
}

function isDocumentScroller(el: HTMLElement): boolean {
  return el === document.documentElement || el === document.body;
}

function isVerticallyScrollable(el: HTMLElement): boolean {
  if (isDocumentScroller(el)) return false;
  const overflowY = getComputedStyle(el).overflowY;
  if (
    overflowY !== "auto" &&
    overflowY !== "scroll" &&
    overflowY !== "overlay"
  ) {
    return false;
  }
  return el.scrollHeight > el.clientHeight + 1;
}

/** Nested overflow panels only — html/body are the document scroller, handled separately. */
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

function snapDocumentToOrigin() {
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  const root = document.scrollingElement;
  if (root) {
    root.scrollTop = 0;
    root.scrollLeft = 0;
  } else {
    window.scrollTo(0, 0);
  }
  html.style.scrollBehavior = prev;
}

function isDocumentScrollEndTarget(target: EventTarget | null): boolean {
  return (
    target === document.scrollingElement ||
    target === document.documentElement ||
    target === document.body ||
    target === document ||
    target === window
  );
}

function scrollPageToTop(
  behavior: ScrollBehavior,
  sentinel: HTMLElement | null
) {
  const nestedOpts: ScrollToOptions = { top: 0, behavior };
  for (const el of collectScrollableAncestors(sentinel)) {
    el.scrollTo(nestedOpts);
  }

  const root = document.scrollingElement;
  if (behavior === "auto") {
    snapDocumentToOrigin();
    return;
  }

  if (root) {
    root.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  let done = false;
  let tid = 0;
  const finish = () => {
    if (done) return;
    done = true;
    window.clearTimeout(tid);
    root?.removeEventListener("scrollend", onEnd);
    window.removeEventListener("scrollend", onEnd);
    snapDocumentToOrigin();
  };
  const onEnd = (ev: Event) => {
    if (!isDocumentScrollEndTarget(ev.target)) return;
    finish();
  };
  root?.addEventListener("scrollend", onEnd);
  window.addEventListener("scrollend", onEnd);
  tid = window.setTimeout(finish, 1200);
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
          /* Sits above footer link row + safe area — don’t cover GitHub / legal line */
          "fixed bottom-28 right-4 z-90 transition-opacity duration-200 sm:bottom-32 sm:right-8",
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
            "bg-primary/25 text-primary shadow-none backdrop-blur-sm",
            "transition-colors hover:bg-primary/35 active:bg-primary/40",
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
