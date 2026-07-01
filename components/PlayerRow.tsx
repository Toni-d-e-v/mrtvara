"use client";

import { useTransition } from "react";
import { X } from "lucide-react";
import type { Player, PlayerTeam } from "@/lib/types";
import { updatePlayerTeam, deletePlayer } from "@/lib/actions";
import KitChip from "@/components/KitChip";

export default function PlayerRow({
  player,
  admin,
}: {
  player: Player;
  admin: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const assigned = player.team === "SPID" || player.team === "BELO";

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5">
      {assigned ? (
        <KitChip team={player.team as "SPID" | "BELO"} size={18} />
      ) : (
        <span className="h-3 w-3 rounded-full border border-border-strong" />
      )}
      <span className="min-w-0 flex-1 truncate font-medium">{player.name}</span>

      {admin ? (
        <>
          <select
            value={player.team}
            disabled={pending}
            onChange={(e) =>
              startTransition(() =>
                updatePlayerTeam(player.id, e.target.value as PlayerTeam),
              )
            }
            className="rounded-md border border-border bg-surface-2 px-2 py-1 text-xs outline-none focus:border-accent"
          >
            <option value="SPID">SPID</option>
            <option value="BELO">BELO</option>
            <option value="UNASSIGNED">—</option>
          </select>
          <button
            onClick={() => {
              if (confirm(`Obrisati igrača ${player.name}?`))
                startTransition(() => deletePlayer(player.id));
            }}
            disabled={pending}
            className="text-muted-2 transition-colors hover:text-loss"
            aria-label="Obriši"
          >
            <X size={16} />
          </button>
        </>
      ) : (
        <span className="eyebrow text-[11px] text-muted-2">{player.team}</span>
      )}
    </div>
  );
}
