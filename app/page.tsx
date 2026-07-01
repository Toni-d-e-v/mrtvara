import Link from "next/link";
import { getMatches } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";
import MatchCard from "@/components/MatchCard";
import RealtimeRefresher from "@/components/RealtimeRefresher";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [matches, admin] = await Promise.all([getMatches(), isAdmin()]);

  let spidWins = 0;
  let beloWins = 0;
  let draws = 0;
  for (const m of matches) {
    if (m.spid_score > m.belo_score) spidWins++;
    else if (m.belo_score > m.spid_score) beloWins++;
    else draws++;
  }

  return (
    <div className="space-y-4">
      <RealtimeRefresher />

      {/* Head-to-head */}
      <section className="rounded-2xl border border-border bg-surface p-4">
        <h2 className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted">
          Međusobno ({matches.length} utakmica)
        </h2>
        <div className="grid grid-cols-3 items-center text-center">
          <div>
            <div className="text-2xl font-extrabold text-spid">{spidWins}</div>
            <div className="text-xs text-muted">SPID</div>
          </div>
          <div className="text-sm text-muted">
            <div className="text-lg font-bold text-foreground">{draws}</div>
            neriješeno
          </div>
          <div>
            <div
              className="text-2xl font-extrabold"
              style={{ color: "var(--belo)" }}
            >
              {beloWins}
            </div>
            <div className="text-xs text-muted">BELO</div>
          </div>
        </div>
      </section>

      {admin && (
        <Link
          href="/matches/new"
          className="block rounded-xl bg-accent px-4 py-3 text-center font-bold text-black"
        >
          + Nova utakmica
        </Link>
      )}

      <section className="space-y-2.5">
        <h2 className="px-1 text-sm font-semibold text-muted">Povijest</h2>
        {matches.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
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
