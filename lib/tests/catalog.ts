import type { InnerTest, OuterTest } from "./types.ts";
import { welcomeBasic } from "./welcome-basic.ts";

export const innerTests: InnerTest[] = [
  welcomeBasic,
  {
    slug: "sdd-advanced",
    title: "Advanced SDD: specs in the workflow",
    level: "advanced",
    blurb:
      "Trade-offs, tickets vs specs, and what you would write before agents implement.",
    topic: "Spec-driven workflows for real slices",
    sampleRatio: 0.45,
    passPercent: 70,
    published: false,
    estimatedMinutes: "20–25 minutes",
    bank: [],
  },
  {
    slug: "intent-pro",
    title: "Pro: intent, agents, and quality",
    level: "pro",
    blurb:
      "Ambiguous stems, guardrails, and evals when AI is in the delivery loop.",
    topic: "Intent contracts and agent quality",
    sampleRatio: 0.4,
    passPercent: 75,
    published: false,
    estimatedMinutes: "25–30 minutes",
    bank: [],
  },
];

export const outerTests: OuterTest[] = [
  {
    name: "Anthropic courses",
    publisher: "Anthropic",
    kind: "course",
    blurb:
      "Official learning on Claude, prompting, and working with their models — AI literacy, not our SDD glossary.",
    href: "https://www.anthropic.com/learn",
  },
  {
    name: "Azure AI Fundamentals (AI-900)",
    publisher: "Microsoft",
    kind: "exam",
    blurb:
      "Vendor exam on cloud AI concepts. Useful baseline literacy; it does not measure spec-driven practice.",
    href: "https://learn.microsoft.com/credentials/certifications/azure-ai-fundamentals/",
  },
  {
    name: "Google AI Essentials",
    publisher: "Google",
    kind: "course",
    blurb:
      "A short course on using generative AI at work. Complementary to writing intent and specs.",
    href: "https://grow.google/ai-essentials/",
  },
  {
    name: "Hugging Face LLM course",
    publisher: "Hugging Face",
    kind: "course",
    blurb:
      "Hands-on NLP and LLM track with chapter quizzes. Technical depth, not Intent-Driven Engineering.",
    href: "https://huggingface.co/learn/llm-course",
  },
  {
    name: "OpenAI prompting guide",
    publisher: "OpenAI",
    kind: "guide",
    blurb:
      "Practical prompting for their API. Contrast with writing specs agents can execute.",
    href: "https://platform.openai.com/docs/guides/prompt-engineering",
  },
];

const bySlug = new Map(innerTests.map((t) => [t.slug, t]));

export function getInnerTest(slug: string): InnerTest | undefined {
  return bySlug.get(slug);
}

export function publishedInnerTests(): InnerTest[] {
  return innerTests.filter((t) => t.published);
}

export function comingSoonInnerTests(): InnerTest[] {
  return innerTests.filter((t) => !t.published);
}
