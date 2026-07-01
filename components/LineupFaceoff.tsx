import type { Player, GoalWithNames } from "@/lib/types";

export default function LineupFaceoff({
  spid,
  belo,
  goals,
}: {
  spid: Player[];
  belo: Player[];
  goals: GoalWithNames[];
}) {
  const goalCount = new Map<string, number>();
  for (const g of goals) {
    if (g.scorer_id)
      goalCount.set(g.scorer_id, (goalCount.get(g.scorer_id) ?? 0) + 1);
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <h2 className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted">
        Postave
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <ul className="space-y-1.5">
          {spid.map((p) => (
            <li key={p.id} className="flex items-center gap-2 text-sm">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: "var(--spid)" }}
              />
              <span className="truncate">{p.name}</span>
              {goalCount.get(p.id) ? (
                <span className="text-xs text-muted">
                  {"⚽".repeat(goalCount.get(p.id)!)}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
        <ul className="space-y-1.5 text-right">
          {belo.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-end gap-2 text-sm"
            >
              {goalCount.get(p.id) ? (
                <span className="text-xs text-muted">
                  {"⚽".repeat(goalCount.get(p.id)!)}
                </span>
              ) : null}
              <span className="truncate">{p.name}</span>
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: "var(--belo)" }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
