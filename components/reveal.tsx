import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Kept for API compatibility with existing call sites (no-op). */
  delay?: number;
  /** Kept for API compatibility with existing call sites (no-op). */
  distance?: number;
};

/**
 * Layout wrapper only. Scroll/opacity motion was removed: Framer `opacity: 0` +
 * `whileInView` / `useInView` often never resolves in embedded previews and some
 * scroll roots, so blocks stayed invisible (especially inside `overflow-hidden`
 * full-bleed sections).
 */
export function Reveal({ children, className }: RevealProps) {
  return <div className={cn(className)}>{children}</div>;
}
