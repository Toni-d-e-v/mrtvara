import { formatDate, TEAM_LABEL } from "@/lib/ui";
import Crest from "@/components/Crest";
import AnimatedScore from "@/components/AnimatedScore";

export default function ScoreHeader({
  date,
  spidScore,
  beloScore,
}: {
  date: string;
  spidScore: number;
  beloScore: number;
}) {
  const result =
    spidScore > beloScore
      ? `Pobjeda ${TEAM_LABEL.SPID}`
      : beloScore > spidScore
        ? `Pobjeda ${TEAM_LABEL.BELO}`
        : "Neriješeno";

  return (
    <section className="relative card overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "linear-gradient(115deg, var(--spid) 0%, transparent 42%, transparent 58%, var(--belo) 100%)",
        }}
      />

      <div className="relative px-5 py-5">
        <div className="mb-4 text-center text-[13px] tabular-nums text-muted-2">
          {formatDate(date)}
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex flex-col items-center gap-2">
            <Crest team="SPID" size={46} className="pop-in" />
            <span className="eyebrow text-center text-xs text-spid">
              {TEAM_LABEL.SPID}
            </span>
          </div>

          <div className="display flex items-baseline gap-2 text-5xl">
            <AnimatedScore value={spidScore} />
            <span className="text-2xl text-muted-2">:</span>
            <AnimatedScore value={beloScore} />
          </div>

          <div className="flex flex-col items-center gap-2">
            <Crest team="BELO" size={46} className="pop-in" />
            <span
              className="eyebrow text-center text-xs"
              style={{ color: "var(--belo)" }}
            >
              {TEAM_LABEL.BELO}
            </span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <span className="eyebrow rounded-full border border-border bg-background/40 px-3 py-1 text-[11px] text-muted">
            {result}
          </span>
        </div>
      </div>
    </section>
  );
}
