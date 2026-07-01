"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Player, Team } from "@/lib/types";
import { createMatch } from "@/lib/actions";

type Assignment = Record<string, Team | "OUT">;

function nextFriday(): string {
  const d = new Date();
  const day = d.getDay(); // 0 Sun .. 5 Fri
  const diff = (5 - day + 7) % 7;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

export default function NewMatchForm({ players }: { players: Player[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState(nextFriday());

  const [assign, setAssign] = useState<Assignment>(() => {
    const init: Assignment = {};
    for (const p of players)
      init[p.id] = p.team === "SPID" || p.team === "BELO" ? p.team : "OUT";
    return init;
  });

  const counts = useMemo(() => {
    let spid = 0;
    let belo = 0;
    for (const v of Object.values(assign)) {
      if (v === "SPID") spid++;
      else if (v === "BELO") belo++;
    }
    return { spid, belo };
  }, [assign]);

  function set(id: string, team: Team | "OUT") {
    setAssign((a) => ({ ...a, [id]: team }));
  }

  function submit() {
    setError(null);
    const spidIds = players.filter((p) => assign[p.id] === "SPID").map((p) => p.id);
    const beloIds = players.filter((p) => assign[p.id] === "BELO").map((p) => p.id);
    if (spidIds.length === 0 || beloIds.length === 0) {
      setError("Obje ekipe moraju imati barem jednog igrača.");
      return;
    }
    startTransition(async () => {
      const res = await createMatch({ matchDate: date, spidIds, beloIds });
      if (res.error) setError(res.error);
      else if (res.id) router.push(`/matches/${res.id}`);
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs text-muted">Datum</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 outline-none focus:border-accent"
        />
      </div>

      <div className="flex justify-between px-1 text-sm font-semibold">
        <span className="text-spid">SPID · {counts.spid}</span>
        <span style={{ color: "var(--belo)" }}>{counts.belo} · BELO</span>
      </div>

      <div className="space-y-1.5">
        {players.map((p) => {
          const v = assign[p.id];
          return (
            <div
              key={p.id}
              className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2"
            >
              <span className="flex-1 truncate text-sm font-medium">
                {p.name}
              </span>
              <div className="flex overflow-hidden rounded-lg border border-border">
                <Seg active={v === "SPID"} color="var(--spid)" onClick={() => set(p.id, "SPID")}>
                  SPID
                </Seg>
                <Seg active={v === "OUT"} onClick={() => set(p.id, "OUT")}>
                  —
                </Seg>
                <Seg active={v === "BELO"} color="var(--belo)" onClick={() => set(p.id, "BELO")}>
                  BELO
                </Seg>
              </div>
            </div>
          );
        })}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        onClick={submit}
        disabled={pending}
        className="w-full rounded-xl bg-accent px-4 py-3 font-bold text-black disabled:opacity-60"
      >
        {pending ? "Spremam…" : "Kreiraj utakmicu"}
      </button>
    </div>
  );
}

function Seg({
  active,
  color,
  onClick,
  children,
}: {
  active: boolean;
  color?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-2.5 py-1.5 text-xs font-bold transition-colors"
      style={{
        background: active ? (color ?? "var(--muted)") : "transparent",
        color: active ? "#0b0e14" : "var(--muted)",
      }}
    >
      {children}
    </button>
  );
}
