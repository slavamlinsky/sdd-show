import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TestAttempt } from "@/components/test-attempt";
import { SectionBackdrop } from "@/components/section-backdrop";
import { getInnerTest } from "@/lib/tests/catalog";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = {
  title: "This quiz sitting is in progress. There is no timer.",
  description:
    "Work through this sitting one question at a time. There is no timer on screen. Correct answers are not shown until you finish and open the result.",
  robots: { index: false, follow: false },
};

export default async function TestAttemptPage({ params }: Props) {
  const { slug } = await params;
  const test = getInnerTest(slug);
  if (!test?.published) notFound();

  return (
    <div className="full-bleed relative overflow-hidden">
      <SectionBackdrop tone="emerald" />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <TestAttempt slug={slug} />
      </div>
    </div>
  );
}
