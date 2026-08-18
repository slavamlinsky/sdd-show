"use client";

import { useState, type FormEvent } from "react";
import type { Provider } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

function authCallbackUrl(next = "/") {
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
}

export function SignInForm({
  errorCode,
  sent,
}: {
  errorCode?: string;
  sent?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState<"email" | Provider | null>(null);
  const [message, setMessage] = useState<string | null>(
    sent ? "Check your email for a sign-in link." : null
  );
  const [formError, setFormError] = useState<string | null>(() => {
    if (errorCode === "oauth") return "Social sign-in was cancelled or failed. Try again.";
    if (errorCode === "auth") return "Could not complete sign-in. Request a new link or try again.";
    return null;
  });

  if (!isSupabaseConfigured()) {
    return (
      <p className="mt-3 text-muted-foreground">
        Authentication isn’t configured in this environment. Add Supabase keys to{" "}
        <code className="text-sm">.env.local</code>.
      </p>
    );
  }

  async function sendMagicLink(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setMessage(null);
    setPending("email");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: authCallbackUrl(),
          shouldCreateUser: true,
        },
      });
      if (error) {
        setFormError(error.message);
        return;
      }
      setMessage("Check your email for a sign-in link.");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(null);
    }
  }

  async function signInWith(provider: Provider) {
    setFormError(null);
    setMessage(null);
    setPending(provider);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: authCallbackUrl() },
      });
      if (error) {
        setFormError(error.message);
        setPending(null);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
      setPending(null);
    }
  }

  return (
    <div className="mt-8 space-y-6 text-left">
      <form onSubmit={sendMagicLink} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-10"
          />
        </div>
        <Button type="submit" className="h-10 w-full" disabled={pending !== null}>
          {pending === "email" ? "Sending…" : "Email me a sign-in link"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <span className="w-full border-t border-border" />
        </div>
        <p className="relative mx-auto w-fit bg-background px-2 text-xs text-muted-foreground">
          Or continue with
        </p>
      </div>

      <div className="grid gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full gap-2"
          disabled={pending !== null}
          onClick={() => signInWith("google")}
        >
          <GoogleMark />
          Google
        </Button>
      </div>

      {message ? (
        <p className="text-sm text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}
      {formError ? (
        <p className="text-sm text-destructive" role="alert">
          {formError}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Google must be enabled in the Supabase dashboard (Authentication → Providers).
        Magic links use your project’s email settings.
      </p>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.4-.2-2H12z"
      />
      <path
        fill="#34A853"
        d="M5.3 14.3l-.8.6-2.8 2.2C3.5 20.5 7.5 23 12 23c2.7 0 5-.9 6.7-2.4l-3.1-2.4c-.9.6-2 .9-3.6.9-2.7 0-5-1.8-5.8-4.3z"
      />
      <path
        fill="#FBBC05"
        d="M2.4 7.1C1.5 8.9 1 10.9 1 13s.5 4.1 1.4 5.9l3.6-2.8c-.4-1.2-.6-2.1-.6-3.1s.2-2 .6-3.1z"
      />
      <path
        fill="#4285F4"
        d="M12 4.8c1.5 0 2.8.5 3.9 1.5l2.9-2.9C16.9 1.8 14.6 1 12 1 7.5 1 3.5 3.5 1.7 7.1l3.6 2.8C6.2 6.6 8.5 4.8 12 4.8z"
      />
    </svg>
  );
}
