"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Team } from "@/lib/types";

// ---------- Auth ----------

export async function signIn(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: "Pogrešan email ili lozinka." };

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

// ---------- Players ----------

export async function addPlayer(
  formData: FormData,
): Promise<{ error?: string }> {
  const name = String(formData.get("name") ?? "").trim();
  const team = String(formData.get("team") ?? "UNASSIGNED") as
    | Team
    | "UNASSIGNED";
  if (!name) return { error: "Upiši ime igrača." };

  const supabase = await createClient();
  const { error } = await supabase.from("players").insert({ name, team });

  if (error) {
    // 23505 = unique violation, 42501 = RLS ne dopušta upis
    if (error.code === "23505") return { error: `„${name}” već postoji.` };
    if (error.code === "42501")
      return { error: "Nemaš admin prava — prijavi se ponovno." };
    return { error: error.message };
  }

  revalidatePath("/players");
  revalidatePath("/stats");
  return {};
}

export async function updatePlayerTeam(
  id: string,
  team: Team | "UNASSIGNED",
): Promise<void> {
  const supabase = await createClient();
  await supabase.from("players").update({ team }).eq("id", id);
  revalidatePath("/players");
  revalidatePath("/stats");
}

export async function updatePlayerName(
  id: string,
  name: string,
): Promise<{ error?: string }> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Ime ne može biti prazno." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("players")
    .update({ name: trimmed })
    .eq("id", id);
  if (error) return { error: "Ime već postoji ili je neispravno." };
  revalidatePath("/players");
  revalidatePath("/stats");
  return {};
}

export async function deletePlayer(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("players").delete().eq("id", id);
  revalidatePath("/players");
  revalidatePath("/stats");
}

// ---------- Matches ----------

export async function createMatch(input: {
  matchDate: string;
  spidIds: string[];
  beloIds: string[];
  spidGkId?: string | null;
  beloGkId?: string | null;
}): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient();

  const { data: match, error } = await supabase
    .from("matches")
    .insert({ match_date: input.matchDate })
    .select("id")
    .single();

  if (error || !match) return { error: "Greška pri kreiranju utakmice." };

  // Vratar dobiva slot 0, ostali 1..n (redom). 4+1 raspored na terenu.
  const build = (ids: string[], team: "SPID" | "BELO", gk?: string | null) => {
    const ordered = [
      ...ids.filter((id) => id === gk),
      ...ids.filter((id) => id !== gk),
    ];
    return ordered.map((player_id, i) => ({
      match_id: match.id,
      player_id,
      team,
      slot: i,
    }));
  };

  const lineups = [
    ...build(input.spidIds, "SPID", input.spidGkId),
    ...build(input.beloIds, "BELO", input.beloGkId),
  ];

  if (lineups.length > 0) {
    const { error: lineupError } = await supabase
      .from("match_lineups")
      .insert(lineups);
    if (lineupError) return { error: "Greška pri spremanju postava." };
  }

  revalidatePath("/");
  return { id: match.id };
}

export async function deleteMatch(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("matches").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/stats");
}

// ---------- Goals ----------

export async function addGoal(input: {
  matchId: string;
  team: Team;
  scorerId: string | null;
  assistId: string | null;
  minute: number | null;
}): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("goals").insert({
    match_id: input.matchId,
    team: input.team,
    scorer_id: input.scorerId,
    assist_id: input.assistId,
    minute: input.minute,
  });
  if (error) return { error: "Greška pri unosu gola." };

  revalidatePath(`/matches/${input.matchId}`);
  revalidatePath("/");
  revalidatePath("/stats");
  return {};
}

export async function deleteGoal(id: string, matchId: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("goals").delete().eq("id", id);
  revalidatePath(`/matches/${matchId}`);
  revalidatePath("/");
  revalidatePath("/stats");
}
