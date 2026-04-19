"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import { ChevronDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { GlossaryTerm } from "@/lib/glossary-data";
import { cn } from "@/lib/utils";

export function GlossaryAccordion({ terms }: { terms: GlossaryTerm[] }) {
  return (
    <ul className="mt-16 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 md:gap-x-8 md:gap-y-6">
      {terms.map((term) => (
        <li key={term.slug} id={term.slug} className="scroll-mt-28">
          <Collapsible.Root className="flex h-full flex-col rounded-xl border border-border/60 bg-card shadow-sm ring-1 ring-foreground/[0.04]">
            <Collapsible.Trigger
              className={cn(
                "group/collapsible-trigger flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-4 text-left outline-none sm:px-5",
                "rounded-t-xl hover:bg-muted/30",
                "focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              <span className="font-heading text-base font-semibold tracking-tight text-foreground sm:text-lg">
                {term.title}
              </span>
              <ChevronDownIcon
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-aria-expanded/collapsible-trigger:rotate-180"
              />
            </Collapsible.Trigger>
            <Collapsible.Panel className="h-[var(--collapsible-panel-height)] overflow-hidden text-sm transition-[height] duration-200 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
              <div className="border-t border-border/50 px-4 pb-4 pt-3 sm:px-5">
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
              </div>
            </Collapsible.Panel>
          </Collapsible.Root>
        </li>
      ))}
    </ul>
  );
}
