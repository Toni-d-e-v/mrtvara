import { createClient } from "@/lib/supabase/server";
import type {
  Player,
  PlayerStats,
  GoalWithNames,
  MatchSummary,
  Match,
  Team,
} from "@/lib/types";
import type { Result } from "@/lib/stats";

export async function getPlayers(): Promise<Player[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("players")
    .select("*")
    .order("name", { ascending: true });
  return data ?? [];
}

export async function getMatches(): Promise<MatchSummary[]> {
  const supabase = await createClient();
  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .order("match_date", { ascending: false });

  if (!matches || matches.length === 0) return [];

  const { data: goals } = await supabase
    .from("goals")
    .select("match_id, team");

  const scores = new Map<string, { spid: number; belo: number }>();
  for (const g of goals ?? []) {
    const s = scores.get(g.match_id) ?? { spid: 0, belo: 0 };
    if (g.team === "SPID") s.spid++;
    else s.belo++;
    scores.set(g.match_id, s);
  }

  return (matches as Match[]).map((m) => ({
    ...m,
    spid_score: scores.get(m.id)?.spid ?? 0,
    belo_score: scores.get(m.id)?.belo ?? 0,
  }));
}

export interface MatchDetail {
  match: Match;
  spidLineup: Player[];
  beloLineup: Player[];
  goals: GoalWithNames[];
  spidScore: number;
  beloScore: number;
}

export async function getMatch(id: string): Promise<MatchDetail | null> {
  const supabase = await createClient();

  const { data: match } = await supabase
    .from("matches")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!match) return null;

  const { data: lineups } = await supabase
    .from("match_lineups")
    .select("team, player:player_id(id, name, team, created_at)")
    .eq("match_id", id);

  const spidLineup: Player[] = [];
  const beloLineup: Player[] = [];
  for (const row of lineups ?? []) {
    const player = row.player as unknown as Player;
    if (!player) continue;
    if (row.team === "SPID") spidLineup.push(player);
    else beloLineup.push(player);
  }
  spidLineup.sort((a, b) => a.name.localeCompare(b.name));
  beloLineup.sort((a, b) => a.name.localeCompare(b.name));

  const { data: goalRows } = await supabase
    .from("goals")
    .select(
      "*, scorer:scorer_id(name), assist:assist_id(name)",
    )
    .eq("match_id", id);

  const goals: GoalWithNames[] = (goalRows ?? []).map((g) => ({
    id: g.id,
    match_id: g.match_id,
    team: g.team as Team,
    scorer_id: g.scorer_id,
    assist_id: g.assist_id,
    minute: g.minute,
    created_at: g.created_at,
    scorer_name: (g.scorer as { name: string } | null)?.name ?? null,
    assist_name: (g.assist as { name: string } | null)?.name ?? null,
  }));

  goals.sort((a, b) => (a.minute ?? 999) - (b.minute ?? 999));

  const spidScore = goals.filter((g) => g.team === "SPID").length;
  const beloScore = goals.filter((g) => g.team === "BELO").length;

  return {
    match: match as Match,
    spidLineup,
    beloLineup,
    goals,
    spidScore,
    beloScore,
  };
}

export async function getPlayerStats(): Promise<PlayerStats[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("player_stats").select("*");
  return (data ?? []) as PlayerStats[];
}

export interface GoalLogEntry {
  id: string;
  matchId: string;
  date: string;
  minute: number | null;
  team: Team;
}

export interface PlayerProfile {
  player: Player;
  stats: PlayerStats | null;
  goalLog: GoalLogEntry[];
  form: Result[]; // kronološki, zadnjih 5
  wins: number;
  losses: number;
  draws: number;
  maxGoalsInMatch: number;
  isTopScorer: boolean;
  isTopAssister: boolean;
}

export async function getPlayerProfile(
  id: string,
): Promise<PlayerProfile | null> {
  const supabase = await createClient();

  const { data: player } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!player) return null;

  const [allStats, matches, { data: lineups }, { data: goalRows }] =
    await Promise.all([
      getPlayerStats(),
      getMatches(),
      supabase.from("match_lineups").select("match_id, team").eq("player_id", id),
      supabase
        .from("goals")
        .select("id, minute, team, match_id")
        .eq("scorer_id", id),
    ]);

  const stats = allStats.find((s) => s.player_id === id) ?? null;

  const maxGoals = Math.max(0, ...allStats.map((s) => s.goals));
  const maxAssists = Math.max(0, ...allStats.map((s) => s.assists));
  const isTopScorer = !!stats && stats.goals > 0 && stats.goals === maxGoals;
  const isTopAssister =
    !!stats && stats.assists > 0 && stats.assists === maxAssists;

  // Golovi po meču (za hat-trick) + log
  const byMatch = new Map<string, number>();
  for (const g of goalRows ?? [])
    byMatch.set(g.match_id, (byMatch.get(g.match_id) ?? 0) + 1);
  const maxGoalsInMatch = Math.max(0, ...byMatch.values());

  const matchDate = new Map(matches.map((m) => [m.id, m.match_date]));
  const goalLog: GoalLogEntry[] = (goalRows ?? [])
    .map((g) => ({
      id: g.id as string,
      matchId: g.match_id as string,
      date: matchDate.get(g.match_id as string) ?? "",
      minute: g.minute as number | null,
      team: g.team as Team,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));

  // Rezultati po odigranim mečevima (tim varira po meču)
  const summaryById = new Map(matches.map((m) => [m.id, m]));
  const played = (lineups ?? [])
    .map((l) => ({ team: l.team as Team, m: summaryById.get(l.match_id) }))
    .filter((x) => x.m)
    .sort((a, b) => a.m!.match_date.localeCompare(b.m!.match_date)); // staro→novo

  let wins = 0;
  let losses = 0;
  let draws = 0;
  const results: Result[] = [];
  for (const { team, m } of played) {
    const mine = team === "SPID" ? m!.spid_score : m!.belo_score;
    const theirs = team === "SPID" ? m!.belo_score : m!.spid_score;
    const r: Result = mine > theirs ? "W" : mine < theirs ? "L" : "D";
    results.push(r);
    if (r === "W") wins++;
    else if (r === "L") losses++;
    else draws++;
  }

  return {
    player: player as Player,
    stats,
    goalLog,
    form: results.slice(-5),
    wins,
    losses,
    draws,
    maxGoalsInMatch,
    isTopScorer,
    isTopAssister,
  };
}
