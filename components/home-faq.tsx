"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const items = [
  {
    id: "what",
    q: "What is intent-driven development?",
    a: "It means defining the outcome, behavior, and success criteria before implementation starts. Teams align on what success looks like so execution becomes faster and more predictable.",
  },
  {
    id: "vs",
    q: 'How is this different from "we have tickets"?',
    a: 'Tickets track work, but intent explains what "done" actually means. Intent-driven specs connect goals, behavior, and acceptance criteria so teams don\'t rely on assumptions.',
  },
  {
    id: "when",
    q: "When does this approach help the most?",
    a: "It shines when multiple people touch the same flow, work crosses team boundaries, mistakes are costly, or requirements change often. A short spec usually saves far more time than it takes to write.",
  },
  {
    id: "tools",
    q: "Do I need special tools?",
    a: "No. A markdown doc, a strong PR description, or a short design brief is enough. Tools help at scale, but clarity of intent is the real requirement.",
  },
  {
    id: "who",
    q: "Who can use intent-driven development?",
    a: "Any team building software can use it, including product managers, designers, engineers, QA, founders, and agencies. If people need shared clarity before building, this approach fits.",
  },
] as const;

/** FAQ accordion — typography and borders follow theme (light / dark). */
export function HomeFaq() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 md:py-24 lg:px-16 lg:py-24 xl:px-20">
      <h2 className="text-center font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Frequently asked questions
      </h2>
      <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
        Quick answers. For deeper dives, visit the glossary and blog. Course questions are answered on the course page. You can also explore our key videos to see the ideas in action.
      </p>

      <Accordion multiple defaultValue={[]} className="mt-12 w-full border-t border-border">
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
                "[&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground"
              )}
            >
              {item.q}
            </AccordionTrigger>
            <AccordionContent
              className={cn(
                "px-0 pb-5 pt-0 text-left text-sm leading-relaxed text-muted-foreground sm:text-[15px]",
                "[&>div]:px-0 [&>div]:pb-0 [&>div]:pt-0"
              )}
            >
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
