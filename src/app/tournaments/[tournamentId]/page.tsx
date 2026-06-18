import { TournamentDetailsContent } from "@/features/tournaments/components/tournament-details-content";

type TournamentDetailsPageProps = {
  params: Promise<{ tournamentId: string }>;
};

export default async function TournamentDetailsPage({
  params,
}: TournamentDetailsPageProps) {
  const { tournamentId } = await params;

  return <TournamentDetailsContent tournamentId={tournamentId} />;
}
