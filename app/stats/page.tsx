import { Goal, Footprints, Trophy } from "lucide-react";
import { getPlayerStats } from "@/lib/queries";
import Leaderboard from "@/components/Leaderboard";
import KitChip from "@/components/KitChip";
import RealtimeRefresher from "@/components/RealtimeRefresher";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const stats = await getPlayerStats();

  const table = [...stats].sort(
    (a, b) =>
      b.goals - a.goals ||
      b.assists - a.assists ||
      b.appearances - a.appearances ||
      a.name.localeCompare(b.name),
  );

  return (
    <div className="space-y-5">
      <RealtimeRefresher />
      <h1 className="display text-2xl">Statistika</h1>

      <Leaderboard title="Najbolji strijelci" Icon={Goal} stats={stats} metric="goals" />
      <Leaderboard title="Najbolji asistenti" Icon={Footprints} stats={stats} metric="assists" />
      <Leaderboard title="Najviše pobjeda" Icon={Trophy} stats={stats} metric="wins" />

      <section className="overflow-hidden rounded-lg border border-border bg-surface">
        <h2 className="eyebrow border-b border-border px-4 py-2.5 text-xs">
          Svi igrači
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] text-muted-2">
              <th className="px-3 py-2 text-left font-medium">Igrač</th>
              <th className="px-1 py-2 text-center font-medium">NAS</th>
              <th className="px-1 py-2 text-center font-medium">G</th>
              <th className="px-1 py-2 text-center font-medium">A</th>
              <th className="px-2 py-2 text-center font-medium">P-N-I</th>
            </tr>
          </thead>
          <tbody>
            {table.map((s, i) => (
              <tr
                key={s.player_id}
                className="border-t border-border/60"
                style={{ background: i % 2 ? "var(--surface-2)" : "transparent" }}
              >
                <td className="px-3 py-2">
                  <span className="flex items-center gap-2">
                    {(s.team === "SPID" || s.team === "BELO") && (
                      <KitChip team={s.team} size={14} />
                    )}
                    <span className="max-w-[7rem] truncate font-medium">
                      {s.name}
                    </span>
                  </span>
                </td>
                <td className="px-1 py-2 text-center font-mono tabular-nums text-muted">
                  {s.appearances}
                </td>
                <td className="px-1 py-2 text-center font-mono font-semibold tabular-nums">
                  {s.goals}
                </td>
                <td className="px-1 py-2 text-center font-mono tabular-nums">
                  {s.assists}
                </td>
                <td className="px-2 py-2 text-center font-mono text-[11px] tabular-nums text-muted">
                  {s.wins}-{s.draws}-{s.losses}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
