import type { MatchSummary, GoalWithNames, PlayerStats, Team } from "@/lib/types";

export type Result = "W" | "D" | "L";

function resultFor(team: Team, spid: number, belo: number): Result {
  const mine = team === "SPID" ? spid : belo;
  const theirs = team === "SPID" ? belo : spid;
  if (mine > theirs) return "W";
  if (mine < theirs) return "L";
  return "D";
}

export interface TeamForm {
  last5: Result[]; // kronološki (staro → novo)
  streak: { type: Result; count: number } | null; // trenutni niz
}

/** `matches` je sortiran po datumu silazno (najnovije prvo). */
export function teamForm(matches: MatchSummary[], team: Team): TeamForm {
  const chrono = [...matches].reverse(); // staro → novo
  const results = chrono.map((m) =>
    resultFor(team, m.spid_score, m.belo_score),
  );
  const last5 = results.slice(-5);

  let streak: TeamForm["streak"] = null;
  for (let i = results.length - 1; i >= 0; i--) {
    if (!streak) streak = { type: results[i], count: 1 };
    else if (results[i] === streak.type) streak.count++;
    else break;
  }
  return { last5, streak };
}

export interface Mvp {
  playerId: string;
  name: string;
  goals: number;
  assists: number;
}

/** Igrač meča: max(golovi·2 + asistencije), tiebreak golovi. */
export function matchMvp(goals: GoalWithNames[]): Mvp | null {
  const map = new Map<string, Mvp>();
  const bump = (id: string | null, name: string | null, g: number, a: number) => {
    if (!id || !name) return;
    const cur = map.get(id) ?? { playerId: id, name, goals: 0, assists: 0 };
    cur.goals += g;
    cur.assists += a;
    map.set(id, cur);
  };
  for (const gl of goals) {
    bump(gl.scorer_id, gl.scorer_name, 1, 0);
    bump(gl.assist_id, gl.assist_name, 0, 1);
  }
  const ranked = [...map.values()].sort(
    (x, y) =>
      y.goals * 2 + y.assists - (x.goals * 2 + x.assists) || y.goals - x.goals,
  );
  return ranked[0] ?? null;
}

/** Top 3 igrača sezone po (golovi, pa golovi+asistencije). */
export function seasonPodium(stats: PlayerStats[]): PlayerStats[] {
  return [...stats]
    .filter((s) => s.goals + s.assists > 0)
    .sort(
      (a, b) =>
        b.goals - a.goals ||
        b.goals + b.assists - (a.goals + a.assists) ||
        a.name.localeCompare(b.name),
    )
    .slice(0, 3);
}
