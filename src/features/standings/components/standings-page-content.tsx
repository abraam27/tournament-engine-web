"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getTournamentStandings } from "@/features/standings/api/standings.api";
import { TournamentStandingsGrid } from "@/features/standings/components/tournament-standings-grid";
import { TournamentSelector } from "@/features/tournaments/components/tournament-selector";
import { useSelectedTournament } from "@/features/tournaments/hooks/use-selected-tournament";

export function StandingsPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-64 w-full" />
        ))}
      </div>
    </div>
  );
}

export function StandingsPageContent() {
  const {
    tournaments,
    selectedTournament,
    selectedTournamentId,
    setSelectedTournamentId,
    isLoading: tournamentsLoading,
    isError: tournamentsError,
    error: tournamentsErr,
    refetch: refetchTournaments,
  } = useSelectedTournament();

  const {
    data: standings,
    isLoading: standingsLoading,
    isError: standingsError,
    error: standingsErr,
    refetch: refetchStandings,
  } = useQuery({
    queryKey: ["tournament-standings", selectedTournamentId],
    queryFn: () => getTournamentStandings(selectedTournamentId!),
    enabled: !!selectedTournamentId,
  });

  if (tournamentsLoading) {
    return <StandingsPageSkeleton />;
  }

  if (tournamentsError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <AlertCircle className="size-10 text-destructive" />
          <div className="space-y-1">
            <p className="font-medium">Failed to load tournaments</p>
            <p className="text-sm text-muted-foreground">
              {(tournamentsErr as Error)?.message ??
                "An unexpected error occurred."}
            </p>
          </div>
          <Button onClick={() => refetchTournaments()}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  if (!selectedTournament) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Standings</h2>
          <p className="text-sm text-muted-foreground">
            Monitor group tables and qualification status
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <BarChart3 className="size-10 text-muted-foreground" />
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
          <h2 className="text-2xl font-semibold tracking-tight">Standings</h2>
          <p className="text-sm text-muted-foreground">
            {selectedTournament.name} ({selectedTournament.year})
          </p>
        </div>
        <TournamentSelector
          tournaments={tournaments}
          value={selectedTournamentId}
          onChange={setSelectedTournamentId}
        />
      </div>

      {standingsLoading ? (
        <StandingsPageSkeleton />
      ) : standingsError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <AlertCircle className="size-10 text-destructive" />
            <div className="space-y-1">
              <p className="font-medium">Failed to load standings</p>
              <p className="text-sm text-muted-foreground">
                {(standingsErr as Error)?.message ??
                  "An unexpected error occurred."}
              </p>
            </div>
            <Button onClick={() => refetchStandings()}>Try again</Button>
          </CardContent>
        </Card>
      ) : !standings?.groups.length ? (
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
        <TournamentStandingsGrid groups={standings.groups} />
      )}
    </div>
  );
}
