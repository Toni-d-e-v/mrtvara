"use client";

import { useTransition } from "react";
import type { Player, PlayerTeam } from "@/lib/types";
import { updatePlayerTeam, deletePlayer } from "@/lib/actions";

export default function PlayerRow({
  player,
  admin,
}: {
  player: Player;
  admin: boolean;
}) {
  const [pending, startTransition] = useTransition();

  const dot =
    player.team === "SPID"
      ? "var(--spid)"
      : player.team === "BELO"
        ? "var(--belo)"
        : "var(--muted)";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5">
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ background: dot }}
      />
      <span className="flex-1 truncate font-medium">{player.name}</span>

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
            className="rounded-lg border border-border bg-surface-2 px-2 py-1 text-xs outline-none"
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
            className="text-muted"
            aria-label="Obriši"
          >
            ✕
          </button>
        </>
      ) : (
        <span className="text-xs text-muted">{player.team}</span>
      )}
    </div>
  );
}
