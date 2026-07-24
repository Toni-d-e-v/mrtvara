import Link from "next/link";
import { Plus } from "lucide-react";
import { getMatches } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";
import MatchCard from "@/components/MatchCard";
import RivalryHeader from "@/components/RivalryHeader";
import RealtimeRefresher from "@/components/RealtimeRefresher";
import { teamForm } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [matches, admin] = await Promise.all([getMatches(), isAdmin()]);

  let spidWins = 0;
  let beloWins = 0;
  let draws = 0;
  let spidGoals = 0;
  let beloGoals = 0;
  for (const m of matches) {
    spidGoals += m.spid_score;
    beloGoals += m.belo_score;
    if (m.spid_score > m.belo_score) spidWins++;
    else if (m.belo_score > m.spid_score) beloWins++;
    else draws++;
  }

  return (
    <div className="space-y-4">
      <RealtimeRefresher />

      <RivalryHeader
        total={matches.length}
        spidWins={spidWins}
        beloWins={beloWins}
        draws={draws}
        spidGoals={spidGoals}
        beloGoals={beloGoals}
        spidForm={teamForm(matches, "SPID")}
        beloForm={teamForm(matches, "BELO")}
      />

      {admin && (
        <Link
          href="/matches/new"
          className="btn transition-opacity active:opacity-80"
        >
          <Plus size={18} strokeWidth={2.5} />
          Nova utakmica
        </Link>
      )}

      <section className="space-y-2.5">
        <h2 className="eyebrow px-1 text-[11px] text-muted-2">Povijest</h2>
        {matches.length === 0 ? (
          <p className="empty">
            Još nema odigranih utakmica.
            {admin && " Klikni „Nova utakmica” da dodaš prvu."}
          </p>
        ) : (
          matches.map((m, i) => (
            <div
              key={m.id}
              className="rise-in"
              style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
            >
              <MatchCard match={m} />
            </div>
          ))
        )}
      </section>
    </div>
  );
}
