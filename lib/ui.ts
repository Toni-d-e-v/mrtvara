import type { Team, PlayerTeam } from "@/lib/types";

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("hr-HR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("hr-HR", {
    day: "2-digit",
    month: "2-digit",
  });
}

// Team accent color (CSS variable based).
export function teamColor(team: Team | PlayerTeam): string {
  if (team === "SPID") return "var(--spid)";
  if (team === "BELO") return "var(--belo)";
  return "var(--muted)";
}

// Prikazana imena timova. Interne šifre ('SPID'/'BELO') ostaju stabilne u bazi;
// mijenja se samo ovaj mapping za prikaz kroz cijeli UI.
export const TEAM_LABEL: Record<Team, string> = {
  SPID: "LIQUI MOLY",
  BELO: "FORMULA",
};
