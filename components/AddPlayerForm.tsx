"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { addPlayer } from "@/lib/actions";
import KitChip from "@/components/KitChip";
import { TEAM_LABEL } from "@/lib/ui";
import type { PlayerTeam } from "@/lib/types";

const TEAMS: PlayerTeam[] = ["SPID", "UNASSIGNED", "BELO"];

export default function AddPlayerForm() {
  const [name, setName] = useState("");
  const [team, setTeam] = useState<PlayerTeam>("UNASSIGNED");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Upiši ime igrača.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("name", trimmed);
      fd.set("team", team);
      const res = await addPlayer(fd);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setName("");
      setTeam("UNASSIGNED");
    });
  }

  return (
    <div className="card space-y-2.5 p-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Ime igrača"
        aria-label="Ime igrača"
        className="field"
      />

      <div className="segmented">
        {TEAMS.map((t) => {
          const active = team === t;
          const color =
            t === "SPID"
              ? "var(--spid)"
              : t === "BELO"
                ? "var(--belo)"
                : "var(--muted-2)";
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTeam(t)}
              data-active={active}
              className="flex items-center justify-center gap-1.5"
              style={
                active
                  ? {
                      background: `color-mix(in srgb, ${color} 22%, transparent)`,
                      color: "var(--foreground)",
                      boxShadow: `inset 0 0 0 1.5px ${color}`,
                    }
                  : undefined
              }
            >
              {t === "UNASSIGNED" ? (
                "Bez ekipe"
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

      {error && <p className="text-[13px] text-loss">{error}</p>}

      <button onClick={submit} disabled={pending} className="btn">
        <Plus size={17} strokeWidth={2.5} />
        {pending ? "Dodajem…" : "Dodaj igrača"}
      </button>
    </div>
  );
}
