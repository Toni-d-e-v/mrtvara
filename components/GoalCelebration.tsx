"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { createClient } from "@/lib/supabase/client";
import { playGoalSound } from "@/lib/sound";
import type { Team } from "@/lib/types";

const TEAM_HEX: Record<Team, string[]> = {
  SPID: ["#2f6bff", "#7aa8ff", "#ffffff"],
  BELO: ["#e23744", "#ff7a84", "#ffffff"],
};

export default function GoalCelebration({ matchId }: { matchId: string }) {
  const router = useRouter();
  const [burst, setBurst] = useState<{ team: Team; key: number } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    function celebrate(team: Team) {
      playGoalSound();
      setBurst({ team, key: performance.now() });
      window.setTimeout(() => setBurst(null), 1700);
      if (reduced) return;
      const colors = TEAM_HEX[team];
      const base = {
        spread: 75,
        startVelocity: 45,
        ticks: 220,
        colors,
        zIndex: 90,
      };
      confetti({ ...base, particleCount: 70, origin: { x: 0, y: 0.9 }, angle: 60 });
      confetti({ ...base, particleCount: 70, origin: { x: 1, y: 0.9 }, angle: 120 });
    }

    const channel = supabase.channel(`match-celebrate-${matchId}`);
    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "goals",
        filter: `match_id=eq.${matchId}`,
      },
      (payload) => {
        const team = (payload.new as { team: Team }).team;
        celebrate(team);
        router.refresh();
      },
    );
    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "goals",
        filter: `match_id=eq.${matchId}`,
      },
      () => router.refresh(),
    );
    channel.on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "goals" },
      () => router.refresh(),
    );
    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "match_lineups",
        filter: `match_id=eq.${matchId}`,
      },
      () => router.refresh(),
    );
    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, router]);

  if (!burst) return null;
  const hex = burst.team === "SPID" ? "#2f6bff" : "#e23744";

  return (
    <div
      key={burst.key}
      className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 58%, ${hex}, transparent 70%)`,
          animation: "flash-pulse 1.6s ease-out forwards",
        }}
      />
      <span
        className="display text-white"
        style={{
          fontSize: "clamp(3rem, 18vw, 7rem)",
          textShadow: "0 4px 30px rgba(0,0,0,0.55)",
          animation: "goal-word 1.6s ease-out forwards",
        }}
      >
        GOL!
      </span>
    </div>
  );
}
