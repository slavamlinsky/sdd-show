"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Sentinel must sit at the top of scrollable page content (first node inside `<main>`). */
function scrollPageToTop(behavior: ScrollBehavior, sentinel: HTMLElement | null) {
  let el: HTMLElement | null = sentinel;
  while (el) {
    if (el.scrollTop > 0) {
      el.scrollTo({ top: 0, behavior });
    }
    el = el.parentElement;
  }
  if (window.scrollY > 0) {
    window.scrollTo({ top: 0, behavior });
  }
}

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver !== "undefined") {
      const io = new IntersectionObserver(
        ([entry]) => {
          setVisible(!entry.isIntersecting);
        },
        { root: null, threshold: 0, rootMargin: "0px" }
      );
      io.observe(el);
      return () => io.disconnect();
    }

    const y = () =>
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    const onScroll = () => setVisible(y() > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          "fixed bottom-6 right-4 z-50 transition-opacity duration-200 sm:bottom-8 sm:right-8",
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <Button
          type="button"
          variant="default"
          size="icon"
          aria-label="Scroll to top"
          className={cn(
            "pointer-events-auto h-11 w-11 cursor-pointer rounded-2xl shadow-lg shadow-foreground/10",
            "bg-primary text-primary-foreground ring-1 ring-foreground/10",
            "hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring"
          )}
          onClick={() => {
            const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
            scrollPageToTop(behavior, sentinelRef.current);
          }}
        >
          <ChevronUpIcon className="size-5" />
        </Button>
      </div>
    </>
  );
}
