import { formatDate } from "@/lib/ui";

export default function ScoreHeader({
  date,
  spidScore,
  beloScore,
}: {
  date: string;
  spidScore: number;
  beloScore: number;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-4 text-center text-xs font-medium text-muted">
        {formatDate(date)}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-black"
            style={{ background: "var(--spid)", color: "#0b0e14" }}
          >
            S
          </div>
          <span className="font-bold text-spid">SPID</span>
        </div>

        <div className="font-mono text-4xl font-black tabular-nums">
          {spidScore}
          <span className="mx-2 text-muted">:</span>
          {beloScore}
        </div>

        <div className="flex flex-col items-center gap-2">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-black"
            style={{ background: "var(--belo)", color: "#0b0e14" }}
          >
            B
          </div>
          <span className="font-bold" style={{ color: "var(--belo)" }}>
            BELO
          </span>
        </div>
      </div>
    </section>
  );
}
