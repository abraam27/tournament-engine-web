"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ListOrdered } from "lucide-react";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getThirdPlaceRanking } from "@/features/qualifications/api/qualifications.api";
import { QualificationSortingVisual } from "@/features/qualifications/components/qualification-sorting-visual";
import { ThirdPlaceRankingCard } from "@/features/qualifications/components/third-place-ranking-card";
import { ThirdPlaceRankingTable } from "@/features/qualifications/components/third-place-ranking-table";
import { TournamentSelector } from "@/features/tournaments/components/tournament-selector";
import { useSelectedTournament } from "@/features/tournaments/hooks/use-selected-tournament";

export function ThirdPlaceRankingPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

function ThirdPlaceRankingPageInner() {
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
    data: rankingData,
    isLoading: rankingLoading,
    isError: rankingError,
    error: rankingErr,
    refetch: refetchRanking,
  } = useQuery({
    queryKey: ["third-place-ranking", selectedTournamentId],
    queryFn: () => getThirdPlaceRanking(selectedTournamentId!),
    enabled: !!selectedTournamentId,
  });

  if (tournamentsLoading) {
    return <ThirdPlaceRankingPageSkeleton />;
  }

  if (tournamentsError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <AlertCircle className="size-10 text-destructive" />
          <p className="font-medium">Failed to load tournaments</p>
          <p className="text-sm text-muted-foreground">
            {(tournamentsErr as Error)?.message ?? "An unexpected error occurred."}
          </p>
          <Button onClick={() => refetchTournaments()}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  if (!selectedTournament) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Third Place Ranking
          </h2>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <ListOrdered className="size-10 text-muted-foreground" />
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
          <h2 className="text-2xl font-semibold tracking-tight">
            Third Place Ranking
          </h2>
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

      <QualificationSortingVisual />

      {rankingLoading ? (
        <ThirdPlaceRankingPageSkeleton />
      ) : rankingError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <AlertCircle className="size-10 text-destructive" />
            <div className="space-y-1">
              <p className="font-medium">Failed to load third-place ranking</p>
              <p className="text-sm text-muted-foreground">
                {(rankingErr as Error)?.message ??
                  "An unexpected error occurred."}
              </p>
            </div>
            <Button onClick={() => refetchRanking()}>Try again</Button>
          </CardContent>
        </Card>
      ) : !rankingData?.ranking.length ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <ListOrdered className="size-10 text-muted-foreground" />
            <p className="font-medium">No third-place ranking yet</p>
            <p className="text-sm text-muted-foreground">
              Ranking will appear once group stage matches are completed.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <ThirdPlaceRankingCard data={rankingData} />
          <ThirdPlaceRankingTable ranking={rankingData.ranking} />
        </>
      )}
    </div>
  );
}

export function ThirdPlaceRankingPageContent() {
  return (
    <Suspense fallback={<ThirdPlaceRankingPageSkeleton />}>
      <ThirdPlaceRankingPageInner />
    </Suspense>
  );
}
