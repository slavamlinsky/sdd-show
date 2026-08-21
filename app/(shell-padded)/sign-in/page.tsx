import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/sign-in-form";
import { metadataFromPageSeo, pageSeo } from "@/lib/seo-page-meta";
import { getAuthUser } from "@/lib/supabase/server";
import { searchParamString, type SearchParam } from "@/lib/search-params";
import { safeNextPath } from "@/lib/supabase/safe-path";

export const metadata: Metadata = metadataFromPageSeo(pageSeo.signIn);

type Props = {
  searchParams: Promise<{
    error?: SearchParam;
    sent?: SearchParam;
    next?: SearchParam;
  }>;
};

export default async function SignInPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = safeNextPath(searchParamString(params.next));
  const errorCode = searchParamString(params.error);
  const sent = searchParamString(params.sent) === "1";
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
        <SignInForm errorCode={errorCode} sent={sent} next={next} />
      </div>
    </div>
  );
}
