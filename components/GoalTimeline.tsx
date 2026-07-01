"use client";

import { useTransition } from "react";
import { Goal, Footprints, Trash2 } from "lucide-react";
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
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted">
        Još nema golova.
      </p>
    );
  }

  return (
    <div className="relative py-1">
      {/* Središnja spine linija */}
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" />
      <ul className="relative space-y-3">
        {goals.map((g) => (
          <GoalRow key={g.id} goal={g} admin={admin} />
        ))}
      </ul>
    </div>
  );
}

function GoalRow({ goal, admin }: { goal: GoalWithNames; admin: boolean }) {
  const [pending, startTransition] = useTransition();
  const isSpid = goal.team === "SPID";
  const color = isSpid ? "var(--spid)" : "var(--belo)";

  const event = (
    <div className={`flex min-w-0 items-center gap-2 ${isSpid ? "flex-row-reverse text-right" : "text-left"}`}>
      <Goal size={15} style={{ color }} className="shrink-0" />
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">
          {goal.scorer_name ?? "?"}
        </div>
        {goal.assist_name && (
          <div
            className={`flex items-center gap-1 truncate text-[11px] text-muted ${isSpid ? "flex-row-reverse" : ""}`}
          >
            <Footprints size={10} className="shrink-0" />
            {goal.assist_name}
          </div>
        )}
      </div>
      {admin && (
        <button
          onClick={() => {
            if (confirm("Obrisati ovaj gol?"))
              startTransition(() => deleteGoal(goal.id, goal.match_id));
          }}
          disabled={pending}
          className="shrink-0 text-muted-2 transition-colors hover:text-loss"
          aria-label="Obriši gol"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );

  return (
    <li className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <div className="min-w-0">{isSpid && event}</div>

      <span className="z-10 rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-muted">
        {goal.minute != null ? `${goal.minute}'` : "—"}
      </span>

      <div className="min-w-0">{!isSpid && event}</div>
    </li>
  );
}
