"use client";

import { useState, useTransition } from "react";
import type { Player, Team } from "@/lib/types";
import { addGoal } from "@/lib/actions";

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

  return (
    <section className="space-y-3 rounded-2xl border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold text-muted">Dodaj gol</h2>

      <div className="flex overflow-hidden rounded-xl border border-border">
        <button
          type="button"
          onClick={() => pickTeam("SPID")}
          className="flex-1 py-2 text-sm font-bold"
          style={{
            background: team === "SPID" ? "var(--spid)" : "transparent",
            color: team === "SPID" ? "#0b0e14" : "var(--muted)",
          }}
        >
          SPID
        </button>
        <button
          type="button"
          onClick={() => pickTeam("BELO")}
          className="flex-1 py-2 text-sm font-bold"
          style={{
            background: team === "BELO" ? "var(--belo)" : "transparent",
            color: team === "BELO" ? "#0b0e14" : "var(--muted)",
          }}
        >
          BELO
        </button>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-2">
        <select
          value={scorerId}
          onChange={(e) => setScorerId(e.target.value)}
          className="rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
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
          className="w-20 rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-center text-sm outline-none focus:border-accent"
        />
      </div>

      <select
        value={assistId}
        onChange={(e) => setAssistId(e.target.value)}
        className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent"
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

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        onClick={submit}
        disabled={pending}
        className="w-full rounded-xl bg-accent px-4 py-2.5 font-bold text-black disabled:opacity-60"
      >
        {pending ? "Spremam…" : "Dodaj gol"}
      </button>
    </section>
  );
}
