"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, GitBranch } from "lucide-react";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getKnockoutBracket } from "@/features/knockouts/api/knockouts.api";
import { KnockoutBracketView } from "@/features/knockouts/components/knockout-bracket-view";
import {
  countBracketMatches,
  hasAnyBracketMatches,
} from "@/features/knockouts/lib/bracket-utils";
import { TournamentSelector } from "@/features/tournaments/components/tournament-selector";
import { useSelectedTournament } from "@/features/tournaments/hooks/use-selected-tournament";

function KnockoutBracketSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-64" />
      <Skeleton className="hidden h-[600px] w-full md:block" />
      <div className="space-y-4 md:hidden">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

function KnockoutBracketInner() {
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
    data: bracket,
    isLoading: bracketLoading,
    isError: bracketError,
    error: bracketErr,
    refetch: refetchBracket,
  } = useQuery({
    queryKey: ["knockout-bracket", selectedTournamentId],
    queryFn: () => getKnockoutBracket(selectedTournamentId!),
    enabled: !!selectedTournamentId,
  });

  if (tournamentsLoading) {
    return <KnockoutBracketSkeleton />;
  }

  if (tournamentsError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <AlertCircle className="size-10 text-destructive" />
          <div className="space-y-1">
            <p className="font-medium">Failed to load tournaments</p>
            <p className="text-sm text-muted-foreground">
              {tournamentsErr instanceof Error
                ? tournamentsErr.message
                : "Unknown error"}
            </p>
          </div>
          <Button onClick={() => refetchTournaments()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Knockout Bracket
          </h2>
          <p className="text-sm text-muted-foreground">
            {selectedTournament
              ? `${selectedTournament.name} — elimination rounds to the final`
              : "Follow the path from the Round of 32 to the Final"}
          </p>
        </div>
        <TournamentSelector
          tournaments={tournaments}
          value={selectedTournamentId}
          onChange={setSelectedTournamentId}
        />
      </div>

      {!selectedTournamentId ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Select a tournament to view the knockout bracket.
          </CardContent>
        </Card>
      ) : bracketLoading ? (
        <KnockoutBracketSkeleton />
      ) : bracketError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <AlertCircle className="size-10 text-destructive" />
            <div className="space-y-1">
              <p className="font-medium">Failed to load bracket</p>
              <p className="text-sm text-muted-foreground">
                {bracketErr instanceof Error
                  ? bracketErr.message
                  : "Unknown error"}
              </p>
            </div>
            <Button onClick={() => refetchBracket()}>Retry</Button>
          </CardContent>
        </Card>
      ) : !bracket || !hasAnyBracketMatches(bracket.rounds) ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <GitBranch className="size-10 text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium">No knockout bracket yet</p>
              <p className="text-sm text-muted-foreground">
                Generate the Round of 32 from the admin bracket page once the
                group stage is complete.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {countBracketMatches(bracket.rounds)} knockout matches · scroll
            horizontally on desktop to explore the full tree
          </p>
          <KnockoutBracketView rounds={bracket.rounds} />
        </>
      )}
    </div>
  );
}

export function KnockoutBracketPageContent() {
  return (
    <Suspense fallback={<KnockoutBracketSkeleton />}>
      <KnockoutBracketInner />
    </Suspense>
  );
}
