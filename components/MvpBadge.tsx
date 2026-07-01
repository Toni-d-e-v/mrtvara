import Link from "next/link";
import { Crown } from "lucide-react";
import type { Mvp } from "@/lib/stats";

export default function MvpBadge({ mvp }: { mvp: Mvp }) {
  const bits: string[] = [];
  if (mvp.goals) bits.push(`${mvp.goals}G`);
  if (mvp.assists) bits.push(`${mvp.assists}A`);

  return (
    <Link
      href={`/players/${mvp.playerId}`}
      className="flex items-center gap-2.5 rounded-lg border border-border bg-surface px-4 py-2.5"
    >
      <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft">
        <Crown size={16} className="text-accent" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="eyebrow text-[10px] text-muted-2">Igrač utakmice</div>
        <div className="truncate font-semibold">{mvp.name}</div>
      </div>
      {bits.length > 0 && (
        <span className="font-mono text-xs text-muted">{bits.join(" · ")}</span>
      )}
    </Link>
  );
}
