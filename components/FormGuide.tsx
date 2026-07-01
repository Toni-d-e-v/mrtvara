import type { Result } from "@/lib/stats";

const STYLE: Record<Result, { bg: string; fg: string }> = {
  W: { bg: "var(--win)", fg: "var(--on-accent)" },
  D: { bg: "var(--surface-2)", fg: "var(--muted)" },
  L: { bg: "var(--loss)", fg: "#fff" },
};

const LABEL: Record<Result, string> = { W: "P", D: "N", L: "I" };

export default function FormGuide({
  results,
  size = 18,
}: {
  results: Result[];
  size?: number;
}) {
  if (results.length === 0) return null;
  return (
    <div className="flex items-center gap-1">
      {results.map((r, i) => (
        <span
          key={i}
          className="grid place-items-center rounded-full font-mono font-bold"
          style={{
            width: size,
            height: size,
            fontSize: size * 0.5,
            background: STYLE[r].bg,
            color: STYLE[r].fg,
          }}
        >
          {LABEL[r]}
        </span>
      ))}
    </div>
  );
}
