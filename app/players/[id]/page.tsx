import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Goal as GoalIcon } from "lucide-react";
import { getPlayerProfile } from "@/lib/queries";
import { computeBadges } from "@/lib/badges";
import { formatDate, TEAM_LABEL } from "@/lib/ui";
import Crest from "@/components/Crest";
import FormGuide from "@/components/FormGuide";
import RealtimeRefresher from "@/components/RealtimeRefresher";

export const dynamic = "force-dynamic";

function Tile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="card px-3 py-2.5 text-center">
      <div className="display text-2xl tabular-nums">{value}</div>
      <div className="eyebrow text-[10px] text-muted-2">{label}</div>
    </div>
  );
}

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getPlayerProfile(id);
  if (!profile) notFound();

  const { player, stats, goalLog, form, wins, draws, losses } = profile;
  const assigned = player.team === "SPID" || player.team === "BELO";
  const badges = computeBadges(profile);
  const g = stats?.goals ?? 0;
  const a = stats?.assists ?? 0;

  return (
    <div className="space-y-4">
      <RealtimeRefresher />

      <Link
        href="/players"
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} /> Igrači
      </Link>

      {/* Zaglavlje */}
      <section className="flex items-center gap-4 card p-4">
        {assigned ? (
          <Crest team={player.team as "SPID" | "BELO"} size={44} />
        ) : (
          <span className="h-11 w-11 rounded-full border border-border-strong" />
        )}
        <div className="min-w-0">
          <h1 className="display truncate text-[28px] leading-tight">{player.name}</h1>
          <div className="eyebrow text-[11px] text-muted-2">
            {assigned ? TEAM_LABEL[player.team as "SPID" | "BELO"] : "Neopredijeljen"}
          </div>
        </div>
      </section>

      {/* Značke */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <span
              key={b.key}
              className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent"
            >
              <b.Icon size={13} />
              {b.label}
            </span>
          ))}
        </div>
      )}

      {/* Statistika */}
      <div className="grid grid-cols-4 gap-2">
        <Tile label="Nastupi" value={stats?.appearances ?? 0} />
        <Tile label="Golovi" value={g} />
        <Tile label="Asist." value={a} />
        <Tile label="G+A" value={g + a} />
      </div>

      {/* Forma + omjer */}
      <section className="flex items-center justify-between card px-4 py-3">
        <div>
          <div className="eyebrow mb-1.5 text-[10px] text-muted-2">Forma</div>
          {form.length > 0 ? (
            <FormGuide results={form} size={18} />
          ) : (
            <span className="text-sm text-muted">—</span>
          )}
        </div>
        <div className="text-right">
          <div className="eyebrow mb-1 text-[10px] text-muted-2">P-N-I</div>
          <div className="text-[15px] tabular-nums">
            {wins}-{draws}-{losses}
          </div>
        </div>
      </section>

      {/* Log golova */}
      <section className="space-y-2">
        <h2 className="eyebrow px-0.5 text-xs text-muted">Golovi</h2>
        {goalLog.length === 0 ? (
          <p className="empty">
            Još nema golova.
          </p>
        ) : (
          <div className="card overflow-hidden">
            {goalLog.map((gl) => (
              <Link
                key={gl.id}
                href={`/matches/${gl.matchId}`}
                className="flex items-center gap-3 border-b border-border/60 px-3 py-2.5 last:border-0 transition-colors hover:bg-surface-2"
              >
                <GoalIcon
                  size={15}
                  style={{
                    color:
                      gl.team === "SPID" ? "var(--spid)" : "var(--belo)",
                  }}
                />
                <span className="flex-1 text-sm">
                  {gl.date ? formatDate(gl.date) : "—"}
                </span>
                <span className="text-[13px] tabular-nums text-muted-2">
                  {gl.minute != null ? `${gl.minute}'` : ""}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
