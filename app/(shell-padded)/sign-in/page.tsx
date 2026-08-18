import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/sign-in-form";
import { getAuthUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in with email or Google.",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ error?: string; sent?: string }>;
};

export default async function SignInPage({ searchParams }: Props) {
  const user = await getAuthUser();
  if (user) {
    redirect("/");
  }

  const params = await searchParams;

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-3 text-muted-foreground">
        Use a magic link or Google. New visitors get an account automatically.
      </p>
      <SignInForm errorCode={params.error} sent={params.sent === "1"} />
    </div>
  );
}
