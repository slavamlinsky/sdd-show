---
title: "What is spec-driven development? A plain-English guide with examples"
slug: "what-is-spec-driven-development"
date: "2026-05-09"
description: "A straight answer to what SDD is, with a ticket vs spec comparison and a copy-paste example. Short sentences, no jargon wall."
name: "What is spec-driven development?"
anons: "If your spec only lives in chat and ticket titles, you are not there yet. Here is the plain version, with examples and a loop you can repeat."
heading: "What is spec-driven development?"
socialImage: "/images/what-is-sdd-cover.png"
---

## What is spec-driven development?

Planning ends and everyone nods. Then work starts. The questions show up anyway. Does “fast” mean caching or fewer round trips? Are empty strings allowed? Who owns rollback?

That space between a good meeting and a shared picture of the work is where spec-driven development (SDD) helps. SDD is not about writing more for its own sake. It is about putting intent, behavior, and “done” in one place people can check. Preferably before the code ships, or right beside it if you iterate hard.

SDD means specifications drive the work: what it should do, where it stops, and how you know it worked. The spec is the thing you build against, not a PDF you file after the fact.

A useful spec is usually:

- Short enough to read in one go.
- Clear enough that two engineers would build the same behavior without a side chat.
- Concrete enough that you can demo “done” against a short list of checks.

You can line this up with intent-driven engineering: start from what people need, not from the first API you thought of.

## Tickets track work; specs state truth

Tickets and specs do different jobs. Use both.

Typical ticket:

- Job: assign work, clear blockers, keep sequence sane.
- Example title: “Upgrade auth flow.”
- Risk: the title quietly becomes the whole agreement.
- Good sign: it moves across the board without drama.

Spec slice for the same work:

- Job: say what happens and what finished looks like.
- Example: “For MFA enroll, if TOTP secret is missing, block submit and show error E104 and copy X.”
- Risk: fuzzy words like “secure,” “fast,” or “simple” hide arguments.
- Good sign: edge cases get the same answer from two people without a meeting.

A backlog of neat titles is still not a spec. The spec can live in the ticket, a doc, or Markdown in the repo. It still needs to answer what you are building and how you will know, not only when it is due.

![Abstract split: tickets versus one agreed spec narrative](/images/tickets-vs-specs-visual.png)

Messy notes on a wall are a mood. A short acceptance block is a promise. Same idea, different visual:

![Chaotic sticky-note brainstorm versus a calm, numbered acceptance list](/images/sdd-acceptance-contrast.png)

## A before-and-after you can steal

This lands in Slack:

> PM: “We need the export to be faster for big accounts.”

That is a ping, not a spec. A small SDD-style slice could look like this.

Intent:

- User: account admin exporting usage for billing.
- Pain: exports above about 50k rows time out or freeze the tab.
- Success: for accounts up to 200k rows, CSV download starts within 3 seconds and finishes without killing the tab. Server or worker is fine.

Scope:

- In: CSV export for the usage report only, accounts up to 200k rows.
- Out: PDF, scheduled email, other reports. Those get their own slices later.

Acceptance examples:

1. 60k rows: user clicks Export CSV, download starts within 3 seconds, file opens in Sheets without manual repair.
2. 250k rows: UI shows “too large, contact support” with no silent failure.
3. Export running: refresh does not start a second job for the same user.

You are still on about one page. Now “fast” has a number. “Big” has a cap. The scary edges have names.

## When fuller specs are worth the ink

- Same slice, many hands: one written story beats tribal memory.
- Integrations and public contracts: name surfaces, errors, and idempotency.
- Audit or compliance: you can show acceptance that existed before ship.
- Heavy onboarding: a tight spec helps new folks find the thread.

## When to keep the write-up thin

- One-off script or spike: PR and comments first. Promote to a spec if it ships.
- Small UI tweak: a screenshot plus one acceptance line is often plenty.
- Early R&D: time-box exploration. Write the spec once unknowns are real enough to name.

Match how much you write to how much risk you are taking. SDD is meant to be strict where it matters, not heavy everywhere.

## A rhythm you can repeat

You do not need a huge process. Run the same short loop:

1. Frame the problem and boundaries in plain language.
2. Write acceptance you could demo: happy path plus the edges that usually bite.
3. Build with the spec open. When reality disagrees, update the spec first.
4. Demo against those lines, not against memory of the last meeting.

More detail and pictures for that loop live in [A simple SDD workflow for small teams](/blog/sdd-workflow-for-small-teams).

![Circular rhythm: frame, acceptance, sketch, implement, demo](/images/sdd-rhythm-loop.png)
