import { Shirt } from "lucide-react";
import type { Team } from "@/lib/types";

/**
 * Dvobojni "dres" indikator ekipe — jantar (SPID) ili bijela/čelik (BELO).
 * Zamjenjuje "S"/"B" krugove i točkice kroz cijelu aplikaciju.
 */
export default function KitChip({
  team,
  size = 20,
  className = "",
}: {
  team: Team;
  size?: number;
  className?: string;
}) {
  const fill = team === "SPID" ? "var(--spid)" : "var(--belo)";
  const stroke = team === "SPID" ? "var(--spid-shade)" : "var(--belo-shade)";

  return (
    <Shirt
      width={size}
      height={size}
      style={{ fill, color: stroke }}
      strokeWidth={1.5}
      className={className}
      aria-label={team}
    />
  );
}
