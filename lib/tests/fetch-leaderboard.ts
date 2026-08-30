import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { LeaderboardRow } from "./leaderboard.ts";

type RpcRow = {
  rank: number | string;
  user_id: string;
  test_slug: string;
  display_name: string;
  percent: number | string;
  elapsed_ms: number | string;
  finished_at: string;
};

export async function fetchLeaderboardRows(options?: {
  slug?: string | null;
  limit?: number;
}): Promise<LeaderboardRow[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("test_leaderboard_rows", {
      p_slug: options?.slug ?? null,
      p_limit: options?.limit ?? 10,
    });
    if (error) {
      if (!isMissingLeaderboard(error.message)) {
        console.error("[test-leaderboard]", error.message);
      }
      return [];
    }
    const rows = (data as RpcRow[] | null) ?? [];
    const mapped: LeaderboardRow[] = [];
    for (const row of rows) {
      const item = mapRow(row);
      if (item) mapped.push(item);
    }
    return mapped;
  } catch {
    return [];
  }
}

function mapRow(row: RpcRow): LeaderboardRow | null {
  if (!row?.user_id || !row.test_slug) return null;
  const finished =
    typeof row.finished_at === "string"
      ? row.finished_at
      : new Date(row.finished_at).toISOString();
  return {
    rank: Number(row.rank),
    userId: row.user_id,
    testSlug: row.test_slug,
    displayName: row.display_name || "Player",
    percent: Number(row.percent),
    elapsedMs: Number(row.elapsed_ms),
    finishedAt: finished,
  };
}

function isMissingLeaderboard(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("test_leaderboard_rows") ||
    (lower.includes("test_attempts") &&
      (lower.includes("does not exist") || lower.includes("schema cache")))
  );
}
