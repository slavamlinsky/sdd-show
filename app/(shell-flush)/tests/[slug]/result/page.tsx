import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { TestResult } from "@/components/test-result";
import { getInnerTest } from "@/lib/tests/catalog";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = {
  title: "Test result.",
  robots: { index: false, follow: false },
};

export default async function TestResultPage({ params }: Props) {
  const { slug } = await params;
  const test = getInnerTest(slug);
  if (!test?.published) notFound();

  return (
    <div className="full-bleed relative">
      <div className="relative mx-auto w-full max-w-6xl px-4 pt-6 pb-16 sm:px-6 sm:pt-12 sm:pb-24">
        <PageBreadcrumbs
          items={[
            { name: "Tests", href: "/tests" },
            { name: test.title, href: `/tests/${slug}` },
            { name: "Result" },
          ]}
        />
        <div className="mt-8">
          <TestResult test={test} />
        </div>
      </div>
    </div>
  );
}
