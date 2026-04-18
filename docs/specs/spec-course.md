# Feature spec — Course (`/course`)

## Intent

Sell the **idea** of an SDD course and collect **leads**; page is **substance + placeholder** until a real course exists.

Follow [spec-design-layout.md](./spec-design-layout.md): **responsive** sections, **airy** spacing, **clear blocks** (hero → syllabus → form), **CTA** hierarchy, optional **placeholder images** for hero or module icons until final art.

## Page structure (MVP)

1. **Hero / pitch**
   - What learners get (bullet list).
   - Optional **hero image** (placeholder OK) to match landing quality from the home page.
   - **Primary CTA:** scroll to lead form or in-page form section.

2. **Syllabus-style sections (dummy but plausible)**
   - **4–6** modules or weeks with title + one-line description each; present as **cards or stacked blocks** with breathing room.
   - Copy can say “coming soon” where honest.

3. **Lead form**
   - Fields: at minimum **email**; optional **name** (if included, keep optional or required consistently in one place).
   - **Submit:** MVP may `console.log`, show success toast, or POST to a Next.js Route Handler that returns 200 — real persistence via **Supabase** later (**spec-main**).

4. **Trust row (optional)**
   - Link back to `/blog` or `/videos` as “free resources”.

## Acceptance

- Page reads as a **landing-style** flow: distinct bands, not a single cramped column of text (see **spec-design-layout**).
- Form has client-side validation for email format.
- Successful submit shows clear **success state** (message or inline).
- No dead links in syllabus (anchors can be non-interactive headings).

## Non-goals

- Checkout, pricing table, gated content, user accounts.
