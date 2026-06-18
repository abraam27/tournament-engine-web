"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Medal } from "lucide-react";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getQualifiedTeams } from "@/features/qualifications/api/qualifications.api";
import { AutomaticQualifiersTable } from "@/features/qualifications/components/automatic-qualifiers-table";
import { BestThirdQualifiersTable } from "@/features/qualifications/components/best-third-qualifiers-table";
import { QualifiedTeamsSummary } from "@/features/qualifications/components/qualified-teams-summary";
import { TournamentSelector } from "@/features/tournaments/components/tournament-selector";
import { useSelectedTournament } from "@/features/tournaments/hooks/use-selected-tournament";
import { getTournamentById } from "@/features/tournaments/api/tournaments.api";
import { useMounted } from "@/lib/hooks/use-mounted";

export function QualifiedTeamsPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

type QualifiedTeamsPageContentProps = {
  tournamentId?: string;
  showBackLink?: boolean;
};

function QualifiedTeamsPageInner({
  tournamentId: routeTournamentId,
  showBackLink = false,
}: QualifiedTeamsPageContentProps) {
  const mounted = useMounted();
  const selected = useSelectedTournament();

  const tournamentId = routeTournamentId ?? selected.selectedTournamentId;
  const useSelector = !routeTournamentId;

  const tournamentQuery = useQuery({
    queryKey: ["tournament", tournamentId],
    queryFn: () => getTournamentById(tournamentId!),
    enabled: mounted && !!routeTournamentId,
  });

  const {
    data: qualification,
    isLoading: qualificationLoading,
    isError: qualificationError,
    error: qualificationErr,
    refetch: refetchQualification,
  } = useQuery({
    queryKey: ["qualified-teams", tournamentId],
    queryFn: () => getQualifiedTeams(tournamentId!),
    enabled: mounted && !!tournamentId,
  });

  const isLoadingTournaments = useSelector && selected.isLoading;
  const tournament =
    routeTournamentId && tournamentQuery.data
      ? tournamentQuery.data
      : selected.selectedTournament;

  if (!mounted || isLoadingTournaments || (routeTournamentId && tournamentQuery.isLoading)) {
    return <QualifiedTeamsPageSkeleton />;
  }

  if (useSelector && selected.isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <AlertCircle className="size-10 text-destructive" />
          <p className="font-medium">Failed to load tournaments</p>
          <Button onClick={() => selected.refetch()}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  if (!tournament || !tournamentId) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Qualified Teams
          </h2>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Medal className="size-10 text-muted-foreground" />
            <p className="font-medium">No tournaments available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {showBackLink && (
            <Button
              variant="ghost"
              size="sm"
              render={
                <Link href={`/tournaments/${tournamentId}`} />
              }
              nativeButton={false}
              className="mb-2 -ml-2"
            >
              <ArrowLeft className="size-4" />
              Tournament Details
            </Button>
          )}
          <h2 className="text-2xl font-semibold tracking-tight">
            Qualified Teams
          </h2>
          <p className="text-sm text-muted-foreground">
            {tournament.name} ({tournament.year})
          </p>
        </div>
        {useSelector && (
          <TournamentSelector
            tournaments={selected.tournaments}
            value={selected.selectedTournamentId}
            onChange={selected.setSelectedTournamentId}
          />
        )}
      </div>

      {qualificationLoading ? (
        <QualifiedTeamsPageSkeleton />
      ) : qualificationError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <AlertCircle className="size-10 text-destructive" />
            <div className="space-y-1">
              <p className="font-medium">Failed to load qualified teams</p>
              <p className="text-sm text-muted-foreground">
                {(qualificationErr as Error)?.message ??
                  "An unexpected error occurred."}
              </p>
            </div>
            <Button onClick={() => refetchQualification()}>Try again</Button>
          </CardContent>
        </Card>
      ) : !qualification ||
        (qualification.automaticQualified.length === 0 &&
          qualification.bestThirdQualified.length === 0) ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Medal className="size-10 text-muted-foreground" />
            <p className="font-medium">No qualification data yet</p>
            <p className="text-sm text-muted-foreground">
              Qualified teams will appear once group stage standings are final.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <QualifiedTeamsSummary data={qualification} />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Automatic Qualifiers</CardTitle>
              <CardDescription>
                Group winners and runners-up (A1, A2, B1, B2, …)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AutomaticQualifiersTable
                teams={qualification.automaticQualified}
              />
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Best Third-Place Qualifiers
              </CardTitle>
              <CardDescription>
                Top third-place teams across all groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BestThirdQualifiersTable
                teams={qualification.bestThirdQualified}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export function QualifiedTeamsPageContent(
  props: QualifiedTeamsPageContentProps,
) {
  return (
    <Suspense fallback={<QualifiedTeamsPageSkeleton />}>
      <QualifiedTeamsPageInner {...props} />
    </Suspense>
  );
}
