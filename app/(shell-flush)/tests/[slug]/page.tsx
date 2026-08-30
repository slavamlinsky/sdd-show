import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { Reveal } from "@/components/reveal";
import { SectionBackdrop } from "@/components/section-backdrop";
import { TestLeaderboard } from "@/components/test-leaderboard";
import { TestStartButton } from "@/components/test-start-button";
import { Badge } from "@/components/ui/badge";
import { getInnerTest, publishedInnerTests } from "@/lib/tests/catalog";
import { sittingSize } from "@/lib/tests/engine";
import { fetchLeaderboardRows } from "@/lib/tests/fetch-leaderboard";
import { displayNameFromAuth } from "@/lib/auth-display";
import { shareMetadata } from "@/lib/seo-page-meta";
import { siteConfig } from "@/lib/site-config";
import { getAuthUser } from "@/lib/supabase/server";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return publishedInnerTests().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const test = getInnerTest(slug);
  if (!test?.published) return {};

  const title = "A welcome quiz on SDD, specs, and software intent.";
  const description =
    "Take thirty random questions from a sixty-item bank on spec-driven development and intent-driven engineering. No timer on screen for this sitting.";

  return {
    title,
    description,
    ...shareMetadata({
      title,
      description,
      path: `/tests/${slug}`,
      image: siteConfig.defaultShareImage,
    }),
  };
}

const levelLabel = {
  basic: "Basic",
  advanced: "Advanced",
  pro: "Pro",
} as const;

export default async function TestIntroPage({ params }: Props) {
  const { slug } = await params;
  const test = getInnerTest(slug);
  if (!test?.published) notFound();

  const n = sittingSize(test.bank.length, test.sampleRatio);
  const user = await getAuthUser();
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
            { name: test.title },
          ]}
        />
        <Reveal className="mt-8 max-w-2xl space-y-4">
          <Badge variant="primary">{levelLabel[test.level]}</Badge>
          <h1>{test.title}</h1>
          <p className="leading-relaxed text-muted-foreground">{test.blurb}</p>
          <ul className="list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-muted-foreground">
            <li>
              {test.bank.length} questions in the bank; this sitting shows {n}{" "}
              of them ({Math.round(test.sampleRatio * 100)}%).
            </li>
            <li>Four choices each time, one correct. Options rotate between attempts.</li>
            <li>
              Aim for {test.passPercent}% for a solid grasp. Not a certificate.
            </li>
            <li>
              There is no timer on screen. We only record how long you take.
            </li>
            {test.estimatedMinutes ? (
              <li>Most people finish in {test.estimatedMinutes}.</li>
            ) : null}
          </ul>
          <div className="pt-4">
            <TestStartButton slug={test.slug} />
          </div>
        </Reveal>
        <section
          aria-labelledby="test-leaders-heading"
          className="mt-16 scroll-mt-24"
        >
          <Reveal>
            <TestLeaderboard
              rows={leaderboard}
              currentUserId={user?.id}
              currentUserName={currentUserName}
              signedIn={Boolean(user?.email)}
              signInNext={`/tests/${test.slug}`}
              headingId="test-leaders-heading"
              title="Leaders"
            />
          </Reveal>
        </section>
      </div>
    </div>
  );
}
