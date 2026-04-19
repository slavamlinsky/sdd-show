import Image from "next/image";
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
      "Roadmaps, priorities, and outcomes: what to build, for whom, and why it matters — before scope quietly drifts.",
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
      "Specs, code, APIs, and AI-assisted workflows. Ship what you documented — with contracts and context that hold up.",
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
    <section className="full-bleed relative overflow-hidden border-y border-border/40 bg-gradient-to-b from-muted/25 via-background to-muted/15">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.09),transparent_70%)]" aria-hidden />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
          <Reveal className="order-2 lg:order-1" distance={20}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-border/60 bg-muted shadow-xl ring-1 ring-foreground/[0.04]">
              <Image
                src="/images/home-pillars.png"
                alt="Professional working at a desk with laptop and monitors — organized product development"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>

          <div className="order-1 space-y-6 lg:order-2">
            <Reveal distance={16}>
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                <GradientText className="font-semibold">Product</GradientText>, Design, Build &amp; Quality
              </h2>
              <p className="mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                Foundational vocabulary for the AI-driven product lifecycle. Definitions stay short in the{" "}
                <Link href="/glossary" className="font-medium text-foreground underline-offset-4 hover:underline">
                  glossary
                </Link>
                ; go deeper on the{" "}
                <Link href="/blog" className="font-medium text-foreground underline-offset-4 hover:underline">
                  blog
                </Link>
                , watch{" "}
                <Link href="/videos" className="font-medium text-foreground underline-offset-4 hover:underline">
                  videos
                </Link>{" "}
                for visual walkthroughs, or take the{" "}
                <Link href="/course" className="font-medium text-foreground underline-offset-4 hover:underline">
                  course
                </Link>{" "}
                for an end-to-end workflow.
              </p>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2">
              {pillars.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={i * 0.05} distance={12}>
                    <div className="flex gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm ring-1 ring-foreground/[0.03] backdrop-blur-sm">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <div className="min-w-0 space-y-1.5">
                        <h3 className="font-heading text-sm font-semibold text-foreground">{item.title}</h3>
                        <p className="text-[13px] leading-snug text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.12}>
              <Link
                href="/glossary"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "inline-flex h-11 rounded-xl border-primary/30 px-6 text-sm font-semibold"
                )}
              >
                Open glossary & core concepts
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
