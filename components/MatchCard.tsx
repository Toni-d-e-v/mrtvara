import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { MatchSummary } from "@/lib/types";
import { formatDate } from "@/lib/ui";
import KitChip from "@/components/KitChip";

export default function MatchCard({ match }: { match: MatchSummary }) {
  const spidWin = match.spid_score > match.belo_score;
  const beloWin = match.belo_score > match.spid_score;

  const edge = spidWin
    ? "var(--spid)"
    : beloWin
      ? "var(--belo)"
      : "var(--border-strong)";

  return (
    <Link
      href={`/matches/${match.id}`}
      className="group flex items-stretch overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-border-strong active:bg-surface-2"
    >
      <span className="w-1 shrink-0" style={{ background: edge }} />

      <div className="min-w-0 flex-1 px-3 py-3">
        <div className="mb-2 text-center font-mono text-[11px] text-muted-2">
          {formatDate(match.match_date)}
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div
            className="flex items-center justify-end gap-2 font-semibold"
            style={{ opacity: beloWin ? 0.45 : 1 }}
          >
            <span className="eyebrow text-sm text-spid">SPID</span>
            <KitChip team="SPID" size={18} />
          </div>

          <div className="display flex items-baseline gap-1.5 text-2xl tabular-nums">
            <span>{match.spid_score}</span>
            <span className="text-base text-muted-2">:</span>
            <span>{match.belo_score}</span>
          </div>

          <div
            className="flex items-center gap-2 font-semibold"
            style={{ opacity: spidWin ? 0.45 : 1 }}
          >
            <KitChip team="BELO" size={18} />
            <span className="eyebrow text-sm" style={{ color: "var(--belo)" }}>
              BELO
            </span>
          </div>
        </div>
      </div>

      <span className="flex items-center pr-2 text-muted-2 transition-colors group-hover:text-muted">
        <ChevronRight size={16} />
      </span>
    </Link>
  );
}
