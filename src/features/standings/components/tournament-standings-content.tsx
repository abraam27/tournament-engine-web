"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getTournamentStandings } from "@/features/standings/api/standings.api";
import { TournamentStandingsGrid } from "@/features/standings/components/tournament-standings-grid";
import { getTournamentById } from "@/features/tournaments/api/tournaments.api";
import { useMounted } from "@/lib/hooks/use-mounted";

type TournamentStandingsContentProps = {
  tournamentId: string;
};

function TournamentStandingsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-64 w-full" />
        ))}
      </div>
    </div>
  );
}

export function TournamentStandingsContent({
  tournamentId,
}: TournamentStandingsContentProps) {
  const mounted = useMounted();

  const tournamentQuery = useQuery({
    queryKey: ["tournament", tournamentId],
    queryFn: () => getTournamentById(tournamentId),
    enabled: mounted,
  });

  const standingsQuery = useQuery({
    queryKey: ["tournament-standings", tournamentId],
    queryFn: () => getTournamentStandings(tournamentId),
    enabled: mounted && !!tournamentQuery.data,
  });

  if (!mounted || tournamentQuery.isLoading) {
    return <TournamentStandingsSkeleton />;
  }

  if (tournamentQuery.isError || standingsQuery.isError) {
    const error = tournamentQuery.error ?? standingsQuery.error;
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <AlertCircle className="size-10 text-destructive" />
          <div className="space-y-1">
            <p className="font-medium">Failed to load standings</p>
            <p className="text-sm text-muted-foreground">
              {(error as Error)?.message ?? "An unexpected error occurred."}
            </p>
          </div>
          <Button
            onClick={() => {
              tournamentQuery.refetch();
              standingsQuery.refetch();
            }}
          >
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const tournament = tournamentQuery.data;

  if (!tournament) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-semibold">Tournament not found</h2>
        <Button render={<Link href="/" />} nativeButton={false}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          render={<Link href={`/tournaments/${tournamentId}`} />}
          nativeButton={false}
          className="mb-2 -ml-2"
        >
          <ArrowLeft className="size-4" />
          Tournament Details
        </Button>
        <h2 className="text-2xl font-semibold tracking-tight">Standings</h2>
        <p className="text-sm text-muted-foreground">
          {tournament.name} ({tournament.year})
        </p>
      </div>

      {standingsQuery.isLoading ? (
        <TournamentStandingsSkeleton />
      ) : !standingsQuery.data?.groups.length ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <BarChart3 className="size-10 text-muted-foreground" />
            <p className="font-medium">No standings yet</p>
            <p className="text-sm text-muted-foreground">
              Standings will appear once group matches are played.
            </p>
          </CardContent>
        </Card>
      ) : (
        <TournamentStandingsGrid groups={standingsQuery.data.groups} />
      )}
    </div>
  );
}
