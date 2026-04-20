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
    q: "What is spec driven development?",
    a: "You write behavior and acceptance before (or beside) implementation so everyone shares one source of truth. Ticket titles alone are not specs.",
  },
  {
    id: "vs",
    q: 'How is this different from "we have tickets"?',
    a: "Tickets track work. Specs explain what done means. SDD links the two so rework drops when things shift.",
  },
  {
    id: "when",
    q: "When does SDD help most?",
    a: "When several people touch one flow, APIs cross team lines, or mistakes get expensive. A short spec usually pays for itself.",
  },
  {
    id: "tools",
    q: "Do I need special tools?",
    a: "No. A markdown file, a solid PR description, or a short design doc can be enough. Tools help at scale. Clarity is the requirement.",
  },
] as const;

/** FAQ accordion — typography and borders follow theme (light / dark). */
export function HomeFaq() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 md:py-24 lg:px-16 lg:py-24 xl:px-20">
      <h2 className="text-center font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Frequently asked questions
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
        Quick answers. For depth, use the glossary and blog. Course questions live on the course page.
      </p>

      <Accordion
        multiple
        defaultValue={[items[0].id, items[1].id, items[2].id]}
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
