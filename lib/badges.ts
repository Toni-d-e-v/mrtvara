import {
  Goal,
  Footprints,
  Zap,
  ShieldCheck,
  Award,
  Flame,
  type LucideIcon,
} from "lucide-react";
import type { PlayerProfile } from "@/lib/queries";

export interface Badge {
  key: string;
  label: string;
  Icon: LucideIcon;
}

export function computeBadges(p: PlayerProfile): Badge[] {
  const b: Badge[] = [];
  const games = p.stats?.appearances ?? 0;

  if (p.isTopScorer) b.push({ key: "golgeter", label: "Golgeter lige", Icon: Goal });
  if (p.isTopAssister)
    b.push({ key: "playmaker", label: "Playmaker", Icon: Footprints });
  if (p.maxGoalsInMatch >= 3)
    b.push({ key: "hattrick", label: "Hat-trick", Icon: Zap });
  if (games >= 3 && p.losses === 0 && p.wins > 0)
    b.push({ key: "nepobjediv", label: "Nepobjediv", Icon: ShieldCheck });
  if (p.wins >= 5) b.push({ key: "serijski", label: "Serijski pobjednik", Icon: Flame });
  if (games >= 10) b.push({ key: "veteran", label: "Veteran", Icon: Award });

  return b;
}
