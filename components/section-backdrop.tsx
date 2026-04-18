import { cn } from "@/lib/utils";

/** Light radial washes for section personality — keep opacity low for readability. */
const toneClass = {
  violet:
    "bg-[radial-gradient(ellipse_70%_60%_at_50%_-30%,rgba(99,102,241,0.11),transparent_65%),radial-gradient(ellipse_55%_40%_at_100%_0%,rgba(139,92,246,0.06),transparent_50%)]",
  sky: "bg-[radial-gradient(ellipse_75%_55%_at_40%_-25%,rgba(14,165,233,0.11),transparent_60%),radial-gradient(ellipse_50%_45%_at_0%_20%,rgba(56,189,248,0.06),transparent_55%)]",
  emerald:
    "bg-[radial-gradient(ellipse_70%_50%_at_20%_-20%,rgba(16,185,129,0.1),transparent_58%),radial-gradient(ellipse_60%_45%_at_90%_10%,rgba(52,211,153,0.06),transparent_50%)]",
  amber:
    "bg-[radial-gradient(ellipse_65%_50%_at_80%_-15%,rgba(245,158,11,0.1),transparent_58%),radial-gradient(ellipse_50%_40%_at_10%_30%,rgba(251,191,36,0.06),transparent_52%)]",
  rose: "bg-[radial-gradient(ellipse_70%_55%_at_40%_-20%,rgba(244,63,94,0.09),transparent_60%),radial-gradient(ellipse_55%_45%_at_100%_40%,rgba(251,113,133,0.05),transparent_52%)]",
} as const;

export type SectionBackdropTone = keyof typeof toneClass;

type Props = {
  tone?: SectionBackdropTone;
  className?: string;
  /** Height of the gradient wash (default ~hero band) */
  heightClass?: string;
};

export function SectionBackdrop({
  tone = "violet",
  className,
  heightClass = "h-[min(420px,48vh)]",
}: Props) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0",
        heightClass,
        toneClass[tone],
        className
      )}
      aria-hidden
    />
  );
}
