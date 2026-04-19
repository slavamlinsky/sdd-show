import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type GradientTextProps = {
  children: ReactNode;
  className?: string;
  /** Dark surface (modal, navy section): lighter solid fallback if background-clip is unsupported */
  onDark?: boolean;
};

/** Inline span inside headings — meetami-style gradient (see `.gradient-text-fill` in globals.css). */
export function GradientText({ children, className, onDark }: GradientTextProps) {
  return (
    <span
      className={cn(
        "gradient-text-fill",
        onDark && "gradient-text-fill--on-dark",
        className
      )}
    >
      {children}
    </span>
  );
}
