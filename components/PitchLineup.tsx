import Link from "next/link";
import type { Player, GoalWithNames } from "@/lib/types";
import KitChip from "@/components/KitChip";
import TeamLogo from "@/components/TeamLogo";
import { TEAM_LABEL } from "@/lib/ui";

/** Rasporedi igrače u formacijske redove: vratar + ostatak u do 3 linije. */
function formationRows(players: Player[]): Player[][] {
  if (players.length <= 1) return [players];
  const [gk, ...rest] = players;
  const lines = Math.min(3, Math.max(1, Math.ceil(rest.length / 3)));
  const rows: Player[][] = Array.from({ length: lines }, () => []);
  rest.forEach((p, i) => rows[i % lines].push(p));
  return [[gk], ...rows];
}

function Marker({
  player,
  team,
  goals,
}: {
  player: Player;
  team: "SPID" | "BELO";
  goals: number;
}) {
  return (
    <div className="flex w-16 flex-col items-center gap-1">
      <div className="relative">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-black/30 ring-1 ring-white/40">
          <KitChip team={team} size={22} />
        </div>
        {goals > 0 && (
          <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold tabular-nums leading-none text-[color:var(--on-accent)]">
            {goals}
          </span>
        )}
      </div>
      <Link
        href={`/players/${player.id}`}
        className="max-w-full truncate rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white"
      >
        {player.name}
      </Link>
    </div>
  );
}

function Half({
  players,
  team,
  goalCount,
  reversed,
}: {
  players: Player[];
  team: "SPID" | "BELO";
  goalCount: Map<string, number>;
  reversed?: boolean;
}) {
  const rows = formationRows(players);
  if (reversed) rows.reverse();

  return (
    <div className="flex flex-1 flex-col justify-around py-1">
      {rows.map((row, i) => (
        <div key={i} className="flex items-start justify-around px-2">
          {row.map((p) => (
            <Marker
              key={p.id}
              player={p}
              team={team}
              goals={goalCount.get(p.id) ?? 0}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function PitchLineup({
  spid,
  belo,
  goals,
}: {
  spid: Player[];
  belo: Player[];
  goals: GoalWithNames[];
}) {
  const goalCount = new Map<string, number>();
  for (const g of goals) {
    if (g.scorer_id)
      goalCount.set(g.scorer_id, (goalCount.get(g.scorer_id) ?? 0) + 1);
  }

  return (
    <section
      className="relative w-full overflow-hidden rounded-lg border border-border"
      style={{
        aspectRatio: "3 / 4",
        background:
          "repeating-linear-gradient(180deg, #14512b 0 28px, #17592f 28px 56px)",
      }}
    >
      {/* Oznake terena */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-2 rounded-sm border border-white/20" />
        <div className="absolute inset-x-2 top-1/2 border-t border-white/20" />
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40" />
        {/* Kazneni prostori */}
        <div className="absolute left-1/2 top-2 h-12 w-32 -translate-x-1/2 border-x border-b border-white/20" />
        <div className="absolute bottom-2 left-1/2 h-12 w-32 -translate-x-1/2 border-x border-t border-white/20" />
        {/* Golovi */}
        <div className="absolute left-1/2 top-2 h-3 w-16 -translate-x-1/2 border-x border-b border-white/25" />
        <div className="absolute bottom-2 left-1/2 h-3 w-16 -translate-x-1/2 border-x border-t border-white/25" />
      </div>

      {/* Nazivi ekipa */}
      <div className="pointer-events-none absolute left-1/2 top-3 z-10 flex -translate-x-1/2 items-center gap-1.5">
        <TeamLogo team="SPID" width={34} />
        <span className="eyebrow text-[11px] text-white/90">
          {TEAM_LABEL.SPID}
        </span>
      </div>
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
        <TeamLogo team="BELO" width={34} />
        <span className="eyebrow text-[11px] text-white/90">
          {TEAM_LABEL.BELO}
        </span>
      </div>

      {/* Igrači */}
      <div className="relative z-[5] flex h-full flex-col px-1 pb-9 pt-9">
        <Half players={spid} team="SPID" goalCount={goalCount} />
        <Half players={belo} team="BELO" goalCount={goalCount} reversed />
      </div>
    </section>
  );
}
