import type { LucideIcon } from "lucide-react";
import type { PlayerStats } from "@/lib/types";
import KitChip from "@/components/KitChip";

export default function Leaderboard({
  title,
  Icon,
  stats,
  metric,
}: {
  title: string;
  Icon: LucideIcon;
  stats: PlayerStats[];
  metric: keyof Pick<PlayerStats, "goals" | "assists" | "wins">;
}) {
  const ranked = [...stats]
    .filter((s) => s[metric] > 0)
    .sort((a, b) => b[metric] - a[metric])
    .slice(0, 5);

  return (
    <section className="rounded-lg border border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <Icon size={15} className="text-accent" />
        <h2 className="eyebrow text-xs">{title}</h2>
      </div>
      {ranked.length === 0 ? (
        <p className="px-4 py-4 text-sm text-muted">Nema podataka.</p>
      ) : (
        <ol className="divide-y divide-border/60">
          {ranked.map((s, i) => (
            <li key={s.player_id} className="flex items-center gap-3 px-4 py-2.5">
              <span
                className="display w-5 text-center text-base tabular-nums"
                style={{ color: i === 0 ? "var(--accent)" : "var(--muted-2)" }}
              >
                {i + 1}
              </span>
              {(s.team === "SPID" || s.team === "BELO") && (
                <KitChip team={s.team} size={15} />
              )}
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {s.name}
              </span>
              <span className="font-mono text-sm font-semibold tabular-nums">
                {s[metric]}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
