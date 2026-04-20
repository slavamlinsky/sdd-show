import Link from "next/link";
import { Code2, Package, Palette, ShieldCheck } from "lucide-react";
import { GradientText } from "@/components/gradient-text";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const pillars = [
  {
    title: "Product",
    description:
      "Roadmaps, priorities, and outcomes: what to build, for whom, and why it matters, before scope quietly drifts.",
    icon: Package,
  },
  {
    title: "Design",
    description:
      "Flows, clarity, and research-backed UX. Align interfaces and narratives with the behavior your specs describe.",
    icon: Palette,
  },
  {
    title: "Build",
    description:
      "Ship what you documented—contracts and context that still hold up in production. Specs, code, APIs, and workflows.",
    icon: Code2,
  },
  {
    title: "Quality",
    description:
      "Tests, evals, and traceability from intent to release. Catch regressions and model drift before users do.",
    icon: ShieldCheck,
  },
] as const;

export function HomePillars() {
  return (
    <section
      className="full-bleed relative overflow-hidden border-y border-border/30"
      aria-labelledby="home-pillars-heading"
    >
      {/* Soft diagonal wash — pale blue → lavender */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-100/70 via-indigo-50/50 to-violet-100/65 dark:from-sky-950/25 dark:via-indigo-950/20 dark:to-violet-950/25"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(99,102,241,0.08),transparent_55%)]" aria-hidden />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <Reveal className="mx-auto max-w-3xl text-center" distance={18}>
          <h2
            id="home-pillars-heading"
            className="font-heading text-3xl text-balance font-semibold leading-tight tracking-tight text-foreground sm:text-4xl"
          >
            Vocabulary for the{" "}
            <GradientText className="font-semibold whitespace-nowrap">AI-driven product lifecycle</GradientText>
          </h2>
        </Reveal>

        <ul className="mt-12 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 sm:gap-7 lg:mt-14 lg:gap-8">
          {pillars.map((item, i) => {
            const Icon = item.icon;
            return (
              <li key={item.title}>
                <Reveal delay={i * 0.06} distance={14}>
                  <div
                    className={cn(
                      "flex h-full gap-5 rounded-xl bg-card p-8 shadow-sm hover:-translate-y-1",
                      "ring-1 ring-border/50 dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)]"
                    )}
                  >
                    <span
                      className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/12 via-white to-sky-500/15 ring-1 ring-violet-500/15 dark:from-violet-500/20 dark:via-card dark:to-sky-500/20 dark:ring-violet-400/20"
                      aria-hidden
                    >
                      <Icon className="size-12 text-violet-600 dark:text-sky-400" strokeWidth={1.65} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-heading text-xl font-semibold leading-snug tracking-tight text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-[15px] leading-[1.7] text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal delay={0.12} className="mt-10 flex justify-center sm:mt-12">
          <Link
            href="/glossary"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 rounded-xl border-primary/25 bg-background/80 px-8 text-sm font-semibold shadow-sm backdrop-blur-sm hover:bg-background"
            )}
          >
            Open glossary &amp; core concepts
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
