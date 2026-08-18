import { courseLifecycle } from "@/lib/course-data";
import { cn } from "@/lib/utils";

export function CourseHeroPanel() {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/90 shadow-xl ring-1 ring-foreground/4",
        "backdrop-blur-sm"
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_0%_0%,rgba(99,102,241,0.12),transparent_55%),radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(14,165,233,0.1),transparent_50%)]"
        aria-hidden
      />
      <div className="relative px-6 py-6 sm:px-7 sm:py-7">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Spec-Driven Development loop
        </p>
        <p className="mt-2 font-heading text-lg font-semibold tracking-tight text-foreground">
          The spec is the source of truth
        </p>
        <ol className="mt-6 grid grid-cols-2 gap-3">
          {courseLifecycle.map((item) => (
            <li
              key={item.step}
              className="rounded-2xl border border-border/50 bg-background/80 px-3.5 py-3.5 shadow-sm"
            >
              <span className="font-mono text-[11px] font-semibold text-primary">{item.step}</span>
              <p className="mt-1 font-heading text-sm font-semibold text-foreground">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
