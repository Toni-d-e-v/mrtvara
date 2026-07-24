import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { MatchSummary, Team } from "@/lib/types";
import { formatDate, TEAM_LABEL } from "@/lib/ui";
import TeamLogo from "@/components/TeamLogo";

/** Jedan red: logo, ime ekipe i rezultat. Pobjednik ostaje pun, gubitnik se stiša. */
function TeamRow({
  team,
  score,
  won,
  lost,
}: {
  team: Team;
  score: number;
  won: boolean;
  lost: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <TeamLogo team={team} width={36} className="shrink-0" />
      <span
        className="min-w-0 flex-1 truncate text-[15px] font-semibold"
        style={{ color: lost ? "var(--muted)" : "var(--foreground)" }}
      >
        {TEAM_LABEL[team]}
      </span>
      {won && (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
          aria-label="Pobjednik"
        />
      )}
      <span
        className="display w-8 text-right text-[21px] leading-none"
        style={{ color: lost ? "var(--muted)" : "var(--foreground)" }}
      >
        {score}
      </span>
    </div>
  );
}

export default function MatchCard({ match }: { match: MatchSummary }) {
  const spidWin = match.spid_score > match.belo_score;
  const beloWin = match.belo_score > match.spid_score;

  return (
    <Link
      href={`/matches/${match.id}`}
      className="card press block px-4 py-3.5 transition-colors hover:border-border-strong"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[13px] tabular-nums text-muted-2">
          {formatDate(match.match_date)}
        </span>
        <span className="flex items-center gap-1.5 text-muted-2">
          {!spidWin && !beloWin && (
            <span className="eyebrow text-[10px]">Neriješeno</span>
          )}
          <ChevronRight size={16} />
        </span>
      </div>

      <div className="space-y-2.5">
        <TeamRow
          team="SPID"
          score={match.spid_score}
          won={spidWin}
          lost={beloWin}
        />
        <TeamRow
          team="BELO"
          score={match.belo_score}
          won={beloWin}
          lost={spidWin}
        />
      </div>
    </Link>
  );
}
