import Link from "next/link";
import { Ban, BarChart3, Handshake, Target } from "lucide-react";
import { Reveal } from "@/components/reveal";

const pillars = [
  {
    title: "Outcome clarity",
    description: "Be specific with numbers and deadlines.",
    icon: Target,
    glossarySlug: "outcome-clarity",
  },
  {
    title: "Success metrics",
    description: "Define how you will measure a win.",
    icon: BarChart3,
    glossarySlug: "success-metrics",
  },
  {
    title: "Constraints",
    description: "State what is completely off-limits.",
    icon: Ban,
    glossarySlug: "constraints-and-guards",
  },
  {
    title: "Delegation",
    description: 'Fight the urge to dictate the "how".',
    icon: Handshake,
    glossarySlug: "delegation",
  },
] as const;

export function HomeIntentPillars() {
  return (
    <section
      className="border-b border-border/40 bg-gradient-to-b from-muted/20 via-background to-background py-16 sm:py-20"
      aria-labelledby="intent-pillars-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center" distance={16}>
          <h2
            id="intent-pillars-heading"
            className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            The four pillars of intent
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Turn vague goals into specs people can execute — starting with how you frame intent.
          </p>
        </Reveal>
        <ul className="mt-12 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:gap-8">
          {pillars.map((item, i) => {
            const Icon = item.icon;
            return (
              <li key={item.glossarySlug}>
                <Reveal delay={i * 0.06} distance={14}>
                  <div className="flex h-full flex-col rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm ring-1 ring-foreground/[0.03] backdrop-blur-sm sm:p-7">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <h3 className="mt-4 font-heading text-lg font-semibold tracking-tight text-foreground">
                      <Link
                        href={`/glossary#${item.glossarySlug}`}
                        className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
