import { notFound } from "next/navigation";
import { getMatch } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";
import ScoreHeader from "@/components/ScoreHeader";
import GoalTimeline from "@/components/GoalTimeline";
import LineupFaceoff from "@/components/LineupFaceoff";
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

      <GoalTimeline goals={detail.goals} admin={admin} />

      <LineupFaceoff
        spid={detail.spidLineup}
        belo={detail.beloLineup}
        goals={detail.goals}
      />

      {admin && <DeleteMatchButton id={detail.match.id} />}
    </div>
  );
}
