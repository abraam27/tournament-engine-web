"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Grid3X3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getGroups } from "@/features/groups/api/groups.api";
import { GroupsGrid } from "@/features/groups/components/groups-grid";
import { TournamentSelector } from "@/features/tournaments/components/tournament-selector";
import { useSelectedTournament } from "@/features/tournaments/hooks/use-selected-tournament";

export function GroupsPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-40 w-full" />
        ))}
      </div>
    </div>
  );
}

export function GroupsPageContent() {
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
    data: groups = [],
    isLoading: groupsLoading,
    isError: groupsError,
    error: groupsErr,
    refetch: refetchGroups,
  } = useQuery({
    queryKey: ["groups", selectedTournamentId],
    queryFn: () => getGroups({ tournamentId: selectedTournamentId! }),
    enabled: !!selectedTournamentId,
  });

  if (tournamentsLoading) {
    return <GroupsPageSkeleton />;
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
          <h2 className="text-2xl font-semibold tracking-tight">Groups</h2>
          <p className="text-sm text-muted-foreground">
            View group assignments and stage structure
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Grid3X3 className="size-10 text-muted-foreground" />
            <p className="font-medium">No tournaments available</p>
            <p className="text-sm text-muted-foreground">
              Create a tournament in the backend to view groups.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Groups</h2>
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

      {groupsLoading ? (
        <GroupsPageSkeleton />
      ) : groupsError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <AlertCircle className="size-10 text-destructive" />
            <div className="space-y-1">
              <p className="font-medium">Failed to load groups</p>
              <p className="text-sm text-muted-foreground">
                {(groupsErr as Error)?.message ??
                  "An unexpected error occurred."}
              </p>
            </div>
            <Button onClick={() => refetchGroups()}>Try again</Button>
          </CardContent>
        </Card>
      ) : groups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Grid3X3 className="size-10 text-muted-foreground" />
            <p className="font-medium">No groups found</p>
            <p className="text-sm text-muted-foreground">
              Groups will appear once the tournament draw is created.
            </p>
          </CardContent>
        </Card>
      ) : (
        <GroupsGrid groups={groups} tournamentId={selectedTournament._id} />
      )}
    </div>
  );
}
