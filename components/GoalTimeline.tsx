"use client";

import { useTransition } from "react";
import type { GoalWithNames } from "@/lib/types";
import { deleteGoal } from "@/lib/actions";

export default function GoalTimeline({
  goals,
  admin,
}: {
  goals: GoalWithNames[];
  admin: boolean;
}) {
  if (goals.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted">
        Još nema golova.
      </p>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-2">
      <ul className="divide-y divide-border">
        {goals.map((g) => (
          <GoalRow key={g.id} goal={g} admin={admin} />
        ))}
      </ul>
    </section>
  );
}

function GoalRow({ goal, admin }: { goal: GoalWithNames; admin: boolean }) {
  const [pending, startTransition] = useTransition();
  const isSpid = goal.team === "SPID";

  const info = (
    <div className={isSpid ? "text-left" : "text-right"}>
      <div className="flex items-center gap-1.5 text-sm font-semibold"
        style={{ justifyContent: isSpid ? "flex-start" : "flex-end" }}
      >
        <span>⚽</span>
        <span className="truncate">{goal.scorer_name ?? "?"}</span>
      </div>
      {goal.assist_name && (
        <div className="text-xs text-muted">asist: {goal.assist_name}</div>
      )}
    </div>
  );

  return (
    <li className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-2 py-2.5">
      <div className="min-w-0">{isSpid && info}</div>

      <div className="flex items-center gap-1.5">
        {admin && (
          <button
            onClick={() => {
              if (confirm("Obrisati ovaj gol?"))
                startTransition(() => deleteGoal(goal.id, goal.match_id));
            }}
            disabled={pending}
            className="text-xs text-muted"
            aria-label="Obriši gol"
          >
            ✕
          </button>
        )}
        <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-xs tabular-nums text-muted">
          {goal.minute != null ? `${goal.minute}'` : "—"}
        </span>
      </div>

      <div className="min-w-0">{!isSpid && info}</div>
    </li>
  );
}
