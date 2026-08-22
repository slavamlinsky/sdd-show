"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/reveal";
import { IntentpoweredLoopDiagram } from "@/components/intentpowered-loop-diagram";
import { GradientText } from "@/components/gradient-text";
import {
  INTENTPOWERED_LOOP_ID,
  intentpoweredLoopCopy,
  intentpoweredLoopStages,
} from "@/lib/intentpowered-loop";
import { intentpoweredLoopIcons } from "@/components/intentpowered-loop-icons";
import { cn } from "@/lib/utils";

const STAGE_COUNT = intentpoweredLoopStages.length;

export function HomeIntentpoweredLoop() {
  const { headingLead, headingAccent, lead } = intentpoweredLoopCopy;
  const [tick, setTick] = useState(0);
  const [motion, setMotion] = useState(true);
  const active = tick % STAGE_COUNT;
  const stage = intentpoweredLoopStages[active];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMotion(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <section
      id={INTENTPOWERED_LOOP_ID}
      className="full-bleed relative scroll-mt-20 overflow-hidden border-b border-border/40"
      aria-labelledby="intentpowered-loop-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_-10%,rgba(139,92,246,0.1),transparent_55%),radial-gradient(ellipse_60%_45%_at_90%_10%,rgba(14,165,233,0.08),transparent_50%)]"
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6 sm:pt-8">
        <div className="flex w-full flex-col items-center gap-4 lg:flex-row lg:items-center lg:gap-8">
          <Reveal
            className="w-full min-w-0 lg:w-[45%] lg:shrink-0"
            distance={20}
          >
            <IntentpoweredLoopDiagram
              active={tick}
              motion={motion}
              onActiveChange={setTick}
            />
          </Reveal>
          <Reveal className="w-full min-w-0 space-y-6 lg:w-[55%]" distance={18}>
            <h2
              id="intentpowered-loop-heading"
              className="font-heading text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              <span className="block">{headingLead}</span>
              <GradientText>{headingAccent}</GradientText>
            </h2>
            <div className="space-y-4 text-pretty text-base leading-relaxed text-muted-foreground">
              {lead.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="pt-1">
              <div className="flex items-center justify-between gap-4 mb-2">
                <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(STAGE_COUNT).padStart(2, "0")}
                </p>
                <div className="flex items-center gap-1.5" aria-hidden>
                  {intentpoweredLoopStages.map((item, i) => (
                    <span
                      key={item.id}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        i === active
                          ? "w-6 bg-violet-500 dark:bg-sky-400"
                          : "w-1.5 bg-border",
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="relative min-h-28">
                {intentpoweredLoopStages.map((item, i) => {
                  const Icon = intentpoweredLoopIcons[item.id];
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "absolute inset-x-0 top-0 transition-opacity duration-700 ease-out",
                        i === active
                          ? "opacity-100"
                          : "pointer-events-none opacity-0",
                      )}
                      aria-hidden={i !== active}
                    >
                      <div className="flex items-start gap-3.5">
                        <span
                          className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-violet-500/25 dark:ring-sky-400/30"
                          aria-hidden
                        >
                          <Icon
                            className="size-4 text-violet-600 dark:text-sky-400"
                            strokeWidth={1.75}
                          />
                        </span>
                        <div className="min-w-0">
                          <p className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                            {item.title}
                          </p>
                          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                            {item.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="sr-only" aria-live="polite">
                {stage.title}: {stage.body}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
