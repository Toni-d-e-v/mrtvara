import KitChip from "@/components/KitChip";
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
    <section className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="eyebrow text-[11px] text-muted">Vječiti derbi</span>
        <span className="font-mono text-[11px] text-muted-2">
          {total} utakmica
        </span>
      </div>

      <div className="grid grid-cols-3 items-end gap-2 px-4 pt-4">
        <div className="flex flex-col items-center gap-1.5">
          <KitChip team="SPID" size={30} />
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
          <KitChip team="BELO" size={30} />
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
        <div className="mt-1.5 text-center font-mono text-[11px] text-muted-2">
          {draws} neriješeno
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-border">
        <div className="flex items-center justify-center gap-2 border-r border-border py-2.5">
          <span className="font-mono text-lg font-semibold tabular-nums text-spid">
            {spidGoals}
          </span>
          <span className="text-[11px] text-muted">golova</span>
        </div>
        <div className="flex items-center justify-center gap-2 py-2.5">
          <span className="text-[11px] text-muted">golova</span>
          <span
            className="font-mono text-lg font-semibold tabular-nums"
            style={{ color: "var(--belo)" }}
          >
            {beloGoals}
          </span>
        </div>
      </div>
    </section>
  );
}
