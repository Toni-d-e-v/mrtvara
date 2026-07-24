"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { X, Pencil, Check, ChevronRight } from "lucide-react";
import type { Player, PlayerTeam } from "@/lib/types";
import { updatePlayerTeam, updatePlayerName, deletePlayer } from "@/lib/actions";
import KitChip from "@/components/KitChip";
import { TEAM_LABEL } from "@/lib/ui";

export default function PlayerRow({
  player,
  admin,
}: {
  player: Player;
  admin: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(player.name);
  const assigned = player.team === "SPID" || player.team === "BELO";

  function saveName() {
    const next = name.trim();
    if (!next || next === player.name) {
      setName(player.name);
      setEditing(false);
      return;
    }
    startTransition(async () => {
      const res = await updatePlayerName(player.id, next);
      if (res.error) setName(player.name);
      setEditing(false);
    });
  }

  // ---- Non-admin: redak u grupiranoj listi ----
  if (!admin) {
    return (
      <Link
        href={`/players/${player.id}`}
        className="flex items-center gap-3 px-4 py-3 active:bg-surface-2"
      >
        {assigned ? (
          <KitChip team={player.team as "SPID" | "BELO"} size={18} />
        ) : (
          <span className="h-3 w-3 rounded-full border border-border-strong" />
        )}
        <span className="min-w-0 flex-1 truncate text-[15px] font-medium">
          {player.name}
        </span>
        <ChevronRight size={16} className="shrink-0 text-muted-2" />
      </Link>
    );
  }

  // ---- Admin: management kartica ----
  const teams: (PlayerTeam)[] = ["SPID", "UNASSIGNED", "BELO"];

  return (
    <div className="space-y-2.5 card p-3">
      <div className="flex items-center gap-2.5">
        {assigned ? (
          <KitChip team={player.team as "SPID" | "BELO"} size={18} />
        ) : (
          <span className="h-3 w-3 shrink-0 rounded-full border border-border-strong" />
        )}

        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveName();
              if (e.key === "Escape") {
                setName(player.name);
                setEditing(false);
              }
            }}
            className="field min-w-0 flex-1 px-2 py-1 text-sm"
          />
        ) : (
          <span className="min-w-0 flex-1 truncate font-medium">
            {player.name}
          </span>
        )}

        {editing ? (
          <button
            onClick={saveName}
            disabled={pending}
            className="shrink-0 text-accent transition-opacity active:opacity-70"
            aria-label="Spremi ime"
          >
            <Check size={18} />
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="shrink-0 text-muted-2 transition-colors hover:text-foreground"
            aria-label="Uredi ime"
          >
            <Pencil size={15} />
          </button>
        )}

        <button
          onClick={() => {
            if (confirm(`Obrisati igrača ${player.name}?`))
              startTransition(() => deletePlayer(player.id));
          }}
          disabled={pending}
          className="shrink-0 text-muted-2 transition-colors hover:text-loss"
          aria-label="Obriši"
        >
          <X size={17} />
        </button>
      </div>

      {/* Segmentirani odabir ekipe */}
      <div className="segmented">
        {teams.map((t) => {
          const active = player.team === t;
          const color =
            t === "SPID"
              ? "var(--spid)"
              : t === "BELO"
                ? "var(--belo)"
                : "var(--muted-2)";
          return (
            <button
              key={t}
              onClick={() =>
                !active &&
                startTransition(() => updatePlayerTeam(player.id, t))
              }
              disabled={pending}
              data-active={active}
              className="flex items-center justify-center gap-1.5"
              style={{
                background: active
                  ? `color-mix(in srgb, ${color} 22%, transparent)`
                  : "transparent",
                color: active ? "var(--foreground)" : "var(--muted)",
                boxShadow: active ? `inset 0 0 0 1.5px ${color}` : "none",
              }}
            >
              {t === "UNASSIGNED" ? (
                "—"
              ) : (
                <>
                  <KitChip team={t as "SPID" | "BELO"} size={14} />
                  {TEAM_LABEL[t as "SPID" | "BELO"]}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
