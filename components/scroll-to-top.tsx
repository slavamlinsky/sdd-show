"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronUpIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
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

/** Sentinel sits at the top of `<main>`; walk ancestors for nested scroll containers (IDE previews, etc.). */
function scrollPageToTop(behavior: ScrollBehavior, sentinel: HTMLElement | null) {
  let el: HTMLElement | null = sentinel;
  while (el) {
    if (el.scrollTop > 0) {
      el.scrollTo({ top: 0, behavior });
    }
    el = el.parentElement;
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

  useEffect(() => {
    const update = () => {
      setVisible(getViewportScrollY() > SHOW_AFTER_PX);
    };

    update();
    requestAnimationFrame(() => requestAnimationFrame(update));

    window.addEventListener("scroll", update, { passive: true });
    document.addEventListener("scroll", update, { capture: true, passive: true });
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("pageshow", update);

    return () => {
      window.removeEventListener("scroll", update);
      document.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
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
          type="button"
          aria-label="Scroll to top"
          className={cn(
            buttonVariants({ variant: "default", size: "icon" }),
            "pointer-events-auto h-11 min-h-11 w-11 min-w-11 cursor-pointer rounded-2xl shadow-lg shadow-foreground/10",
            "ring-1 ring-foreground/10 hover:bg-primary/90",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
          onClick={() => {
            const reduce =
              typeof window !== "undefined" &&
              window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
            scrollPageToTop(behavior, sentinelRef.current);
          }}
        >
          <ChevronUpIcon className="size-5" />
        </button>
      </div>
    </>
  );
}
