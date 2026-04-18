"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function CourseLeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailOk(email.trim())) return;
    console.info("[course-lead]", { name: name.trim() || undefined, email: email.trim() });
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div
        className="rounded-xl border border-border bg-muted/30 px-5 py-8 text-center"
        role="status"
      >
        <p className="font-medium text-foreground">You are on the list.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          We will email you when the course opens for enrollment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-5">
      <div className="space-y-2">
        <Label htmlFor="lead-name">Name (optional)</Label>
        <Input
          id="lead-name"
          name="name"
          autoComplete="name"
          placeholder="Ada Lovelace"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lead-email">Email</Label>
        <Input
          id="lead-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@school.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" size="lg">
        Notify me
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        No spam — one update when the course is ready. Unsubscribe any time.
        </p>
    </form>
  );
}
