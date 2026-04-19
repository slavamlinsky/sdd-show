"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { GlossaryTerm } from "@/lib/glossary-data";

export function GlossaryAccordion({ terms }: { terms: GlossaryTerm[] }) {
  const first = terms[0]?.slug;

  return (
    <div className="mt-16 overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/90 shadow-sm ring-1 ring-foreground/[0.04] backdrop-blur-sm">
      <Accordion
        className="w-full"
        defaultValue={first ? [first] : []}
        multiple={false}
      >
        {terms.map((term) => (
          <AccordionItem
            key={term.slug}
            value={term.slug}
            id={term.slug}
            className="scroll-mt-28 border-border/60 px-5 sm:px-10"
          >
            <AccordionTrigger className="items-center gap-3 py-4 text-left hover:no-underline sm:py-5 [&>svg]:self-center">
              <span className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                {term.title}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-6 sm:pb-8">
              <ul className="flex flex-wrap gap-1.5 pb-3" aria-label="Pillars">
                {term.categories.map((label) => (
                  <li key={label}>
                    <Badge variant="outline" size="xs">
                      {label}
                    </Badge>
                  </li>
                ))}
              </ul>
              <p className="text-sm leading-relaxed text-muted-foreground">{term.shortDefinition}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
