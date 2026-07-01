import type { PlayerStats } from "@/lib/types";

export default function Leaderboard({
  title,
  icon,
  stats,
  metric,
}: {
  title: string;
  icon: string;
  stats: PlayerStats[];
  metric: keyof Pick<PlayerStats, "goals" | "assists" | "wins">;
}) {
  const ranked = [...stats]
    .filter((s) => s[metric] > 0)
    .sort((a, b) => b[metric] - a[metric])
    .slice(0, 5);

  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <span>{icon}</span> {title}
      </h2>
      {ranked.length === 0 ? (
        <p className="text-sm text-muted">Nema podataka.</p>
      ) : (
        <ol className="space-y-1.5">
          {ranked.map((s, i) => (
            <li
              key={s.player_id}
              className="flex items-center gap-3 text-sm"
            >
              <span className="w-5 text-center font-mono text-muted">
                {i + 1}
              </span>
              <span className="flex-1 truncate font-medium">{s.name}</span>
              <span className="font-mono font-bold tabular-nums">
                {s[metric]}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
