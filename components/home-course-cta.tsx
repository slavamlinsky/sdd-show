import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { GradientText } from "@/components/gradient-text";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { courseMeta } from "@/lib/course-data";
import { cn } from "@/lib/utils";

export function HomeCourseCta() {
  return (
    <section
      className="full-bleed relative overflow-hidden border-y border-border/40"
      aria-labelledby="home-course-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-violet-500/8 via-background to-sky-500/8"
        aria-hidden
      />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20">
        <Reveal className="space-y-6" distance={16}>
          <h2
            id="home-course-heading"
            className="font-heading text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Learn{" "}
            <GradientText className="font-semibold">
              Intent-Driven Engineering
            </GradientText>
          </h2>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            {courseMeta.pitch}
          </p>
          <Link
            href="/course"
            className={cn(
              buttonVariants({ size: "lg" }),
              "inline-flex h-12 gap-2 rounded-md px-8 text-base shadow-md shadow-primary/15",
            )}
          >
            View course
            <ArrowRightIcon className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
