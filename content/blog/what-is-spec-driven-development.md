---
title: "What is spec-driven development? A plain-English guide with examples"
slug: "what-is-spec-driven-development"
date: "2026-05-09"
description: "Spec-driven development (SDD) treats clear intent, behavior, and acceptance as the driver for shipping—not ticket titles. Learn what it is, what it isn’t, and a before/after you can steal."
name: "What is spec-driven development?"
anons: "If your “spec” lives only in chat and Jira titles, you’re not doing SDD yet—here’s the practical version, with examples and a rhythm you can adopt tomorrow."
heading: "What is spec-driven development?"
socialImage: "/images/what-is-sdd-cover.png"
---

## The hook: when the room *sounds* aligned

You leave a planning call feeling good. Everyone nodded. Then implementation starts and the questions arrive anyway: *“Wait—does ‘fast’ mean cached or just fewer round trips?”* *“Are empty strings valid here?”* *“Who owns rollback?”*

That gap—between **shared optimism** and **shared meaning**—is where **spec-driven development (SDD)** focuses. SDD does not promise fewer words; it promises that the *right* words exist in a **single, checkable place** before (or tight beside) the code that implements them.

## What spec-driven development actually is

**Spec-driven development** means you treat **specifications**—intent, behavior, boundaries, and acceptance—as the **primary input** to building software. The spec is not wallpaper after the fact; it is the contract your implementation is written against.

In practice, a “spec” is usually:

- **Short enough** that a busy teammate can read it in one sitting.
- **Precise enough** that two engineers would implement the same behavior without a sidebar.
- **Testable enough** that you could demo “done” against explicit criteria.

It pairs naturally with **Intent-Driven Engineering**: you start from what the system should **do for people**, not from the first API that came to mind.

## “We have tickets” ≠ “we have specs”

Tickets track work. Specs describe **truth** about the slice you are building. You can have both; they solve different problems.

| | **Typical ticket** | **Spec slice** |
| --- | --- | --- |
| **Job** | Assign, sequence, unblock | Define behavior and “done” |
| **Best line** | “Upgrade auth flow” | “For MFA enroll, if TOTP secret is missing, block submit and show error E104.” |
| **Risk** | Title becomes the contract | Ambiguity hides in nouns (“secure”, “fast”, “simple”) |
| **Good test** | Moves across a board | Two engineers answer edge-case questions the same way |

A backlog full of crisp titles is still not a spec. A spec can live **in** a ticket—or in a doc, or in a repo Markdown file—but it must answer **what** and **how we know**, not only **when**.

## Tickets vs. clarity (at a glance)

One picture to keep in mind: chaos on the left, one agreed story on the right.

![Messy ad-hoc notes versus a single ordered spec: the shift SDD is after](/images/tickets-vs-specs-visual.png)

## A before-and-after you can steal

Imagine this lands in Slack:

> **PM (message):** “We need the export to be faster for big accounts.”

That is a **signal**, not a spec. A minimal SDD-style slice might look like this:

**Problem / intent**

- **User:** Account admin exporting usage for billing.
- **Pain:** Export >50k rows times out or blocks the tab for minutes.
- **Success:** For accounts ≤200k rows, CSV download starts within **3s** and completes without crashing the tab (worker or server path is fine).

**Scope**

- **In:** CSV export for the usage report only; accounts up to 200k rows.
- **Out:** PDF, scheduled emails, other reports (separate slices).

**Acceptance (examples)**

1. Given a 60k-row account, when the user clicks **Export CSV**, a download begins within 3 seconds and the file opens in Sheets without manual repair.
2. Given a 250k-row account, the UI shows a clear **“too large—contact support”** state (no silent failure).
3. Given an export in progress, refreshing the page does not start a second concurrent job for the same user.

That is still one page—but now “fast” has a number, “big” has a cap, and edge cases have owners.

## When SDD earns its keep

| Situation | Why specs matter |
| --- | --- |
| Multiple contributors | Shared truth beats tribal memory. |
| Integrations & contracts | Surfaces, errors, and idempotency need names. |
| Compliance or audits | You can point to acceptance that was agreed *before* ship. |
| Onboarding | A good spec is a flashlight into the codebase. |

## When *not* to over-invest

| Situation | Lighter approach |
| --- | --- |
| One-off script / spike | Capture decisions in comments + PR description; graduate to a spec if it sticks. |
| Purely cosmetic tweak | Before/after screenshot + one acceptance line may be enough. |
| Exploratory R&D | Time-box discovery; write the spec once you know which unknowns are real. |

SDD is **disciplined**, not **dogmatic**. The goal is to match depth to **risk**.

## A working rhythm (without the buzzwords)

You do not need a heavyweight process—you need a **repeatable sequence**:

1. **Frame** the problem and boundaries in plain language.
2. **Write acceptance** you could demo: happy path + the scary edges.
3. **Implement** with the spec open; when reality disagrees, **update the spec first**.
4. **Demo** against the acceptance lines—not against memory of the meeting.

For a fuller walkthrough of those steps, see [A simple SDD workflow for small teams](/blog/sdd-workflow-for-small-teams).

## What to read next

- [A simple SDD workflow for small teams](/blog/sdd-workflow-for-small-teams) — five-step rhythm from frame to demo.
- [Intent-driven engineering](/blog/intent-driven-engineering) — putting intent upstream of implementation detail.
- [Tickets vs specs](/blog/tickets-vs-specs) — when a ticket is enough, and when it isn’t.

## Closing thought

**Spec-driven development** is not about loving paperwork. It is about buying **cheaper feedback**: earlier, clearer, and closer to the people who will live with the result. Start with one slice—one export, one webhook, one screen—and write it so clearly that the next person says, *“Oh, that’s what we meant.”*
