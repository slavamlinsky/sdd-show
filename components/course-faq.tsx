"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GradientText } from "@/components/gradient-text";

const items = [
  {
    id: "start",
    q: "Where should I start on this site?",
    a: "Skim the glossary, read one short blog post, then browse videos. When you want a structured path, use this course page and join the notify list.",
  },
  {
    id: "free",
    q: "Will the course be free?",
    a: "Pricing is still open. Joining the list only means we email you when enrollment options exist. No obligation.",
  },
  {
    id: "notify",
    q: "How do I hear about the course launch?",
    a: "Use the form below. We only send emails about launch and big resource drops.",
  },
  {
    id: "tdd",
    q: "How does SDD relate to TDD?",
    a: "TDD is tests driving code. SDD is written intent (specs) driving what you build and how you check it. They work together: specs set the scope; tests lock acceptance.",
  },
  {
    id: "oss",
    q: "Is this project open source?",
    a: "Yes. You can browse and suggest changes on ",
  },
] as const;

export function CourseFaq() {
  return (
    <section
      id="course-faq"
      aria-labelledby="course-faq-heading"
      className="border-y border-border/50 bg-muted/15"
    >
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <h2
            id="course-faq-heading"
            className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Common <GradientText className="font-semibold">questions</GradientText>
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            A few answers before you join the list. More depth lives in the glossary and blog.
          </p>
        </div>
        <Accordion className="mt-10 w-full" defaultValue={[items[0].id]}>
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>
                {item.id === "oss" ? (
                  <>
                    {item.a}
                    <Link
                      href="https://github.com/slavamlinsky/sdd-show"
                      className="font-medium text-primary underline-offset-4 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
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
