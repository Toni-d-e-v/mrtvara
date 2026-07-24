import Link from "next/link";
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
    <section className="space-y-2">
      <h2 className="eyebrow flex items-center gap-1.5 px-1 text-[11px] text-muted-2">
        <Icon size={13} className="text-accent" />
        {title}
      </h2>
      <div className="card overflow-hidden">
        {ranked.length === 0 ? (
          <p className="px-4 py-3.5 text-[15px] text-muted">Nema podataka.</p>
        ) : (
          <ol className="list">
            {ranked.map((s, i) => (
              <li key={s.player_id} className="flex items-center gap-3 px-4 py-3">
                <span
                  className="display w-4 text-center text-[15px]"
                  style={{ color: i === 0 ? "var(--accent)" : "var(--muted-2)" }}
                >
                  {i + 1}
                </span>
                {(s.team === "SPID" || s.team === "BELO") && (
                  <KitChip team={s.team} size={15} />
                )}
                <Link
                  href={`/players/${s.player_id}`}
                  className="min-w-0 flex-1 truncate text-[15px] font-medium hover:text-accent"
                >
                  {s.name}
                </Link>
                <span className="display text-[15px]">{s[metric]}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
