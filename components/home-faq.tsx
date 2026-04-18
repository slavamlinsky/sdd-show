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

export function HomeFaq() {
  return (
    <section className="rounded-[2rem] border border-border/60 bg-card/80 px-6 py-10 shadow-sm ring-1 ring-foreground/[0.04] backdrop-blur-sm sm:px-10 sm:py-12">
      <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        Questions & <GradientText className="font-semibold">answers</GradientText>
      </h2>
      <p className="mt-3 max-w-prose text-lg text-muted-foreground">
        Quick answers. For depth, use the glossary and blog. Course questions live on the course page.
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
