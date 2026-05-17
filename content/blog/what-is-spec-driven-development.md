---
title: "Spec-Driven Development (SDD): Learn the Basics."
slug: "what-is-spec-driven-development"
date: "2026-04-09"
description: "Learn what spec-driven development (SDD) means: specifications as the driver for software delivery, how specs differ from Jira tickets."
name: "What is spec-driven development?"
anons: "SDD means intent, behavior, and done live in one checkable place, not only in ticket titles. Here is the short definition, a ticket vs spec compare, and an example you can reuse."
heading: "What is spec-driven development (SDD)?"
socialImage: "/images/what-is-sdd-cover.png"
keywords:
  - what is spec driven development
  - SDD definition
  - software specifications
  - specs vs user stories
  - acceptance criteria examples
  - living specification
  - engineering alignment
---

## When the meeting ends, the hard questions start

Planning ends and people nod. Then work starts. The questions still land. Does fast mean caching or fewer trips to the server? Are empty strings valid? Who owns rollback?

That gap between a friendly room and a shared picture of the work is where spec-driven development helps. It is not a contest for the longest doc. It is a habit of putting intent, behavior, and done in one place your team can read and test against. Ideally before ship, or right beside the code if you iterate fast.

## What spec-driven development means in practice

SDD means specifications drive the work: what it should do, where it stops, and how you will know it worked. The spec is what you build against. It is not a file you only write after the fact to match whatever shipped.

A strong spec for one slice is usually:

- Short enough to read in one sitting.
- Clear enough that two engineers would ship the same behavior without a side meeting.
- Concrete enough that you can demo done against a short list of checks.

Many teams pair this with intent-driven thinking: start from what people need from the system, not from the first API that came to mind.

![Concept: the written spec as the hub feeding build, check, and ship](/images/what-is-sdd-spec-hub.png)

## How tickets and specs differ (and why you want both)

Tickets and specs answer different questions. Use both.

Typical ticket:

- Job: assign work, clear blockers, keep order sane.
- Example title: Upgrade auth flow.
- Risk: the title slowly becomes the whole agreement.
- Good sign: it moves across the board without drama.

Spec slice for the same work:

- Job: say what happens and what finished looks like.
- Example line: For MFA enroll, if TOTP secret is missing, block submit, show error E104 and copy X.
- Risk: soft words like secure, fast, or simple hide real disagreements.
- Good sign: two people answer edge case questions the same way without booking a room.

A backlog of neat titles is still not a spec. The spec can sit in the ticket, a wiki page, or Markdown in the repo. It still has to answer what you are building and how you will know, not only the due date.

![Abstract split: ticket noise versus one clear spec narrative](/images/tickets-vs-specs-visual.png)

## Example: from a vague ping to a tight slice

This shows up in chat:

> PM: We need the export to be faster for big accounts.

That is a ping, not a spec. A minimal SDD-style slice could look like this.

Intent:

- User: account admin exporting usage for billing.
- Pain: exports above about 50k rows time out or freeze the tab.
- Success: for accounts up to 200k rows, CSV download starts within 3 seconds and finishes without killing the tab. Server or worker is fine.

Scope:

- In: CSV export for the usage report only, accounts up to 200k rows.
- Out: PDF, scheduled email, other reports. Those earn their own slices later.

Acceptance examples:

1. 60k rows: user chooses Export CSV, download starts within 3 seconds, file opens in Sheets without repair.
2. 250k rows: UI shows too large, contact support, with no silent failure.
3. Export running: refresh does not start a second job for the same user.

You are still near one page. Fast has a number. Big has a cap. The scary edges have names.

## When a fuller spec is worth the time

- Same slice, many hands: one written story beats memory across Slack.
- Integrations and public contracts: name surfaces, errors, and idempotency.
- Audit or compliance: you can point to checks that existed before release.
- Heavy onboarding: a tight spec helps new people find the thread.

## When to keep the write-up thin

- One-off script or spike: lean on the PR and comments first. Promote to a real spec only if it ships.
- Small UI tweak: a screenshot plus one acceptance line is often plenty.
- Early research: time-box discovery. Write the spec once the unknowns are real enough to name.

![Calibrate how much you spec: fuller docs when risk and coordination are high; stay thin when the bet is small](/images/what-is-sdd-spec-depth-scale.png)

Match how much you write to how much risk you carry. SDD should feel strict where it matters, not heavy on every task.

## A small loop you can repeat

You do not need a large ceremony. Run the same short cycle:

1. Frame the problem and boundaries in plain words.
2. Write checks you could demo: happy path plus the edges that usually bite.
3. Build with the spec open. When reality disagrees, update the spec first.
4. Demo against those checks, not against memory of the last meeting.
