import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  minutes: number;
  className?: string;
};

/** Compact read-time chip: small clock icon + `2min` (not shouty caps). */
export function BlogReadingTime({ minutes, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 tabular-nums normal-case tracking-normal font-medium",
        className
      )}
      aria-label={`${minutes} minute${minutes === 1 ? "" : "s"} to read`}
    >
      <Clock className="size-3.5 shrink-0 opacity-70" strokeWidth={2} aria-hidden />
      <span>{minutes}min</span>
    </span>
  );
}
