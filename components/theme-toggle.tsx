"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  variant?: "button" | "switch";
};

const subscribeNoop = () => () => {};
const getClientMounted = () => true;
const getServerMounted = () => false;

export function ThemeToggle({
  className,
  variant = "button",
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getClientMounted,
    getServerMounted,
  );

  const isDark = resolvedTheme === "dark";
  const label = mounted
    ? isDark
      ? "Switch to light theme"
      : "Switch to dark theme"
    : "Theme";

  const toggle = () => setTheme(isDark ? "light" : "dark");

  if (variant === "switch") {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={mounted ? isDark : false}
        aria-label={label}
        disabled={!mounted}
        onClick={toggle}
        className={cn(
          "relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border p-0.5 transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover",
          "disabled:cursor-default disabled:opacity-50",
          isDark ? "border-border bg-zinc-700" : "border-border/80 bg-muted",
          className,
        )}
      >
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-between px-1.5"
          aria-hidden
        >
          <Sun
            className={cn(
              "size-3 fill-amber-400 text-amber-500 transition-opacity duration-500 ease-in-out motion-reduce:transition-none",
              !isDark && "opacity-0",
            )}
          />
          <Moon
            className={cn(
              "size-3 text-foreground transition-opacity duration-500 ease-in-out motion-reduce:transition-none",
              isDark && "opacity-0",
            )}
          />
        </span>
        <span
          className={cn(
            "pointer-events-none relative z-10 flex size-5 items-center justify-center rounded-full shadow-sm ring-1 ring-border/30",
            "transform-gpu will-change-transform transition-[transform,background-color,color] duration-500 ease-in-out motion-reduce:transition-none",
            isDark ? "bg-zinc-950 text-zinc-100" : "bg-white text-amber-500",
          )}
          style={{ transform: isDark ? "translateX(1.5rem)" : "translateX(0)" }}
        >
          <Sun
            className={cn(
              "absolute size-3 fill-amber-400 text-amber-500 transition-opacity duration-500 ease-in-out motion-reduce:transition-none",
              isDark ? "opacity-0" : "opacity-100",
            )}
            strokeWidth={2.25}
            aria-hidden
          />
          <Moon
            className={cn(
              "absolute size-3 transition-opacity duration-500 ease-in-out motion-reduce:transition-none",
              isDark ? "opacity-100" : "opacity-0",
            )}
            strokeWidth={2.25}
            aria-hidden
          />
        </span>
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn(
        "size-9 shrink-0 cursor-pointer rounded-full border-border/60 bg-background/80 shadow-sm backdrop-blur-sm",
        className,
      )}
      disabled={!mounted}
      aria-label={label}
      onClick={toggle}
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-4" aria-hidden />
        ) : (
          <Moon className="size-4" aria-hidden />
        )
      ) : (
        <Moon className="size-4 opacity-40" aria-hidden />
      )}
    </Button>
  );
}
