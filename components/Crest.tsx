import type { Team } from "@/lib/types";
import { TEAM_LABEL } from "@/lib/ui";

/**
 * Klupski grb (SVG štit) sa službenim logom ekipe.
 * LIQUI MOLY — plavi štit s chevronom i logom.
 * FORMULA — crveni štit s trkaćim prugama i „F" znakom.
 */
const LOGO: Record<Team, { src: string; w: number; h: number }> = {
  SPID: { src: "/logos/liqui-moly.png", w: 74, h: 48 },
  BELO: { src: "/logos/formula-mark.png", w: 56, h: 56 },
};

export default function Crest({
  team,
  size = 48,
  className = "",
}: {
  team: Team;
  size?: number;
  className?: string;
}) {
  const isSpid = team === "SPID";
  const base = isSpid ? "var(--spid)" : "var(--belo)";
  const shade = isSpid ? "var(--spid-shade)" : "var(--belo-shade)";
  const gid = `crest-${team}`;
  const logo = LOGO[team];

  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 100 120"
      className={className}
      aria-label={TEAM_LABEL[team]}
      role="img"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={base} />
          <stop offset="1" stopColor={shade} />
        </linearGradient>
        <clipPath id={`${gid}-clip`}>
          <path d="M50 4 L94 20 V62 C94 90 74 110 50 116 C26 110 6 90 6 62 V20 Z" />
        </clipPath>
      </defs>

      {/* Štit */}
      <path
        d="M50 4 L94 20 V62 C94 90 74 110 50 116 C26 110 6 90 6 62 V20 Z"
        fill={`url(#${gid})`}
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="2.5"
      />

      {/* Motiv po ekipi */}
      <g clipPath={`url(#${gid}-clip)`}>
        {isSpid ? (
          <path
            d="M6 44 L50 62 L94 44 V56 L50 74 L6 56 Z"
            fill="rgba(255,255,255,0.16)"
          />
        ) : (
          <>
            <rect
              x="-30"
              y="18"
              width="14"
              height="150"
              transform="rotate(28 50 60)"
              fill="rgba(255,255,255,0.16)"
            />
            <rect
              x="0"
              y="18"
              width="14"
              height="150"
              transform="rotate(28 50 60)"
              fill="rgba(255,255,255,0.12)"
            />
          </>
        )}
      </g>

      {/* Službeni logo */}
      <image
        href={logo.src}
        x={(100 - logo.w) / 2}
        y={56 - logo.h / 2}
        width={logo.w}
        height={logo.h}
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}
