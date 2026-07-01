import { notFound } from "next/navigation";
import { getMatch } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";
import ScoreHeader from "@/components/ScoreHeader";
import MatchTabs from "@/components/MatchTabs";
import GoalTimeline from "@/components/GoalTimeline";
import PitchLineup from "@/components/PitchLineup";
import MatchStatsPanel from "@/components/MatchStatsPanel";
import GoalForm from "@/components/GoalForm";
import DeleteMatchButton from "@/components/DeleteMatchButton";
import RealtimeRefresher from "@/components/RealtimeRefresher";

export const dynamic = "force-dynamic";

export default async function MatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [detail, admin] = await Promise.all([getMatch(id), isAdmin()]);

  if (!detail) notFound();

  return (
    <div className="space-y-4">
      <RealtimeRefresher />

      <ScoreHeader
        date={detail.match.match_date}
        spidScore={detail.spidScore}
        beloScore={detail.beloScore}
      />

      {admin && (
        <GoalForm
          matchId={detail.match.id}
          spidLineup={detail.spidLineup}
          beloLineup={detail.beloLineup}
        />
      )}

      <MatchTabs
        tijek={<GoalTimeline goals={detail.goals} admin={admin} />}
        postave={
          <PitchLineup
            spid={detail.spidLineup}
            belo={detail.beloLineup}
            goals={detail.goals}
          />
        }
        statistika={
          <MatchStatsPanel
            goals={detail.goals}
            spidScore={detail.spidScore}
            beloScore={detail.beloScore}
          />
        }
      />

      {admin && <DeleteMatchButton id={detail.match.id} />}
    </div>
  );
}
