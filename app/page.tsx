import Link from "next/link";
import { Plus } from "lucide-react";
import { getMatches } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";
import MatchCard from "@/components/MatchCard";
import RivalryHeader from "@/components/RivalryHeader";
import RealtimeRefresher from "@/components/RealtimeRefresher";

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
    <div className="space-y-5">
      <RealtimeRefresher />

      <RivalryHeader
        total={matches.length}
        spidWins={spidWins}
        beloWins={beloWins}
        draws={draws}
        spidGoals={spidGoals}
        beloGoals={beloGoals}
      />

      {admin && (
        <Link
          href="/matches/new"
          className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 font-semibold text-[color:var(--on-accent)] transition-opacity active:opacity-80"
        >
          <Plus size={18} strokeWidth={2.5} />
          Nova utakmica
        </Link>
      )}

      <section className="space-y-2.5">
        <h2 className="eyebrow px-0.5 text-xs text-muted">Povijest</h2>
        {matches.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted">
            Još nema odigranih utakmica.
            {admin && " Klikni „Nova utakmica” da dodaš prvu."}
          </p>
        ) : (
          matches.map((m) => <MatchCard key={m.id} match={m} />)
        )}
      </section>
    </div>
  );
}
