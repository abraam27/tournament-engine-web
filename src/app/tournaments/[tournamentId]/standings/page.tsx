import { TournamentStandingsContent } from "@/features/standings/components/tournament-standings-content";

type TournamentStandingsPageProps = {
  params: Promise<{ tournamentId: string }>;
};

export default async function TournamentStandingsPage({
  params,
}: TournamentStandingsPageProps) {
  const { tournamentId } = await params;

  return <TournamentStandingsContent tournamentId={tournamentId} />;
}
