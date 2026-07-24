import TeamLogo from "@/components/TeamLogo";
import FormGuide from "@/components/FormGuide";
import StreakBadge from "@/components/StreakBadge";
import { TEAM_LABEL } from "@/lib/ui";
import type { TeamForm } from "@/lib/stats";

export default function RivalryHeader({
  total,
  spidWins,
  beloWins,
  draws,
  spidGoals,
  beloGoals,
  spidForm,
  beloForm,
}: {
  total: number;
  spidWins: number;
  beloWins: number;
  draws: number;
  spidGoals: number;
  beloGoals: number;
  spidForm: TeamForm;
  beloForm: TeamForm;
}) {
  const decided = spidWins + beloWins + draws || 1;
  const spidPct = (spidWins / decided) * 100;
  const drawPct = (draws / decided) * 100;
  const beloPct = (beloWins / decided) * 100;

  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="eyebrow text-[11px] text-muted">Vječiti derbi</span>
        <span className="text-[13px] tabular-nums text-muted-2">
          {total} utakmica
        </span>
      </div>

      <div className="grid grid-cols-3 items-end gap-2 px-4 pt-4">
        <div className="flex flex-col items-center gap-1.5">
          <TeamLogo team="SPID" width={68} priority />
          <span className="eyebrow text-center text-[11px] text-spid">
            {TEAM_LABEL.SPID}
          </span>
        </div>
        <div className="flex items-baseline justify-center gap-2">
          <span className="display text-4xl text-spid tabular-nums">{spidWins}</span>
          <span className="display text-lg text-muted-2">:</span>
          <span
            className="display text-4xl tabular-nums"
            style={{ color: "var(--belo)" }}
          >
            {beloWins}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <TeamLogo team="BELO" width={68} priority />
          <span className="eyebrow text-center text-[11px]" style={{ color: "var(--belo)" }}>
            {TEAM_LABEL.BELO}
          </span>
        </div>
      </div>

      {/* Forma + niz */}
      <div className="flex items-center justify-between gap-2 px-4 pt-3">
        <div className="flex flex-col items-start gap-1">
          <FormGuide results={spidForm.last5} size={16} />
          <StreakBadge streak={spidForm.streak} />
        </div>
        <div className="flex flex-col items-end gap-1">
          <FormGuide results={beloForm.last5} size={16} />
          <StreakBadge streak={beloForm.streak} />
        </div>
      </div>

      <div className="px-4 pb-1 pt-3">
        <div className="flex h-2 overflow-hidden rounded-full bg-surface-2">
          <span style={{ width: `${spidPct}%`, background: "var(--spid)" }} />
          <span style={{ width: `${drawPct}%`, background: "var(--muted-2)" }} />
          <span style={{ width: `${beloPct}%`, background: "var(--belo)" }} />
        </div>
        <div className="mt-1.5 text-center text-[12px] tabular-nums text-muted-2">
          {draws} neriješeno
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-border">
        <div className="flex items-center justify-center gap-2 border-r border-border py-2.5">
          <span className="display text-lg text-spid">
            {spidGoals}
          </span>
          <span className="text-[11px] text-muted">golova</span>
        </div>
        <div className="flex items-center justify-center gap-2 py-2.5">
          <span className="text-[11px] text-muted">golova</span>
          <span
            className="display text-lg"
            style={{ color: "var(--belo)" }}
          >
            {beloGoals}
          </span>
        </div>
      </div>
    </section>
  );
}
