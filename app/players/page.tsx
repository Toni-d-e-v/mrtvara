import { getPlayers } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";
import AddPlayerForm from "@/components/AddPlayerForm";
import PlayerRow from "@/components/PlayerRow";
import KitChip from "@/components/KitChip";
import { TEAM_LABEL } from "@/lib/ui";
import type { Player } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PlayersPage() {
  const [players, admin] = await Promise.all([getPlayers(), isAdmin()]);

  const groups: {
    title: string;
    team: Player["team"];
    color?: string;
  }[] = [
    { title: TEAM_LABEL.SPID, team: "SPID", color: "var(--spid)" },
    { title: TEAM_LABEL.BELO, team: "BELO", color: "var(--belo)" },
    { title: "Neopredijeljeni", team: "UNASSIGNED" },
  ];

  return (
    <div className="space-y-4">
      <h1 className="display text-[28px] leading-tight">Igrači</h1>

      {admin && <AddPlayerForm />}

      {groups.map((g) => {
        const list = players.filter((p) => p.team === g.team);
        if (list.length === 0) return null;
        return (
          <section key={g.team} className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              {(g.team === "SPID" || g.team === "BELO") && (
                <KitChip team={g.team} size={15} />
              )}
              <h2 className="eyebrow text-[11px]" style={{ color: g.color }}>
                {g.title}
              </h2>
              <span className="text-[12px] tabular-nums text-muted-2">
                {list.length}
              </span>
            </div>

            {admin ? (
              <div className="space-y-2">
                {list.map((p) => (
                  <PlayerRow key={p.id} player={p} admin />
                ))}
              </div>
            ) : (
              <div className="card list overflow-hidden">
                {list.map((p) => (
                  <PlayerRow key={p.id} player={p} admin={false} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
