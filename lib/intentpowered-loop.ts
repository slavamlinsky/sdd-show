export const INTENTPOWERED_LOOP_ID = "intentpowered-loop";

export const intentpoweredLoopStages = [
  {
    id: "intent",
    title: "Intent",
    body: "What are we trying to achieve and why?",
  },
  {
    id: "build",
    title: "Build",
    body: "Turn intent into specs and working software.",
  },
  {
    id: "ship",
    title: "Ship",
    body: "Put the smallest useful version in users' hands.",
  },
  {
    id: "learn",
    title: "Learn",
    body: "Feedback, behavior, data, and experiments.",
  },
  {
    id: "refine",
    title: "Refine",
    body: "Improve the product, spec, or even the original intent.",
  },
] as const;

export type IntentpoweredLoopStage = (typeof intentpoweredLoopStages)[number];
export type IntentpoweredLoopStageId = IntentpoweredLoopStage["id"];

/** Time each stage stays active (diagram + copy slider). */
export const INTENTPOWERED_LOOP_STEP_MS = 5000;

export const intentpoweredLoopCopy = {
  headingLead: "Ship early. Learn fast.",
  headingAccent: "Focus on what matters.",
  lead: [
    "Intent-powered product development starts with a clear outcome. Turn it into a spec, build the smallest version that can actually solve the problem, and get it in front of real people. Then see how they actually use it.",
    "Talk to users, watch their behavior, look at the data, fix what doesn't work, and use what you learn to decide what to build next.",
  ],
} as const;

/** Circle geometry for the loop diagram (viewBox 0 0 600 600). */
export const INTENTPOWERED_RING = {
  viewBox: "0 0 600 600",
  cx: 300,
  cy: 300,
  r: 168,
} as const;

export function intentpoweredNodeAngle(index: number): number {
  return -90 + (360 / intentpoweredLoopStages.length) * index;
}
