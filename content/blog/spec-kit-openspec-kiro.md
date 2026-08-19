---
title: "Spec-driven development tools and frameworks: Spec Kit vs OpenSpec vs Kiro"
slug: "spec-kit-openspec-kiro"
date: "2026-08-20"
description: "Spec-driven development tools and frameworks overview: why SDD frameworks exist, how GitHub Spec Kit, OpenSpec, and Kiro differ, and which spec-driven development framework developers should use."
name: "SDD tools and frameworks compared"
anons: "A spec-driven development tools and frameworks comparison: why kits exist, a short overview of Spec Kit, OpenSpec, and Kiro, and when to pick each."
heading: "Spec-driven development tools and frameworks"
socialImage: "/images/spec-sdd-frameworks-cover.png"
category: Build
keywords:
  - spec-driven development tools
  - spec driven development frameworks
  - SDD frameworks
  - spec-driven development tools and frameworks
  - Spec Kit vs OpenSpec vs Kiro
  - GitHub Spec Kit
  - OpenSpec
  - Kiro
  - spec driven development comparison
---

Chat with an agent is cheap. A **shared contract** is not. **Spec-driven development (SDD)** puts intent, behavior, and done in one place. **Spec-driven development tools and frameworks** turn that contract into files, phases, and commands an agent can follow — not another paragraph in chat.

