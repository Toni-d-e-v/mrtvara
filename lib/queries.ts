import { createClient } from "@/lib/supabase/server";
import type {
  Player,
  PlayerStats,
  GoalWithNames,
  MatchSummary,
  Match,
  Team,
} from "@/lib/types";

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
