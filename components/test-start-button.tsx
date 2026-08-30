"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Play } from "lucide-react";
import { getInnerTest } from "@/lib/tests/catalog";
import { testGradientCta } from "@/lib/tests/chrome";
import { createSitting } from "@/lib/tests/engine";
import { saveSitting } from "@/lib/tests/attempt-storage";
import { cn } from "@/lib/utils";

export function TestStartButton({
  slug,
  label = "Start test",
  icon: Icon = Play,
}: {
  slug: string;
  label?: string;
  icon?: LucideIcon;
}) {
  return (
    <Link
      href={`/tests/${slug}/attempt`}
      className={cn(testGradientCta)}
      onClick={() => {
        const test = getInnerTest(slug);
        if (!test?.published || test.bank.length === 0) return;
        saveSitting(createSitting(test));
      }}
    >
      <Icon className="size-5" aria-hidden />
      {label}
    </Link>
  );
}
