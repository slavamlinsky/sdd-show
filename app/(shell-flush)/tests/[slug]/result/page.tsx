import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { SectionBackdrop } from "@/components/section-backdrop";
import { TestResult } from "@/components/test-result";
import { getInnerTest } from "@/lib/tests/catalog";
import { displayNameFromAuth } from "@/lib/auth-display";
import { fetchLeaderboardRows } from "@/lib/tests/fetch-leaderboard";
import { getAuthUser } from "@/lib/supabase/server";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = {
  title: "This sitting's result is a self-check, not a certificate.",
  description:
    "See your score, time, and a short review for this sitting. It is a self-check, not a certificate. Sign in if you want this score on the leaderboard.",
  robots: { index: false, follow: false },
};

export default async function TestResultPage({ params }: Props) {
  const { slug } = await params;
  const test = getInnerTest(slug);
  if (!test?.published) notFound();
  const user = await getAuthUser();
  const signedIn = Boolean(user?.email);
  const currentUserName = user?.email
    ? displayNameFromAuth(
        user.email,
        user.user_metadata as Record<string, unknown>,
      )
    : null;
  const leaderboard = await fetchLeaderboardRows({ slug: test.slug, limit: 10 });

  return (
    <div className="full-bleed relative overflow-hidden">
      <SectionBackdrop tone="emerald" />
      <div className="relative mx-auto w-full max-w-6xl px-4 pt-6 pb-16 sm:px-6 sm:pt-12 sm:pb-24">
        <PageBreadcrumbs
          items={[
            { name: "Tests", href: "/tests" },
            { name: test.title, href: `/tests/${slug}` },
            { name: "Result" },
          ]}
        />
        <div className="mt-8">
          <TestResult
            test={test}
            signedIn={signedIn}
            currentUserId={user?.id}
            currentUserName={currentUserName}
            leaderboard={leaderboard}
          />
        </div>
      </div>
    </div>
  );
}
