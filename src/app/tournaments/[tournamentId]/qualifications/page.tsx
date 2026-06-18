import { QualifiedTeamsPageContent } from "@/features/qualifications/components/qualified-teams-page-content";

type TournamentQualificationsPageProps = {
  params: Promise<{ tournamentId: string }>;
};

export default async function TournamentQualificationsPage({
  params,
}: TournamentQualificationsPageProps) {
  const { tournamentId } = await params;

  return (
    <QualifiedTeamsPageContent
      tournamentId={tournamentId}
      showBackLink
    />
  );
}
