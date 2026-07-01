import { Goal } from "lucide-react";
import type { Player, GoalWithNames } from "@/lib/types";
import KitChip from "@/components/KitChip";
import { TEAM_LABEL } from "@/lib/ui";

export default function LineupFaceoff({
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
    <div className="grid grid-cols-2 gap-3">
      <TeamColumn team="SPID" players={spid} goalCount={goalCount} align="left" />
      <TeamColumn team="BELO" players={belo} goalCount={goalCount} align="right" />
    </div>
  );
}

function TeamColumn({
  team,
  players,
  goalCount,
  align,
}: {
  team: "SPID" | "BELO";
  players: Player[];
  goalCount: Map<string, number>;
  align: "left" | "right";
}) {
  const right = align === "right";
  const color = team === "SPID" ? "var(--spid)" : "var(--belo)";

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div
        className={`flex items-center gap-2 border-b border-border px-3 py-2 ${right ? "flex-row-reverse" : ""}`}
      >
        <KitChip team={team} size={18} />
        <span className="eyebrow truncate text-xs" style={{ color }}>
          {TEAM_LABEL[team]}
        </span>
      </div>
      <ul className="divide-y divide-border/60">
        {players.map((p) => {
          const g = goalCount.get(p.id) ?? 0;
          return (
            <li
              key={p.id}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm ${right ? "flex-row-reverse text-right" : ""}`}
            >
              <span className="min-w-0 flex-1 truncate">{p.name}</span>
              {g > 0 && (
                <span
                  className={`flex shrink-0 items-center gap-0.5 font-mono text-[11px] text-muted ${right ? "flex-row-reverse" : ""}`}
                >
                  <Goal size={12} style={{ color }} />
                  {g > 1 ? g : ""}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
