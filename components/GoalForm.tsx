"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import type { Player, Team } from "@/lib/types";
import { addGoal } from "@/lib/actions";
import KitChip from "@/components/KitChip";
import { TEAM_LABEL } from "@/lib/ui";

export default function GoalForm({
  matchId,
  spidLineup,
  beloLineup,
}: {
  matchId: string;
  spidLineup: Player[];
  beloLineup: Player[];
}) {
  const [team, setTeam] = useState<Team>("SPID");
  const [scorerId, setScorerId] = useState("");
  const [assistId, setAssistId] = useState("");
  const [minute, setMinute] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const roster = team === "SPID" ? spidLineup : beloLineup;

  function pickTeam(t: Team) {
    setTeam(t);
    setScorerId("");
    setAssistId("");
  }

  function submit() {
    setError(null);
    if (!scorerId) {
      setError("Odaberi strijelca.");
      return;
    }
    startTransition(async () => {
      const res = await addGoal({
        matchId,
        team,
        scorerId,
        assistId: assistId || null,
        minute: minute ? Number(minute) : null,
      });
      if (res.error) setError(res.error);
      else {
        setScorerId("");
        setAssistId("");
        setMinute("");
      }
    });
  }

  const selectClass = "field";

  return (
    <section className="space-y-3 card p-4">
      <h2 className="eyebrow text-xs text-muted">Dodaj gol</h2>

      <div className="grid grid-cols-2 gap-2">
        {(["SPID", "BELO"] as const).map((t) => {
          const active = team === t;
          const color = t === "SPID" ? "var(--spid)" : "var(--belo)";
          return (
            <button
              key={t}
              type="button"
              onClick={() => pickTeam(t)}
              className="press flex items-center justify-center gap-2 rounded-[13px] border py-2.5 text-sm font-semibold transition-colors"
              style={{
                borderColor: active ? color : "var(--border)",
                background: active ? "color-mix(in srgb, " + color + " 14%, transparent)" : "transparent",
                color: active ? color : "var(--muted)",
              }}
            >
              <KitChip team={t} size={16} />
              <span className="truncate">{TEAM_LABEL[t]}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-2">
        <select
          value={scorerId}
          onChange={(e) => setScorerId(e.target.value)}
          className={selectClass}
        >
          <option value="">Strijelac…</option>
          {roster.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          inputMode="numeric"
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
          placeholder="min"
          className="field w-20 text-center font-mono"
        />
      </div>

      <select
        value={assistId}
        onChange={(e) => setAssistId(e.target.value)}
        className={selectClass}
      >
        <option value="">Asistent (opcionalno)…</option>
        {roster
          .filter((p) => p.id !== scorerId)
          .map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
      </select>

      {error && <p className="text-sm text-loss">{error}</p>}

      <button
        onClick={submit}
        disabled={pending}
        className="btn transition-opacity active:opacity-80 disabled:opacity-60"
      >
        <Plus size={16} strokeWidth={2.5} />
        {pending ? "Spremam…" : "Dodaj gol"}
      </button>
    </section>
  );
}