This **spec-driven development tools and frameworks overview** covers three names you will hear constantly: **GitHub Spec Kit**, **OpenSpec**, and **Kiro**. For a wider catalog, see the [ecosystem tools list](/ecosystem#tools). For the practice itself, start with [what spec-driven development is](/blog/what-is-spec-driven-development).

![Cover: a written spec as the hub, with three paths for SDD tools and frameworks](/images/spec-sdd-frameworks-cover.png)

## Why spec-driven development frameworks exist

A good spec answers what must be true, where the work stops, and how you will know. A good **SDD framework** answers the next questions:

- Where does that spec live in the repo?
- What is the next step after “we wrote it”?
- How does an agent pick up a slice without inventing a process?
- How do you see what changed versus what is already true of the system?

Without that, every session reinvented a ritual. People pasted the same prompt. Teams argued in Slack about whether the plan was in Notion, the PR, or someone’s head. Frameworks are **scaffolding for spec-driven development** — they do not replace judgment, and they are not a substitute for writing a clear slice.

![Ambiguous chat versus one spec-driven development contract agents can execute](/images/spec-sdd-frameworks-why.png)

### When you need SDD tools (and when you do not)

You need **spec-driven development tools** when:

- More than one agent or teammate will touch the same feature.
- The change will still matter in a year (auth, money, a public API).
- The codebase is already large and a “full rewrite of the spec” would rot immediately.
- You are tired of reviewing code that never matched the conversation you thought you had.

You do **not** need a framework to try SDD. A markdown file next to the PR still beats vibe coding. Reach for a kit when the **process** is what keeps breaking.

## Spec-driven development tools overview

Three **SDD frameworks** sit at different points on the same map: a portable CLI for multi-agent teams, a lightweight delta kit for existing code, and an IDE with the loop built in.

### GitHub Spec Kit SDD framework

**Spec Kit** is GitHub’s open-source toolkit for spec-driven work. It is **agent-agnostic**: the same repo conventions can drive Copilot, Claude Code, Cursor, and others.

The loop matches SDD: **specify** (what and why, not the stack), **plan** (how: libraries, boundaries), **tasks** (atomic units), **implement** (the agent executes against the list). Many setups also keep a project **constitution** — quality bars that apply across features, not only inside one ticket.

**Use this spec-driven development framework when** you want a portable ceremony; several people or several agents share one repo; greenfield work has interacting features; or you care about a repeatable trail of spec → plan → tasks.

**Skip it when** the change is a one-line fix, or the overhead of a full specify/plan/task tree is heavier than the risk. Spec Kit earns its keep on **0→1** slices and shared standards, not on every chore.

### OpenSpec SDD framework for brownfield work

**OpenSpec** (Fission-AI) is the lightweight, **brownfield-first** cousin among spec-driven development tools. Instead of regenerating a complete architecture doc for every change, you write a **delta**: what is different from today’s system. A typical flow is **propose → apply → archive** — proposed change, then living docs that absorb what shipped.

That matches how real products evolve. Most work is not a blank repo. It is “this checkout already exists; we need refunds on failed captures.” Delta specs stay small. Archived changes become the growing source of truth instead of a graveyard of stale full specs.

**Use it when** you live in an existing codebase; you want agents (often via slash commands or `AGENTS.md`) without a heavy kit; or the pain is **cross-cutting changes** that would fight a per-feature novel.

**Skip it when** you are truly greenfield and you _want_ a heavy specify/plan tree before any code. OpenSpec can still work there — it just is not the product’s home turf.

### Kiro spec-driven development IDE

**Kiro** is not a CLI you drop into whatever editor you already love. It is an **agentic IDE** (VS Code–shaped) with spec-driven habits **built in**: requirements, tasks, and implementation live next to the code. AWS backs the product; the pitch is less “assemble a toolchain” and more “open the app and the SDD loop is already there.”

Hooks and in-editor spec UI reduce context switching. The tradeoff is **coupling**: you adopt Kiro’s environment, not only a folder of markdown.

**Use it when** the team wants SDD as a **product experience**, not a CLI; you are already comfortable in that IDE; or AWS-shaped greenfield work is the default.

**Skip it when** people must stay in Cursor, Neovim, or a mix of agents, and you cannot standardize on one IDE. Then Spec Kit or OpenSpec on top of the editors you already have is the honest path.

## Spec Kit vs OpenSpec vs Kiro

A compact **spec-driven development tools comparison**:

![Three lanes of SDD frameworks: portable CLI kit, delta specs on an existing system, and an IDE with specs beside code](/images/spec-sdd-frameworks-compare.png)

|                              | Spec Kit                                   | OpenSpec                                                  | Kiro                                             |
| ---------------------------- | ------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------ |
| **Shape**                    | CLI + templates in the repo                | CLI + delta specs in the repo                             | Full IDE with SDD inside                         |
| **Home turf**                | Greenfield, multi-agent teams              | Brownfield, incremental change                            | Integrated editor workflow                       |
| **Weight**                   | Fuller specify → plan → tasks loop         | Thinner propose → apply → archive                         | Productized, less DIY                            |
| **Lock-in**                  | Low (markdown + your agents)               | Low (markdown + your agents)                              | Higher (the IDE itself)                          |
| **Best question it answers** | How do we run SDD the same way everywhere? | How do we spec _this_ change without rewriting the world? | How do we practice SDD without assembling a kit? |

They are not mutually exclusive across a company. A platform team can keep Spec Kit for new services and OpenSpec on the ten-year monolith. Kiro can be how some people _author_ specs that still land as files others read in Git.

## Which SDD framework should developers use?

**Start with the work, not the brand.**

1. **Prototype, spike, throwaway** — Skip the framework. Write five lines of intent in the PR if you write anything. Vibe is allowed when the artifact will die.
2. **Existing product, weekly changes** — Default to **OpenSpec**. Delta specs match how the system already exists.
3. **New surface with several moving parts, mixed agents** — Default to **Spec Kit**. You want one constitution and a loop every agent can enter.
4. **Team will live in one AI IDE and wants the loop on rails** — Try **Kiro**. If half the team refuses to leave their current editor, do not force it; put Spec Kit or OpenSpec in the repo instead.
5. **Money, identity, or a public contract** — Use a spec-driven development framework _and_ a human review of the spec before implement. The kit does not replace the [risk check](/course#syllabus) we use on the course: if it will still matter in a year, measure twice.

If you remember one line: **pick the lightest SDD tool that keeps the spec as the source of truth.** Frameworks are how you stop re-litigating the process. They are not how you avoid writing the spec.

Monday morning: open the next real change. If the repo is old, try an OpenSpec-style delta. If you are starting a service and three agents will touch it, scaffold Spec Kit. If you already opened Kiro this week and the spec pane matches how you think, stay there — and still paste a link to the spec in the PR.
