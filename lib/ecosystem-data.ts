import type { LucideIcon } from "lucide-react";
import { BookText, Puzzle, Wrench } from "lucide-react";

export type EcosystemCategoryId = "tools" | "approaches" | "standards";

export type EcosystemItem = {
  name: string;
  blurb: string;
  glossarySlug?: string;
  href?: string;
};

export type EcosystemCategory = {
  id: EcosystemCategoryId;
  title: string;
  question: string;
  lead: string;
  icon: LucideIcon;
  items: EcosystemItem[];
};

export const ecosystemMeta = {
  titleLead: "Explore the",
  titleAccent: "ecosystem",
  lead: "Understand the tools, approaches, and standards shaping intent-driven engineering.",
  aside:
    "This page is the map: what you can use, how you should work, and how it fits together.",
} as const;

export const ecosystemCategories: EcosystemCategory[] = [
  {
    id: "tools",
    title: "Tools",
    question: "What can I use?",
    lead: "Products and kits that help you write, store, and execute specs with agents.",
    icon: Wrench,
    items: [
      {
        name: "GitHub Spec Kit",
        blurb: "GitHub’s spec-first kit for AI coding workflows.",
        href: "https://github.com/github/spec-kit",
      },
      {
        name: "OpenSpec",
        blurb: "Open spec format and change workflow for agent-driven work.",
        href: "https://github.com/Fission-AI/OpenSpec",
      },
      {
        name: "Kiro",
        blurb: "Spec-oriented AI IDE — structured artifacts, not only chat.",
        href: "https://kiro.dev",
      },
      {
        name: "Cursor",
        blurb:
          "AI editor (agent and composer) used heavily with specs and context files.",
        href: "https://cursor.com",
      },
      {
        name: "Claude Code",
        blurb:
          "Terminal coding agent; pairs well with repo conventions like AGENTS.md.",
        href: "https://docs.anthropic.com/en/docs/claude-code",
      },
      {
        name: "Codex",
        blurb:
          "OpenAI coding agent — another runtime for the same spec-first habits.",
        href: "https://openai.com/codex",
      },
    ],
  },
  {
    id: "approaches",
    title: "Approaches",
    question: "How should I work?",
    lead: "Methodologies and practices — including patterns that are not full schools of thought.",
    icon: Puzzle,
    items: [
      {
        name: "Spec-Driven Development",
        blurb:
          "The specification — not the generated diff — is the source of truth.",
        glossarySlug: "spec-driven-development",
      },
      {
        name: "Intent-Driven Engineering",
        blurb:
          "Outcomes and success criteria (the what); agents reason about the how.",
      },
      {
        name: "Test-Driven Development",
        blurb: "Tests pin behavior before or beside implementation.",
        glossarySlug: "test-driven-development",
      },
      {
        name: "Behavior-Driven Development",
        blurb:
          "Shared examples of behavior; a close cousin of specs and acceptance.",
      },
      {
        name: "Vibe coding",
        blurb:
          "Informal prompting by feel — fast on toys, costly on complex systems.",
        glossarySlug: "prompt-engineering",
      },
      {
        name: "Agentic engineering",
        blurb:
          "Delivery through agents: orchestration, review, and guardrails.",
      },
      {
        name: "Context engineering",
        blurb: "Packing the right artifacts so models stay aligned.",
        glossarySlug: "context-window",
      },
    ],
  },
  {
    id: "standards",
    title: "Standards",
    question: "How does it fit together?",
    lead: "Conventions and protocols that let tools and agents share context.",
    icon: BookText,
    items: [
      {
        name: "AGENTS.md",
        blurb:
          "In-repo conventions so coding agents know how this project wants to be worked.",
        href: "https://agents.md",
      },
      {
        name: "MCP",
        blurb:
          "Model Context Protocol — a shared way for tools and agents to connect to context.",
        href: "https://modelcontextprotocol.io",
      },
    ],
  },
];
