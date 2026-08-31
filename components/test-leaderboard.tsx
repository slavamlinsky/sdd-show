import Link from "next/link";
import { Trophy } from "lucide-react";
import { formatElapsed } from "@/lib/tests/engine";
import { getInnerTest } from "@/lib/tests/catalog";
import { testOutlineCta } from "@/lib/tests/chrome";
import type { LeaderboardRow } from "@/lib/tests/leaderboard";
import { cn } from "@/lib/utils";

export function TestLeaderboard({
  rows,
  currentUserId,
  currentUserName,
  signedIn,
  showTestTitle,
  signInNext,
  headingId = "leaderboard-heading",
  title = "Leaderboard",
}: {
  rows: LeaderboardRow[];
  currentUserId?: string | null;
  currentUserName?: string | null;
  signedIn: boolean;
  showTestTitle?: boolean;
  signInNext: string;
  headingId?: string;
  title?: string;
}) {
  return (
    <div className="rounded-[1.75rem] max-w-3xl mx-auto border border-border/60 bg-linear-to-br from-primary/6 via-muted/30 to-sky-500/5 px-6 py-10 shadow-sm ring-1 ring-foreground/4 sm:px-10">
      <h2
        id={headingId}
        className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl"
      >
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        {signedIn
          ? "Best score per person. Guests can take tests; only signed-in finishes are stored."
          : "Anyone can view this board. Sign in to save your score. Guests can still take the test."}
      </p>

      {rows.length === 0 ? (
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          {signedIn && currentUserName ? (
            <>
              <span className="font-medium text-foreground">
                {currentUserName}
              </span>
              , be the first to post a score.
              <br />
              Finish a test to appear here.
            </>
          ) : signedIn ? (
            <>
              Be the first to post a score.
              <br />
              Finish a test to appear here.
            </>
          ) : (
            <>
              Be the first to post a score.
              <br />
              Sign in and finish a test.
            </>
          )}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-md text-left text-sm">
            <caption className="sr-only">Best scores</caption>
            <thead>
              <tr className="border-b border-border/60 text-xs font-medium text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Rank</th>
                <th className="py-2 pr-3 font-medium">Name</th>
                {showTestTitle ? (
                  <th className="py-2 pr-3 font-medium">Test</th>
                ) : null}
                <th className="py-2 pr-3 font-medium">Score</th>
                <th className="py-2 pr-3 font-medium">Time</th>
                <th className="py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const isYou = Boolean(
                  currentUserId && row.userId === currentUserId,
                );
                const testTitle =
                  getInnerTest(row.testSlug)?.title ?? row.testSlug;
                return (
                  <tr
                    key={`${row.testSlug}-${row.userId}`}
                    className={cn(
                      "border-b border-border/40 last:border-0",
                      isYou && "bg-primary/6",
                    )}
                  >
                    <td className="py-3 pr-3 tabular-nums">
                      <RankMark rank={row.rank} />
                    </td>
                    <td className="py-3 pr-3 font-medium">
                      {row.displayName}
                      {isYou ? (
                        <span className="ml-2 text-xs font-medium text-muted-foreground">
                          You
                        </span>
                      ) : null}
                    </td>
                    {showTestTitle ? (
                      <td className="py-3 pr-3 text-muted-foreground">
                        {testTitle}
                      </td>
                    ) : null}
                    <td className="py-3 pr-3 tabular-nums font-medium">
                      {row.percent}%
                    </td>
                    <td className="py-3 pr-3 text-muted-foreground">
                      {formatElapsed(row.elapsedMs)}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {formatBoardDate(row.finishedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {signedIn ? null : (
        <Link
          href={`/sign-in?next=${encodeURIComponent(signInNext)}`}
          className={cn(testOutlineCta, "mt-6")}
        >
          <Trophy className="size-5" aria-hidden />
          Sign in to save a score
        </Link>
      )}
    </div>
  );
}

function RankMark({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="font-semibold text-amber-600 dark:text-amber-400">
        1
      </span>
    );
  }
  if (rank === 2) {
    return <span className="font-semibold text-slate-500">2</span>;
  }
  if (rank === 3) {
    return (
      <span className="font-semibold text-orange-700 dark:text-orange-400">
        3
      </span>
    );
  }
  return <span className="tabular-nums text-muted-foreground">{rank}</span>;
}

function formatBoardDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
