import Link from "next/link";
import { Goal, Footprints, Trophy } from "lucide-react";
import { getPlayerStats } from "@/lib/queries";
import Leaderboard from "@/components/Leaderboard";
import Podium from "@/components/Podium";
import KitChip from "@/components/KitChip";
import RealtimeRefresher from "@/components/RealtimeRefresher";
import { seasonPodium } from "@/lib/stats";

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
      <h1 className="display text-[28px] leading-tight">Statistika</h1>

      <Podium top={seasonPodium(stats)} />

      <Leaderboard title="Najbolji strijelci" Icon={Goal} stats={stats} metric="goals" />
      <Leaderboard title="Najbolji asistenti" Icon={Footprints} stats={stats} metric="assists" />
      <Leaderboard title="Najviše pobjeda" Icon={Trophy} stats={stats} metric="wins" />

      <section className="space-y-2">
        <h2 className="eyebrow px-1 text-[11px] text-muted-2">Svi igrači</h2>
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="eyebrow text-[10px] text-muted-2">
                <th className="py-2.5 pl-4 pr-2 text-left font-semibold">Igrač</th>
                <th className="w-9 px-1 py-2.5 text-right font-semibold">Nas</th>
                <th className="w-9 px-1 py-2.5 text-right font-semibold">G</th>
                <th className="w-9 px-1 py-2.5 text-right font-semibold">A</th>
                <th className="w-[4.5rem] py-2.5 pl-2 pr-4 text-right font-semibold">
                  P-N-I
                </th>
              </tr>
            </thead>
            <tbody className="list-table">
              {table.map((s) => (
                <tr key={s.player_id} className="text-[15px]">
                  <td className="py-2.5 pl-4 pr-2">
                    <span className="flex items-center gap-2">
                      {(s.team === "SPID" || s.team === "BELO") && (
                        <KitChip team={s.team} size={14} />
                      )}
                      <Link
                        href={`/players/${s.player_id}`}
                        className="max-w-[7rem] truncate font-medium hover:text-accent"
                      >
                        {s.name}
                      </Link>
                    </span>
                  </td>
                  <td className="px-1 py-2.5 text-right tabular-nums text-muted">
                    {s.appearances}
                  </td>
                  <td className="px-1 py-2.5 text-right font-semibold tabular-nums">
                    {s.goals}
                  </td>
                  <td className="px-1 py-2.5 text-right tabular-nums">
                    {s.assists}
                  </td>
                  <td className="py-2.5 pl-2 pr-4 text-right text-[13px] tabular-nums text-muted-2">
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
