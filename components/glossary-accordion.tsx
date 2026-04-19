"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { GlossaryTerm } from "@/lib/glossary-data";
import { cn } from "@/lib/utils";

export function GlossaryAccordion({ terms }: { terms: GlossaryTerm[] }) {
  return (
    <Accordion
      multiple={false}
      className={cn(
        "mt-16 grid w-full list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 md:gap-x-8 md:gap-y-6",
        /* default grid stretch made collapsed cards match expanded row height (empty-looking blocks) */
        "items-start"
      )}
    >
      {terms.map((term) => (
        <AccordionItem
          key={term.slug}
          value={term.slug}
          id={term.slug}
          className={cn(
            "scroll-mt-28 border-0",
            "flex flex-col rounded-xl border border-border/60 bg-card shadow-sm ring-1 ring-foreground/[0.04]"
          )}
        >
          <AccordionTrigger
            className={cn(
              "rounded-t-xl border-0 px-4 py-4 hover:bg-muted/30 hover:no-underline sm:px-5",
              "focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
          >
            <span className="font-heading text-base font-semibold tracking-tight text-foreground sm:text-lg">
              {term.title}
            </span>
          </AccordionTrigger>
          <AccordionContent className="border-t border-border/50 px-0 pb-0 pt-0 text-sm sm:px-0">
            <div className="px-4 pb-4 pt-3 sm:px-5">
              <ul className="flex flex-wrap gap-1.5 pb-3" aria-label="Pillars">
                {term.categories.map((label) => (
                  <li key={label}>
                    <Badge variant="outline" size="xs">
                      {label}
                    </Badge>
                  </li>
                ))}
              </ul>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {term.shortDefinition}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
