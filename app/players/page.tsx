import { getPlayers } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";
import AddPlayerForm from "@/components/AddPlayerForm";
import PlayerRow from "@/components/PlayerRow";
import type { Player } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PlayersPage() {
  const [players, admin] = await Promise.all([getPlayers(), isAdmin()]);

  const groups: { title: string; team: Player["team"] }[] = [
    { title: "SPID", team: "SPID" },
    { title: "BELO", team: "BELO" },
    { title: "Neopredijeljeni", team: "UNASSIGNED" },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-extrabold">Igrači</h1>

      {admin && <AddPlayerForm />}

      {groups.map((g) => {
        const list = players.filter((p) => p.team === g.team);
        if (list.length === 0) return null;
        return (
          <section key={g.team} className="space-y-2">
            <h2 className="px-1 text-sm font-semibold text-muted">
              {g.title}{" "}
              <span className="font-normal">({list.length})</span>
            </h2>
            <div className="space-y-1.5">
              {list.map((p) => (
                <PlayerRow key={p.id} player={p} admin={admin} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
