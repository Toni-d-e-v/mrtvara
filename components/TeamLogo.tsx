import Image from "next/image";
import type { Team } from "@/lib/types";
import { TEAM_LABEL } from "@/lib/ui";

/**
 * Službeni logo ekipe (LIQUI MOLY / FORMULA).
 * `width` je u px; visina se računa iz originalnog omjera slike.
 */
const LOGO: Record<Team, { src: string; w: number; h: number }> = {
  SPID: { src: "/logos/liqui-moly.png", w: 539, h: 348 },
  BELO: { src: "/logos/formula.png", w: 296, h: 177 },
};

export default function TeamLogo({
  team,
  width = 72,
  className = "",
  priority = false,
}: {
  team: Team;
  width?: number;
  className?: string;
  priority?: boolean;
}) {
  const { src, w, h } = LOGO[team];

  return (
    <Image
      src={src}
      alt={TEAM_LABEL[team]}
      width={width}
      height={Math.round((width * h) / w)}
      priority={priority}
      className={`rounded-[3px] ring-1 ring-white/10 ${className}`}
    />
  );
}
