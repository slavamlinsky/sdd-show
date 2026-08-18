import { Code2, Package, Palette, ShieldCheck, type LucideIcon } from "lucide-react";
import type { Pillar } from "@/lib/taxonomy";

/** UI order: Product → Design → Build → Quality (lifecycle, not data-file order). */
export const PILLAR_FILTER_ORDER: Pillar[] = ["Product", "Design", "Build", "Quality"];

export const PILLAR_UI: Record<
  Pillar,
  { icon: LucideIcon; idle: string; active: string }
> = {
  Product: {
    icon: Package,
    idle: "border-violet-200 bg-violet-50 text-violet-800 hover:border-violet-300 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200",
    active:
      "border-violet-400 bg-violet-100 text-violet-900 ring-2 ring-violet-400/40 dark:border-violet-400 dark:bg-violet-500/25 dark:text-violet-50",
  },
  Design: {
    icon: Palette,
    idle: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800 hover:border-fuchsia-300 dark:border-fuchsia-500/30 dark:bg-fuchsia-500/10 dark:text-fuchsia-200",
    active:
      "border-fuchsia-400 bg-fuchsia-100 text-fuchsia-900 ring-2 ring-fuchsia-400/40 dark:border-fuchsia-400 dark:bg-fuchsia-500/25 dark:text-fuchsia-50",
  },
  Build: {
    icon: Code2,
    idle: "border-sky-200 bg-sky-50 text-sky-800 hover:border-sky-300 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200",
    active:
      "border-sky-400 bg-sky-100 text-sky-900 ring-2 ring-sky-400/40 dark:border-sky-400 dark:bg-sky-500/25 dark:text-sky-50",
  },
  Quality: {
    icon: ShieldCheck,
    idle: "border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-300 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
    active:
      "border-emerald-400 bg-emerald-100 text-emerald-900 ring-2 ring-emerald-400/40 dark:border-emerald-400 dark:bg-emerald-500/25 dark:text-emerald-50",
  },
};
