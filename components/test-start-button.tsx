"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getInnerTest } from "@/lib/tests/catalog";
import { createSitting } from "@/lib/tests/engine";
import { saveSitting } from "@/lib/tests/attempt-storage";
import { cn } from "@/lib/utils";

export function TestStartButton({
  slug,
  label = "Start test",
}: {
  slug: string;
  label?: string;
}) {
  return (
    <Link
      href={`/tests/${slug}/attempt`}
      className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-xl px-6 font-semibold")}
      onClick={() => {
        const test = getInnerTest(slug);
        if (!test?.published || test.bank.length === 0) return;
        saveSitting(createSitting(test));
      }}
    >
      {label}
    </Link>
  );
}
