export type Team = "SPID" | "BELO";
export type PlayerTeam = Team | "UNASSIGNED";

export interface Player {
  id: string;
  name: string;
  team: PlayerTeam;
  created_at: string;
}

export interface Match {
  id: string;
  match_date: string;
  created_at: string;
}

export interface MatchLineup {
  match_id: string;
  player_id: string;
  team: Team;
}

export interface Goal {
  id: string;
  match_id: string;
  team: Team;
  scorer_id: string | null;
  assist_id: string | null;
  minute: number | null;
  created_at: string;
}

export interface PlayerStats {
  player_id: string;
  name: string;
  team: PlayerTeam;
  appearances: number;
  goals: number;
  assists: number;
  wins: number;
  losses: number;
  draws: number;
}

// A goal joined with player names, used in the match timeline.
export interface GoalWithNames extends Goal {
  scorer_name: string | null;
  assist_name: string | null;
}

// Aggregated match info for lists.
export interface MatchSummary extends Match {
  spid_score: number;
  belo_score: number;
}
