import { MatchDetailsContent } from "@/features/matches/components/match-details-content";

type MatchDetailsPageProps = {
  params: Promise<{ matchId: string }>;
};

export default async function MatchDetailsPage({
  params,
}: MatchDetailsPageProps) {
  const { matchId } = await params;

  return <MatchDetailsContent matchId={matchId} />;
}
