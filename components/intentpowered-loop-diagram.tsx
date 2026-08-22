"use client";

import { useEffect, useId, useRef } from "react";
import {
  INTENTPOWERED_LOOP_STEP_MS,
  INTENTPOWERED_RING,
  intentpoweredLoopStages,
  intentpoweredNodeAngle,
} from "@/lib/intentpowered-loop";
import { intentpoweredLoopIcons } from "@/components/intentpowered-loop-icons";
import { cn } from "@/lib/utils";

const RING_SIZE = 600;

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function pct(n: number) {
  return `${(n / RING_SIZE) * 100}%`;
}

function wrap01(n: number) {
  return ((n % 1) + 1) % 1;
}

/**
 * Dash occupies [tail, tail + dashLen]. The leading edge (nose) is at tail + dashLen.
 * A node is active from the moment the nose hits it until the tail passes it.
 */
function activeIndexForTail(tail: number, count: number, dashLen: number) {
  let index = 0;
  for (let i = 0; i < count; i++) {
    const rel = wrap01(i / count - tail);
    if (rel > 1e-6 && rel <= dashLen + 1e-6) {
      index = i;
    }
  }
  return index;
}

type IntentpoweredLoopDiagramProps = {
  active: number;
  motion: boolean;
  onActiveChange: (index: number) => void;
};

/**
 * Circular 5-stage loop. A node scales up when the stripe's nose reaches it
 * and scales down when the tail passes through it.
 */
export function IntentpoweredLoopDiagram({
  active,
  motion,
  onActiveChange,
}: IntentpoweredLoopDiagramProps) {
  const uid = useId().replace(/:/g, "");
  const stroke = `ip-ring-${uid}`;
  const glow = `ip-glow-${uid}`;
  const highlightRef = useRef<SVGCircleElement>(null);
  const { cx, cy, r, viewBox } = INTENTPOWERED_RING;
  const count = intentpoweredLoopStages.length;
  const dashLen = 1 / count;

  useEffect(() => {
    if (!motion) {
      highlightRef.current?.setAttribute("stroke-dashoffset", "0");
      return;
    }
    const started = performance.now();
    let frame = 0;
    let last = -1;
    const tick = (now: number) => {
      const elapsed = now - started;
      const cycle = INTENTPOWERED_LOOP_STEP_MS * count;
      // t=0: nose sits on Intent. Tail trails one segment behind.
      const raw = wrap01(elapsed / cycle);
      const tail = wrap01(raw - dashLen);
      highlightRef.current?.setAttribute("stroke-dashoffset", String(-tail));
      const next = activeIndexForTail(tail, count, dashLen);
      if (next !== last) {
        last = next;
        onActiveChange(next);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [motion, count, dashLen, onActiveChange]);

  return (
    <figure className="relative mx-auto aspect-square w-full max-w-lg overflow-visible lg:max-w-none">
      <svg
        viewBox={viewBox}
        className="h-auto w-full overflow-visible text-foreground"
        role="img"
        aria-hidden
      >
        <defs>
          <linearGradient id={stroke} x1="8%" y1="0%" x2="92%" y2="100%">
            <stop offset="0%" stopColor="rgb(139 92 246)" />
            <stop offset="55%" stopColor="rgb(99 102 241)" />
            <stop offset="100%" stopColor="rgb(14 165 233)" />
          </linearGradient>
          <filter id={glow} x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={cx}
          cy={cy}
          r={r + 26}
          fill="none"
          className="stroke-violet-500/10 dark:stroke-sky-400/12"
          strokeWidth="1"
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={`url(#${stroke})`}
          strokeWidth="8"
          strokeOpacity="0.08"
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={`url(#${stroke})`}
          strokeWidth="1.5"
        />
        <circle
          ref={highlightRef}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={`url(#${stroke})`}
          strokeWidth="2.4"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={motion ? `${dashLen} ${1 - dashLen}` : "1 0"}
          strokeDashoffset={0}
          filter={`url(#${glow})`}
          opacity={motion ? 1 : 0.4}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>

      {intentpoweredLoopStages.map((stage, i) => {
        const deg = intentpoweredNodeAngle(i);
        const node = polar(cx, cy, r, deg);
        const label = polar(cx, cy, r + 72, deg);
        const Icon = intentpoweredLoopIcons[stage.id];
        const on = i === active % count;

        return (
          <div key={stage.id}>
            <div
              className={cn(
                "absolute flex size-12 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm",
                "ring-1 ring-violet-500/20 dark:ring-sky-400/25",
                "transition-[box-shadow,background-color] duration-200 ease-out",
                on &&
                  "bg-linear-to-br from-violet-500/15 via-background to-sky-500/20 shadow-[0_0_22px_rgba(139,92,246,0.35)] ring-violet-500/45 dark:shadow-[0_0_22px_rgba(56,189,248,0.28)]",
              )}
              style={{
                left: pct(node.x),
                top: pct(node.y),
                transform: `translate(-50%, -50%) scale(${on ? 1.07 : 1})`,
                transition: "transform 200ms ease, box-shadow 200ms ease",
              }}
            >
              <Icon
                className={cn(
                  "size-5 text-violet-600 dark:text-sky-400",
                  on && "text-violet-500 dark:text-sky-300",
                )}
                strokeWidth={1.75}
                aria-hidden
              />
            </div>
            <p
              className={cn(
                "absolute whitespace-nowrap font-heading text-[11px] font-semibold tracking-[0.14em] uppercase",
                "transition-colors duration-200",
                on ? "text-foreground" : "text-muted-foreground",
              )}
              style={{
                left: pct(label.x),
                top: pct(label.y),
                transform: "translate(-50%, -50%)",
              }}
            >
              {stage.title}
            </p>
          </div>
        );
      })}
    </figure>
  );
}
