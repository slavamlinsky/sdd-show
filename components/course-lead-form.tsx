"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card className="mx-auto max-w-md border-border/80 shadow-sm ring-1 ring-foreground/[0.04]">
        <CardContent className="px-6 py-10 text-center sm:px-8" role="status">
          <p className="font-medium text-foreground">You are on the list.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            We will email you when the course opens for enrollment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-md border-border/80 shadow-md ring-1 ring-foreground/[0.06]">
      <CardHeader className="space-y-1 px-6 pb-2 pt-6 sm:px-8 sm:pt-8">
        <CardTitle className="font-heading text-lg">Join the notify list</CardTitle>
        <CardDescription>
          We ask for email so we can reach you when enrollment opens. Name is optional.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-6 pb-8 sm:px-8">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="lead-name">Name (optional)</Label>
            <Input
              id="lead-name"
              name="name"
              autoComplete="name"
              placeholder="Ada Lovelace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md"
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
              className="rounded-md"
            />
          </div>
          <Button type="submit" className="w-full rounded-md" size="lg">
            Notify me
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            No spam. One message when the course is ready. Unsubscribe any time.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
