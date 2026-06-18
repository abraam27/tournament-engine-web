import { TeamDetailsPageContent } from "@/features/teams/components/team-details-page-content";

type TeamDetailsPageProps = {
  params: Promise<{ teamId: string }>;
};

export default async function TeamDetailsPage({ params }: TeamDetailsPageProps) {
  const { teamId } = await params;

  return <TeamDetailsPageContent teamId={teamId} />;
}
