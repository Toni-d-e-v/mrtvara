import { Flame } from "lucide-react";
import type { TeamForm } from "@/lib/stats";

/** Prikazuje samo niz pobjeda (2+) — bragging rights. */
export default function StreakBadge({
  streak,
}: {
  streak: TeamForm["streak"];
}) {
  if (!streak || streak.type !== "W" || streak.count < 2) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
      <Flame size={12} />
      {streak.count} u nizu
    </span>
  );
}
