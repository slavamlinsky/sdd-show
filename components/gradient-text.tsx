import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type GradientTextProps = {
  children: ReactNode;
  className?: string;
};

/** Accent line or phrase — gradient fill (decorative; keep sentence meaning if color is stripped). */
export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
