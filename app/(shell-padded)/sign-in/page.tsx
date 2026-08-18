import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/sign-in-form";
import { getAuthUser } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/supabase/safe-path";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in with email or Google.",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ error?: string; sent?: string; next?: string }>;
};

export default async function SignInPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = safeNextPath(params.next);
  const user = await getAuthUser();
  if (user) {
    redirect(next);
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl gradient-text-fill font-semibold tracking-tight">
        Welcome to the community
      </h1>
      <p className="mt-6 text-muted-foreground">
        You can sign in with a magic link or your Google account. New visitors
        get an account automatically.
      </p>
      <div className="mt-12 space-y-6 bg-accent rounded-lg p-6">
        <SignInForm
          errorCode={params.error}
          sent={params.sent === "1"}
          next={next}
        />
      </div>
    </div>
  );
}
