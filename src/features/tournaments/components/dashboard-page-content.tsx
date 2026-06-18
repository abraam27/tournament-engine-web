"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getMatchesByTournament } from "@/features/matches/api/matches.api";
import { getTournaments } from "@/features/tournaments/api/tournaments.api";
import { TournamentOverviewCard } from "@/features/tournaments/components/tournament-overview-card";
import {
  TournamentQuickLinks,
  TournamentStatsCards,
} from "@/features/tournaments/components/tournament-stats-cards";
import { useMounted } from "@/lib/hooks/use-mounted";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-48 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}

export function DashboardPageContent() {
  const mounted = useMounted();

  const {
    data: tournaments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tournaments"],
    queryFn: getTournaments,
    enabled: mounted,
  });

  const featuredTournament =
    tournaments.length > 0
      ? [...tournaments].sort((a, b) => b.year - a.year)[0]
      : null;

  const {
    data: matches = [],
    isLoading: matchesLoading,
  } = useQuery({
    queryKey: ["matches", featuredTournament?._id],
    queryFn: () => getMatchesByTournament(featuredTournament!._id),
    enabled: mounted && !!featuredTournament?._id,
  });

  if (!mounted || isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <AlertCircle className="size-10 text-destructive" />
          <div className="space-y-1">
            <p className="font-medium">Failed to load tournaments</p>
            <p className="text-sm text-muted-foreground">
              {(error as Error)?.message ?? "An unexpected error occurred."}
            </p>
          </div>
          <Button onClick={() => refetch()}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  if (!featuredTournament) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            World Cup 2026 Simulator overview
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Trophy className="size-10 text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium">No tournaments yet</p>
              <p className="text-sm text-muted-foreground">
                Create a tournament in the backend to see the overview here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Overview of the latest tournament
        </p>
      </div>

      <TournamentOverviewCard tournament={featuredTournament} />

      <TournamentStatsCards
        tournamentsCount={tournaments.length}
        teamsCount={featuredTournament.teamsCount}
        groupsCount={featuredTournament.groupsCount}
        matchesCount={matchesLoading ? undefined : matches.length}
      />

      <TournamentQuickLinks tournamentId={featuredTournament._id} />
    </div>
  );
}
