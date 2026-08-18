import type { LucideIcon } from "lucide-react";
import {
  Clapperboard,
  Compass,
  ListChecks,
  Rocket,
  Scale,
  ShieldAlert,
  Sparkles,
  Target,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

export const courseMeta = {
  titleLead: "It's time to become an",
  titleAccent: "Intent-Driven Engineer",
  tagline: "Stop prompting. Start directing.",
  pitch:
    "Turn your intent into specs AI agents can execute. Build faster, coordinate more complex systems, and keep the output reliable. Whether you are a one-person engineering team or leading one.",
} as const;

export const courseAudienceChips: {
  label: string;
  icon: LucideIcon;
}[] = [
  { label: "Solo founders", icon: Rocket },
  { label: "Full-stack leads", icon: Zap },
  { label: "Technical leads", icon: Users },
  { label: "Product managers", icon: Target },
];

export const courseAudienceCards: {
  title: string;
  body: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Solo founders",
    body: "You are product, design, and delivery. Specs are how one human stays fast with agents — without drowning in prompt babysitting.",
    icon: Rocket,
  },
  {
    title: "Full-stack & lead developers",
    body: "The one-person army: you still own the critical path. A tight spec is your force multiplier — more surface area, same engineering bar.",
    icon: Zap,
  },
  {
    title: "Technical leads",
    body: "Give the team a shared source of truth so AI work stays reviewable, scoped, and safe to merge.",
    icon: Users,
  },
  {
    title: "Product managers",
    body: "Become more precise about behavior. Intent contracts make “done” something agents and humans can both check.",
    icon: Target,
  },
];

export const courseLifecycle: {
  step: string;
  title: string;
  body: string;
}[] = [
  {
    step: "01",
    title: "Specify",
    body: "Behavioral boundaries in plain language.",
  },
  {
    step: "02",
    title: "Plan",
    body: "Turn the spec into a technical roadmap.",
  },
  { step: "03", title: "Task", body: "Slice the plan into atomic units." },
  {
    step: "04",
    title: "Implement",
    body: "Generate code against that task list.",
  },
];

export const coursePromises: {
  title: string;
  body: string;
  icon: LucideIcon;
}[] = [
  {
    title: "From how to what",
    body: "Shift from typing implementation to high-level orchestration. Agents execute; you keep the contract honest.",
    icon: Clapperboard,
  },
  {
    title: "Structure over vibe",
    body: "Informal prompting is fast until complexity hits. Specs are how professionals stay productive in real systems.",
    icon: Workflow,
  },
  {
    title: "Clarity as the scarce resource",
    body: "Code is cheap. Ambiguity is expensive. One missing sentence in a requirement can still sink a feature.",
    icon: Sparkles,
  },
];

export const courseModules: {
  n: string;
  title: string;
  lede: string;
  points: string[];
  icon: LucideIcon;
}[] = [
  {
    n: "01",
    title: "The great evolution",
    lede: "A seven-year look at how we got here — and why “code is king” no longer holds.",
    points: [
      "Five eras: requirement-driven, TDD, Scrum slices, vibe coding, then spec and intent.",
      "Writing code is no longer the bottleneck. Ambiguity is.",
    ],
    icon: Compass,
  },
  {
    n: "02",
    title: "The complexity trough",
    lede: "Why beginners feel an 80% speed boost while experienced teams stall on hard systems.",
    points: [
      "The U-shaped productivity curve with AI agents.",
      "Intuition-based prompting vs structure-based engineering — and the cost of a fuzzy spec.",
    ],
    icon: ShieldAlert,
  },
  {
    n: "03",
    title: "Deep dive: Spec-Driven Development",
    lede: "The specification — not the code — is the primary artifact.",
    points: [
      "Specify → plan → task → implement, as a repeatable loop.",
      "Case study: a login or payment flow designed so agents cannot invent the edge cases.",
    ],
    icon: ListChecks,
  },
  {
    n: "04",
    title: "The next frontier: Intent-Driven Engineering",
    lede: "Define outcomes and success criteria instead of step-by-step instructions.",
    points: [
      "Keep agents aligned across long sessions and multiple tools.",
      "Intent contracts: you control the what; they reason about the how.",
    ],
    icon: Target,
  },
  {
    n: "05",
    title: "Strategic implementation",
    lede: "A decision framework for when to move fast and when to measure twice.",
    points: [
      "Risk and longevity checks: money, security, or a year of maintenance → SDD.",
      "When vibe coding is fine for prototypes — and when real systems need a spec.",
    ],
    icon: Scale,
  },
  {
    n: "06",
    title: "The future team",
    lede: "New roles and culture for people who manage high-resolution intent.",
    points: [
      "The Strategic Architect (engineering) and the Intent Architect (product) — including when that is the same person.",
      "SDD as leverage for a one-person army, and as alignment once the team grows.",
    ],
    icon: Users,
  },
];

export const courseOutro = {
  title: "Monday morning challenge",
  summary:
    "In a world of infinite code, clarity is the only scarce resource. The point is software that is cleaner, safer, and less surprising.",
  challenge: "Write one spec before your next code prompt.",
} as const;
