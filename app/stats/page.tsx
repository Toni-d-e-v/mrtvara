import { getPlayerStats } from "@/lib/queries";
import Leaderboard from "@/components/Leaderboard";
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
    <div className="space-y-4">
      <RealtimeRefresher />
      <h1 className="text-xl font-extrabold">Statistika</h1>

      <Leaderboard
        title="Najbolji strijelci"
        icon="⚽"
        stats={stats}
        metric="goals"
      />
      <Leaderboard
        title="Najbolji asistenti"
        icon="🅰️"
        stats={stats}
        metric="assists"
      />
      <Leaderboard
        title="Najviše pobjeda"
        icon="🏆"
        stats={stats}
        metric="wins"
      />

      <section className="rounded-2xl border border-border bg-surface p-2">
        <h2 className="px-2 py-2 text-sm font-semibold">Svi igrači</h2>
        <div className="overflow-hidden rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted">
                <th className="px-2 py-1.5 text-left font-medium">Igrač</th>
                <th className="px-1 py-1.5 text-center font-medium">NAS</th>
                <th className="px-1 py-1.5 text-center font-medium">G</th>
                <th className="px-1 py-1.5 text-center font-medium">A</th>
                <th className="px-1 py-1.5 text-center font-medium">P-N-I</th>
              </tr>
            </thead>
            <tbody>
              {table.map((s) => (
                <tr key={s.player_id} className="border-t border-border">
                  <td className="max-w-[8rem] truncate px-2 py-2 font-medium">
                    {s.name}
                  </td>
                  <td className="px-1 py-2 text-center tabular-nums text-muted">
                    {s.appearances}
                  </td>
                  <td className="px-1 py-2 text-center font-bold tabular-nums">
                    {s.goals}
                  </td>
                  <td className="px-1 py-2 text-center tabular-nums">
                    {s.assists}
                  </td>
                  <td className="px-1 py-2 text-center font-mono text-xs tabular-nums text-muted">
                    {s.wins}-{s.draws}-{s.losses}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
