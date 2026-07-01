import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMatch } from "@/lib/queries";
import { formatDate, TEAM_LABEL } from "@/lib/ui";
import { isAdmin } from "@/lib/auth";
import ScoreHeader from "@/components/ScoreHeader";
import MatchTabs from "@/components/MatchTabs";
import GoalTimeline from "@/components/GoalTimeline";
import PitchLineup from "@/components/PitchLineup";
import MatchStatsPanel from "@/components/MatchStatsPanel";
import GoalForm from "@/components/GoalForm";
import DeleteMatchButton from "@/components/DeleteMatchButton";
import GoalCelebration from "@/components/GoalCelebration";
import MvpBadge from "@/components/MvpBadge";
import { matchMvp } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const detail = await getMatch(id);
  if (!detail) return { title: "Utakmica — Mrtvara Liga" };
  const title = `${TEAM_LABEL.SPID} ${detail.spidScore} : ${detail.beloScore} ${TEAM_LABEL.BELO}`;
  const description = `Mrtvara Liga — ${formatDate(detail.match.match_date)}`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [detail, admin] = await Promise.all([getMatch(id), isAdmin()]);

  if (!detail) notFound();

  const mvp = matchMvp(detail.goals);

  return (
    <div className="space-y-4">
      <GoalCelebration matchId={detail.match.id} />

      <ScoreHeader
        date={detail.match.match_date}
        spidScore={detail.spidScore}
        beloScore={detail.beloScore}
      />

      {mvp && <MvpBadge mvp={mvp} />}

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
