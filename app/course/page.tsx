import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CourseLeadForm } from "@/components/course-lead-form";
import { GradientText } from "@/components/gradient-text";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpenIcon, ListOrderedIcon, SparklesIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Course",
  description:
    "A structured SDD course is on the way — join the list for launch updates and free resources in the meantime.",
};

const modules = [
  {
    title: "Foundations",
    description: "What SDD is, how specs differ from tickets, and how to read a spec critically.",
  },
  {
    title: "Writing acceptance that sticks",
    description: "Turn vague goals into testable criteria your whole team can agree on.",
  },
  {
    title: "From idea to vertical slice",
    description: "Scoping, sequencing, and keeping docs alive without drowning in paperwork.",
  },
  {
    title: "APIs and contracts",
    description: "Boundaries, error behavior, versioning — specs that survive real integrations.",
  },
  {
    title: "Review & alignment",
    description: "Rituals that make specs a source of truth instead of shelf-ware.",
  },
  {
    title: "Capstone patterns",
    description: "Putting it together on a realistic feature — coming soon.",
  },
] as const;

export default function CoursePage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-border/50">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_30%_-25%,rgba(99,102,241,0.14),transparent_55%),radial-gradient(ellipse_60%_45%_at_100%_10%,rgba(14,165,233,0.09),transparent_45%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:gap-16 sm:px-6 sm:py-28 lg:grid-cols-[1fr_minmax(0,24rem)] lg:items-center">
          <Reveal className="space-y-8" distance={28}>
            <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Coming soon</p>
            <h1 className="font-heading text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              Spec driven development — the <GradientText className="font-semibold">course</GradientText>
            </h1>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              A practical, project-shaped path from fuzzy ideas to specs that your team actually uses. Join the list to
              get notified when enrollment opens — we will not spam you.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <a
                href="#lead"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "inline-flex h-12 justify-center rounded-full px-8 text-base text-center shadow-md shadow-primary/15"
                )}
              >
                Get updates
              </a>
              <Link
                href="/blog"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 rounded-full border-border/80 px-8 justify-center"
                )}
              >
                Read free articles
              </Link>
            </div>
          </Reveal>
          <Reveal className="relative" delay={0.06} distance={22}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-border/60 bg-muted shadow-xl ring-1 ring-foreground/[0.04]">
              <Image
                src="/images/hero-placeholder.svg"
                alt="Placeholder artwork for the upcoming SDD course"
                fill
                className="object-cover opacity-95"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
              <div className="absolute inset-0 flex items-end p-5">
                <p className="rounded-2xl bg-background/90 px-4 py-2 text-xs text-muted-foreground ring-1 ring-border shadow-sm backdrop-blur">
                  Final branding & illustrations can replace this block.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {[
            {
              icon: SparklesIcon,
              title: "Outcome-driven",
              body: "Every module ties to a skill you can apply on your next PR — not theory for its own sake.",
            },
            {
              icon: BookOpenIcon,
              title: "Specs you keep",
              body: "Learn how to keep documents trustworthy when discovery never stops.",
            },
            {
              icon: ListOrderedIcon,
              title: "Structured path",
              body: "Modules build on each other — skip ahead if you already practice pieces of SDD.",
            },
          ].map((block, i) => {
            const Icon = block.icon;
            return (
              <Reveal key={block.title} delay={i * 0.06} className="space-y-3 rounded-3xl border border-border/50 bg-card/50 p-7 shadow-sm ring-1 ring-foreground/[0.03]">
                <Icon className="size-9 text-primary" aria-hidden />
                <h2 className="font-heading text-xl font-semibold">{block.title}</h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{block.body}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border/50 bg-gradient-to-b from-muted/35 to-muted/15">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <Reveal className="space-y-4">
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Module <GradientText className="font-semibold">outline</GradientText>
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Placeholder syllabus — titles and blurbs will harden as the course is built.
            </p>
          </Reveal>
          <ol className="mt-12 flex flex-col gap-4">
            {modules.map((m, i) => (
              <li key={m.title} className="list-none">
                <Reveal delay={i * 0.04} distance={12}>
                  <div className="flex gap-4 rounded-3xl border border-border/70 bg-background px-6 py-6 shadow-sm ring-1 ring-foreground/[0.04] sm:gap-6 sm:px-8">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-mono text-sm font-semibold text-primary">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-foreground">{m.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{m.description}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Reveal>
        <section id="lead" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-xl space-y-4 text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Get <GradientText className="font-semibold">notified</GradientText>
            </h2>
            <p className="text-lg text-muted-foreground">
              Leave your email — we will only write about course access and major resource drops.
            </p>
          </div>
          <div className="mt-12">
            <CourseLeadForm />
          </div>
          <p className="mt-12 text-center text-sm text-muted-foreground">
            Prefer reading first?{" "}
            <Link href="/blog" className="font-semibold text-primary underline-offset-4 hover:underline">
              Browse the blog
            </Link>{" "}
            or{" "}
            <Link href="/videos" className="font-semibold text-primary underline-offset-4 hover:underline">
              watch curated videos
            </Link>
            .
          </p>
        </section>
      </Reveal>
    </div>
  );
}
