"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GradientText } from "@/components/gradient-text";
import { cn } from "@/lib/utils";

const items = [
  {
    id: "who",
    q: "Is this only for people who manage a team?",
    a: "No. The four seats are solo founders, full-stack and lead developers (the one-person army), technical leads, and product managers. Architects and seniors fit those seats. It is not an intro-to-coding or prompt-tricks workshop.",
  },
  {
    id: "vibe",
    q: "I already prompt well. Why would I need specs?",
    a: "Informal prompting is fast on greenfield toys. Complex systems punish missing sentences. Specs are how you keep agents aligned when the cost of a wrong edge case is real.",
  },
  {
    id: "sdd-ide",
    q: "How do SDD and intent-driven engineering differ?",
    a: "Spec-driven work treats the specification as the source of truth, then plan, task, and implement. Intent-driven work goes further: you define outcomes and success criteria (the what) and let agents reason through the how inside those contracts.",
  },
  {
    id: "tdd",
    q: "How does this relate to TDD?",
    a: "TDD uses tests to pin behavior before logic. SDD uses written specs (and often tests) so humans and agents share one contract. They stack: specs set scope; tests lock acceptance.",
  },
  {
    id: "time",
    q: "How much time will it take?",
    a: "Hours per week are not locked until the first cohort. The landing syllabus is the map: six modules plus a Monday-morning habit — write one spec before your next code prompt.",
  },
  {
    id: "free",
    q: "Will the course be free?",
    a: "Pricing is still open. Joining the list only means we email you when enrollment options exist. No obligation.",
  },
] as const;

export function CourseFaq() {
  return (
    <section
      id="course-faq"
      aria-labelledby="course-faq-heading"
      className="full-bleed border-y border-border/50 bg-muted/15"
    >
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <h2
            id="course-faq-heading"
            className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Common <GradientText className="font-semibold">questions</GradientText>
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            A few answers before you join the list. Depth lives in the glossary and blog.
          </p>
        </div>
        <Accordion
          multiple
          defaultValue={[]}
          className="mt-12 w-full border-t border-border"
        >
          {items.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="border-0 border-b border-border bg-transparent px-0"
            >
              <AccordionTrigger
                className={cn(
                  "rounded-none border-0 py-5 text-left text-base font-medium text-foreground sm:py-6 sm:text-lg",
                  "hover:no-underline focus-visible:ring-ring focus-visible:ring-offset-background",
                  "[&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
                )}
              >
                {item.q}
              </AccordionTrigger>
              <AccordionContent
                className={cn(
                  "px-0 pb-5 pt-0 text-left text-sm leading-relaxed text-muted-foreground sm:text-[15px]",
                  "[&>div]:px-0 [&>div]:pb-0 [&>div]:pt-0",
                )}
              >
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
