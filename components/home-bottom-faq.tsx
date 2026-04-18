"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GradientText } from "@/components/gradient-text";

/** Distinct from mid-page Q&A — practical “where do I go next?” style questions. */
const items = [
  {
    id: "start",
    q: "Where should I start on this site?",
    a: "Skim the glossary for terms, read a short blog post, then peek at curated videos. When you want structure, head to the course page and join the notify list.",
  },
  {
    id: "course-cost",
    q: "Will the course be free?",
    a: "Pricing is not finalized — joining the email list only means we will tell you when enrollment opens and what the options are. No obligation.",
  },
  {
    id: "updates",
    q: "How do I get notified about the course?",
    a: "Use the email form on the course page. We will only message you about launch and major resource drops.",
  },
  {
    id: "tdd",
    q: "How does SDD relate to TDD?",
    a: "TDD is about tests driving implementation. SDD is about written intent (specs) driving what you build and how you verify it. They complement each other — specs scope the problem; tests encode acceptance.",
  },
  {
    id: "oss",
    q: "Is this project open source?",
    a: "Yes — you can browse and suggest improvements in the public repo:",
  },
] as const;

export function HomeBottomFaq() {
  return (
    <section
      id="bottom-faq"
      aria-labelledby="bottom-faq-heading"
      className="border-t border-border/60 bg-gradient-to-b from-muted/25 via-background to-muted/20"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="bottom-faq-heading"
            className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Still <GradientText className="font-semibold">curious?</GradientText>
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            A few more answers before you dive in — this block sits at the foot of the home page.
          </p>
        </div>
        <Accordion className="mx-auto mt-12 w-full max-w-3xl" defaultValue={[items[0].id]}>
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>
                {item.id === "oss" ? (
                  <>
                    {item.a}{" "}
                    <Link
                      href="https://github.com/slavamlinsky/sdd-show"
                      className="font-medium text-primary underline-offset-4 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      sdd-show on GitHub
                    </Link>
                    .
                  </>
                ) : (
                  item.a
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
