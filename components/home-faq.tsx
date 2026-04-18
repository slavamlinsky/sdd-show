"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GradientText } from "@/components/gradient-text";

const items = [
  {
    id: "what",
    q: "What is spec driven development?",
    a: "Writing clear specs (behavior + acceptance) before or alongside implementation so the whole team shares one source of truth — not just ticket titles.",
  },
  {
    id: "vs",
    q: "How is it different from “we have tickets”?",
    a: "Tickets track work; specs explain outcomes. SDD connects cards to testable intent so rework drops when requirements shift.",
  },
  {
    id: "when",
    q: "When does SDD help most?",
    a: "When multiple people touch the same flow, APIs cross team boundaries, or mistakes are expensive — a short spec pays for itself.",
  },
  {
    id: "tools",
    q: "Do I need special tools?",
    a: "No. A markdown file, a PR description, or a design doc can be enough. Tools help scale, but clarity is the requirement.",
  },
] as const;

export function HomeFaq() {
  return (
    <section className="rounded-[2rem] border border-border/60 bg-card/80 px-6 py-10 shadow-sm ring-1 ring-foreground/[0.04] backdrop-blur-sm sm:px-10 sm:py-12">
      <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        Questions & <GradientText className="font-semibold">answers</GradientText>
      </h2>
      <p className="mt-3 max-w-prose text-lg text-muted-foreground">
        Quick answers — dig into the glossary and blog for more.
      </p>
      <Accordion className="mt-10 w-full" defaultValue={[items[0].id]}>
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
