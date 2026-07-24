import Link from "next/link";
import { Medal } from "lucide-react";
import type { PlayerStats } from "@/lib/types";
import KitChip from "@/components/KitChip";

const MEDAL: Record<number, string> = {
  0: "#f5c518", // zlato
  1: "#c8ccd4", // srebro
  2: "#cd7f32", // bronca
};

function Step({ player, rank }: { player: PlayerStats; rank: number }) {
  const heights = ["h-20", "h-14", "h-10"];
  return (
    <Link
      href={`/players/${player.player_id}`}
      className="flex flex-1 flex-col items-center justify-end gap-1.5"
    >
      <Medal size={18} style={{ color: MEDAL[rank] }} />
      {(player.team === "SPID" || player.team === "BELO") && (
        <KitChip team={player.team} size={16} />
      )}
      <span className="max-w-full truncate px-1 text-center text-xs font-semibold">
        {player.name}
      </span>
      <div
        className={`flex w-full ${heights[rank]} items-start justify-center rounded-t-[14px]`}
        style={{
          background:
            rank === 0
              ? "linear-gradient(180deg, color-mix(in srgb, var(--accent) 32%, transparent), color-mix(in srgb, var(--accent) 8%, transparent))"
              : "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))",
          boxShadow: "var(--highlight)",
        }}
      >
        <span className="display pt-1.5 text-[15px]">{player.goals}</span>
      </div>
    </Link>
  );
}

export default function Podium({ top }: { top: PlayerStats[] }) {
  if (top.length === 0) return null;
  const [first, second, third] = top;

  return (
    <section className="card p-4">
      <h2 className="eyebrow mb-3 text-[11px] text-muted-2">
        Podij sezone · golovi
      </h2>
      <div className="flex items-end gap-2">
        {second ? <Step player={second} rank={1} /> : <div className="flex-1" />}
        <Step player={first} rank={0} />
        {third ? <Step player={third} rank={2} /> : <div className="flex-1" />}
      </div>
    </section>
  );
}
