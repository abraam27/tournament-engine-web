"use client";

import { useQuery } from "@tanstack/react-query";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AutomaticQualifiersTable } from "@/features/qualifications/components/automatic-qualifiers-table";
import { BestThirdQualifiersTable } from "@/features/qualifications/components/best-third-qualifiers-table";
import { QualifiedTeamsSummary } from "@/features/qualifications/components/qualified-teams-summary";
import { QualificationSortingVisual } from "@/features/qualifications/components/qualification-sorting-visual";
import { ThirdPlaceRankingTable } from "@/features/qualifications/components/third-place-ranking-table";
import { getQualifiedTeams } from "@/features/qualifications/api/qualifications.api";
import { getThirdPlaceRanking } from "@/features/qualifications/api/qualifications.api";
import { TournamentSelector } from "@/features/tournaments/components/tournament-selector";
import { useSelectedTournament } from "@/features/tournaments/hooks/use-selected-tournament";

export function QualificationAdminPanel() {
  const {
    tournaments,
    selectedTournament,
    selectedTournamentId,
    setSelectedTournamentId,
    isLoading: tournamentsLoading,
  } = useSelectedTournament();

  const { data: qualified, isLoading: qualifiedLoading } = useQuery({
    queryKey: ["qualified-teams", selectedTournamentId],
    queryFn: () => getQualifiedTeams(selectedTournamentId!),
    enabled: !!selectedTournamentId,
  });

  const { data: thirdPlace, isLoading: thirdLoading } = useQuery({
    queryKey: ["third-place-ranking", selectedTournamentId],
    queryFn: () => getThirdPlaceRanking(selectedTournamentId!),
    enabled: !!selectedTournamentId,
  });

  if (tournamentsLoading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TournamentSelector
          tournaments={tournaments}
          value={selectedTournamentId}
          onChange={setSelectedTournamentId}
        />
      </div>

      <Alert>
        <AlertDescription>
          Qualification is calculated dynamically from standings. No manual
          generate action is required.
        </AlertDescription>
      </Alert>

      {!selectedTournament ? (
        <p className="text-sm text-muted-foreground">Select a tournament.</p>
      ) : (
        <>
          {qualifiedLoading ? (
            <p className="text-sm text-muted-foreground">Loading qualified teams...</p>
          ) : qualified ? (
            <>
              <QualifiedTeamsSummary data={qualified} />
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Automatic Qualifiers</CardTitle>
                </CardHeader>
                <CardContent>
                  <AutomaticQualifiersTable teams={qualified.automaticQualified} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Best Third-Place</CardTitle>
                </CardHeader>
                <CardContent>
                  <BestThirdQualifiersTable teams={qualified.bestThirdQualified} />
                </CardContent>
              </Card>
            </>
          ) : null}

          <QualificationSortingVisual />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Third-Place Ranking</CardTitle>
              <CardDescription>
                Ranking used to determine best third-place qualifiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {thirdLoading ? (
                <p className="text-sm text-muted-foreground">Loading ranking...</p>
              ) : (
                <ThirdPlaceRankingTable ranking={thirdPlace?.ranking ?? []} />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
