import Link from "next/link";
import type { MatchSummary } from "@/lib/types";
import { formatDate } from "@/lib/ui";

export default function MatchCard({ match }: { match: MatchSummary }) {
  const spidWin = match.spid_score > match.belo_score;
  const beloWin = match.belo_score > match.spid_score;

  return (
    <Link
      href={`/matches/${match.id}`}
      className="block rounded-2xl border border-border bg-surface p-4 transition-colors active:bg-surface-2"
    >
      <div className="mb-3 text-center text-xs font-medium text-muted">
        {formatDate(match.match_date)}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="text-right">
          <span
            className="inline-flex items-center gap-2 font-bold"
            style={{ opacity: beloWin ? 0.5 : 1 }}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--spid)" }}
            />
            SPID
          </span>
        </div>
        <div className="rounded-lg bg-surface-2 px-3 py-1 text-center font-mono text-lg font-extrabold tabular-nums">
          {match.spid_score}
          <span className="mx-1 text-muted">:</span>
          {match.belo_score}
        </div>
        <div className="text-left">
          <span
            className="inline-flex items-center gap-2 font-bold"
            style={{ opacity: spidWin ? 0.5 : 1 }}
          >
            BELO
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--belo)" }}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
