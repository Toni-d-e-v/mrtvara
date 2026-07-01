import type { GoalWithNames } from "@/lib/types";

function StatBar({
  label,
  spid,
  belo,
}: {
  label: string;
  spid: number;
  belo: number;
}) {
  const total = spid + belo || 1;
  const spidPct = (spid / total) * 100;
  const beloPct = (belo / total) * 100;

  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-3 items-center text-sm">
        <span className="font-mono font-semibold tabular-nums text-spid">
          {spid}
        </span>
        <span className="text-center text-[11px] text-muted">{label}</span>
        <span
          className="text-right font-mono font-semibold tabular-nums"
          style={{ color: "var(--belo)" }}
        >
          {belo}
        </span>
      </div>
      <div className="flex h-1.5 gap-1">
        <div className="flex flex-1 justify-end">
          <span
            className="h-full rounded-full"
            style={{ width: `${spidPct}%`, background: "var(--spid)" }}
          />
        </div>
        <div className="flex flex-1 justify-start">
          <span
            className="h-full rounded-full"
            style={{ width: `${beloPct}%`, background: "var(--belo)" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function MatchStatsPanel({
  goals,
  spidScore,
  beloScore,
}: {
  goals: GoalWithNames[];
  spidScore: number;
  beloScore: number;
}) {
  const spidAssists = goals.filter(
    (g) => g.team === "SPID" && g.assist_id,
  ).length;
  const beloAssists = goals.filter(
    (g) => g.team === "BELO" && g.assist_id,
  ).length;

  if (goals.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted">
        Nema statistike — još nema golova.
      </p>
    );
  }

  return (
    <section className="space-y-4 rounded-lg border border-border bg-surface p-4">
      <StatBar label="Golovi" spid={spidScore} belo={beloScore} />
      <StatBar label="Asistencije" spid={spidAssists} belo={beloAssists} />
    </section>
  );
}
