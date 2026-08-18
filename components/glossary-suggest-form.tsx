"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, LogIn, Sparkles } from "lucide-react";
import { suggestGlossaryTerm } from "@/app/(shell-flush)/glossary/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  fieldErrorsFromSuggestTerm,
  suggestTermSchema,
} from "@/lib/glossary-suggest";
import { type Pillar } from "@/lib/taxonomy";
import { PILLAR_FILTER_ORDER, PILLAR_UI } from "@/lib/pillar-ui";
import { cn } from "@/lib/utils";

type Props = {
  signedIn: boolean;
};

type FieldErrors = Partial<
  Record<"title" | "shortDefinition" | "categories", string>
>;

const fieldSurface = "rounded-md bg-white dark:bg-card";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}

export function GlossarySuggestForm({ signedIn }: Props) {
  const [title, setTitle] = useState("");
  const [shortDefinition, setShortDefinition] = useState("");
  const [categories, setCategories] = useState<Pillar[]>([]);
  const [website, setWebsite] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [done, setDone] = useState(false);

  function togglePillar(pillar: Pillar) {
    setFieldErrors((current) => ({ ...current, categories: undefined }));
    setCategories((current) => {
      if (current.includes(pillar)) return current.filter((p) => p !== pillar);
      if (current.length >= 3) return current;
      return [...current, pillar];
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = suggestTermSchema.safeParse({
      title,
      shortDefinition,
      categories,
    });
    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromSuggestTerm(parsed.error));
      return;
    }
    setFieldErrors({});

    setPending(true);
    try {
      const result = await suggestGlossaryTerm({
        title: parsed.data.title,
        shortDefinition: parsed.data.shortDefinition,
        categories: parsed.data.categories,
        website,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDone(true);
    } catch {
      setError("Could not send your suggestion. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (!signedIn) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-border/60 bg-background/80 px-6 py-10 text-center shadow-sm">
        <p className="text-xl font-medium text-foreground">
          Please sign in to add a term
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We appreciate your help building this platform. Sign in to send a term
          for review before it appears in the glossary.
        </p>
        <Button
          nativeButton={false}
          size="lg"
          className="mt-6 h-11 cursor-pointer gap-2 px-8 sm:px-10"
          render={<Link href="/sign-in?next=/glossary" />}
        >
          <LogIn className="size-4 shrink-0" aria-hidden />
          Sign in
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <div
        className="mx-auto max-w-xl rounded-xl border border-border/60 bg-background/70 px-6 py-10 text-center shadow-sm"
        role="status"
      >
        <CheckCircle2 className="mx-auto size-12 text-primary" aria-hidden />
        <p className="mt-3 font-heading text-lg font-semibold text-foreground">
          Thanks! We received your term.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          It sits in a moderation queue until we review it. Approved terms
          appear in the glossary with pillar badges; nothing is published
          automatically.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative mx-auto w-full max-w-xl space-y-5 text-left"
      aria-busy={pending}
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="term-title">Term name</Label>
        <Input
          id="term-title"
          name="title"
          required
          maxLength={80}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setFieldErrors((current) => ({ ...current, title: undefined }));
          }}
          placeholder="Traceability"
          className={cn("h-10", fieldSurface)}
          aria-invalid={Boolean(fieldErrors.title)}
          aria-describedby={fieldErrors.title ? "term-title-error" : undefined}
        />
        <FieldError id="term-title-error" message={fieldErrors.title} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="term-definition">Short definition</Label>
          <span className="text-xs tabular-nums text-muted-foreground">
            {shortDefinition.length}/500
          </span>
        </div>
        <Textarea
          id="term-definition"
          name="shortDefinition"
          required
          maxLength={500}
          rows={4}
          value={shortDefinition}
          onChange={(e) => {
            setShortDefinition(e.target.value);
            setFieldErrors((current) => ({
              ...current,
              shortDefinition: undefined,
            }));
          }}
          placeholder="1–3 sentences. Plain language — what it is, why it matters for SDD."
          className={fieldSurface}
          aria-invalid={Boolean(fieldErrors.shortDefinition)}
          aria-describedby={
            fieldErrors.shortDefinition ? "term-definition-error" : undefined
          }
        />
        <FieldError
          id="term-definition-error"
          message={fieldErrors.shortDefinition}
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Pillars (1–3)</legend>
        <p className="text-xs text-muted-foreground">
          Where this term shows up across the product lifecycle.
        </p>
        <div
          className="flex w-full gap-2 pt-1"
          role="group"
          aria-label="Pillars"
          aria-describedby={
            fieldErrors.categories ? "term-pillars-error" : undefined
          }
        >
          {PILLAR_FILTER_ORDER.map((pillar) => {
            const on = categories.includes(pillar);
            const blocked = !on && categories.length >= 3;
            const { icon: Icon, idle, active } = PILLAR_UI[pillar];
            return (
              <button
                key={pillar}
                type="button"
                aria-pressed={on}
                disabled={blocked || pending}
                onClick={() => togglePillar(pillar)}
                className={cn(
                  "flex w-1/4 min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border px-1.5 py-2.5 text-xs font-semibold shadow-sm transition-all sm:text-sm",
                  on ? active : idle,
                  blocked && "cursor-not-allowed opacity-40",
                  fieldErrors.categories && !on && "border-destructive/40",
                )}
              >
                <Icon className="size-4 shrink-0 sm:size-5" aria-hidden />
                {pillar}
              </button>
            );
          })}
        </div>
        <FieldError id="term-pillars-error" message={fieldErrors.categories} />
      </fieldset>

      <div
        className="absolute -left-2499.75 h-0 w-0 overflow-hidden"
        aria-hidden
      >
        <Label htmlFor="term-website">Website</Label>
        <Input
          id="term-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          className="h-12 gap-2.5 rounded-xl px-8 text-sm font-semibold shadow-md shadow-primary/20 sm:px-10"
          disabled={pending}
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Sparkles className="size-4" aria-hidden />
          )}
          {pending ? "Sending…" : "Submit term"}
        </Button>
      </div>
    </form>
  );
}
