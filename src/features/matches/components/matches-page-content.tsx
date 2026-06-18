"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Swords } from "lucide-react";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getGroups } from "@/features/groups/api/groups.api";
import { getMatches } from "@/features/matches/api/matches.api";
import { MatchesFilters } from "@/features/matches/components/matches-filters";
import { MatchesTable } from "@/features/matches/components/matches-table";
import { useMatchFilters } from "@/features/matches/hooks/use-match-filters";
import { useSelectedTournament } from "@/features/tournaments/hooks/use-selected-tournament";

export function MatchesPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

function MatchesPageInner() {
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
    groupId,
    round,
    status,
    filters,
    setGroupId,
    setRound,
    setStatus,
  } = useMatchFilters(selectedTournamentId);

  const {
    data: groups = [],
    isLoading: groupsLoading,
  } = useQuery({
    queryKey: ["groups", selectedTournamentId],
    queryFn: () => getGroups({ tournamentId: selectedTournamentId! }),
    enabled: !!selectedTournamentId,
  });

  const {
    data: matches = [],
    isLoading: matchesLoading,
    isError: matchesError,
    error: matchesErr,
    refetch: refetchMatches,
  } = useQuery({
    queryKey: ["matches", filters],
    queryFn: () => getMatches(filters),
    enabled: !!selectedTournamentId,
  });

  if (tournamentsLoading) {
    return <MatchesPageSkeleton />;
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
          <h2 className="text-2xl font-semibold tracking-tight">Matches</h2>
          <p className="text-sm text-muted-foreground">
            Track fixtures, results, and upcoming games
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Swords className="size-10 text-muted-foreground" />
            <p className="font-medium">No tournaments available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Matches</h2>
        <p className="text-sm text-muted-foreground">
          {selectedTournament.name} ({selectedTournament.year})
        </p>
      </div>

      <MatchesFilters
        tournaments={tournaments}
        selectedTournamentId={selectedTournamentId}
        onTournamentChange={setSelectedTournamentId}
        groups={groups}
        groupId={groupId}
        round={round}
        status={status}
        onGroupChange={setGroupId}
        onRoundChange={setRound}
        onStatusChange={setStatus}
      />

      {groupsLoading || matchesLoading ? (
        <MatchesPageSkeleton />
      ) : matchesError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <AlertCircle className="size-10 text-destructive" />
            <div className="space-y-1">
              <p className="font-medium">Failed to load matches</p>
              <p className="text-sm text-muted-foreground">
                {(matchesErr as Error)?.message ??
                  "An unexpected error occurred."}
              </p>
            </div>
            <Button onClick={() => refetchMatches()}>Try again</Button>
          </CardContent>
        </Card>
      ) : matches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Swords className="size-10 text-muted-foreground" />
            <p className="font-medium">No matches found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or check back later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <MatchesTable matches={matches} />
      )}
    </div>
  );
}

export function MatchesPageContent() {
  return (
    <Suspense fallback={<MatchesPageSkeleton />}>
      <MatchesPageInner />
    </Suspense>
  );
}
