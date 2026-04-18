"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SHOW_AFTER = 480;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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
          "pointer-events-auto h-11 w-11 rounded-full shadow-lg shadow-foreground/10",
          "bg-primary text-primary-foreground ring-1 ring-foreground/10",
          "hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring"
        )}
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: reduce ? "auto" : "smooth",
          });
        }}
      >
        <ChevronUpIcon className="size-5" />
      </Button>
    </div>
  );
}
