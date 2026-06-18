"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft } from "lucide-react";

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
import { getMatchById } from "@/features/matches/api/matches.api";
import { MatchDetailsCard } from "@/features/matches/components/match-details-card";
import { MatchExtraTimeDisplay } from "@/features/matches/components/match-extra-time-display";
import { MatchPenaltyDisplay } from "@/features/matches/components/match-penalty-display";
import { MatchResultDisplay } from "@/features/matches/components/match-result-display";
import { MatchTimeline } from "@/features/matches/components/match-timeline";
import { getTeamName } from "@/lib/api-utils";
import { useMounted } from "@/lib/hooks/use-mounted";

type MatchDetailsContentProps = {
  matchId: string;
};

function MatchDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-56 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export function MatchDetailsContent({ matchId }: MatchDetailsContentProps) {
  const mounted = useMounted();

  const {
    data: match,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["match", matchId],
    queryFn: () => getMatchById(matchId),
    enabled: mounted,
  });

  if (!mounted || isLoading) {
    return <MatchDetailsSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <AlertCircle className="size-10 text-destructive" />
          <div className="space-y-1">
            <p className="font-medium">Failed to load match</p>
            <p className="text-sm text-muted-foreground">
              {(error as Error)?.message ?? "An unexpected error occurred."}
            </p>
          </div>
          <Button onClick={() => refetch()}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  if (!match) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Match not found</h2>
          <p className="text-sm text-muted-foreground">
            The match you are looking for does not exist.
          </p>
        </div>
        <Button render={<Link href="/matches" />} nativeButton={false}>
          <ArrowLeft className="size-4" />
          Back to Matches
        </Button>
      </div>
    );
  }

  const matchesHref = `/matches?tournamentId=${match.tournamentId}`;

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          render={<Link href={matchesHref} />}
          nativeButton={false}
          className="mb-2 -ml-2"
        >
          <ArrowLeft className="size-4" />
          Matches
        </Button>
        <h2 className="text-2xl font-semibold tracking-tight">
          Match {match.matchNumber}
        </h2>
        <p className="text-sm text-muted-foreground">Match details</p>
      </div>

      <MatchDetailsCard match={match} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Result</CardTitle>
          <CardDescription>Full-time outcome</CardDescription>
        </CardHeader>
        <CardContent>
          <MatchResultDisplay match={match} />
        </CardContent>
      </Card>

      {(match.hasExtraTime || match.hasPenalties) && (
        <div className="grid gap-4 sm:grid-cols-2">
          <MatchExtraTimeDisplay match={match} />
          <MatchPenaltyDisplay match={match} />
        </div>
      )}

      {match.status === "completed" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Outcome</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {match.winnerTeamId && (
              <p>
                <span className="text-muted-foreground">Winner: </span>
                <span className="font-medium">
                  {getTeamName(match.winnerTeamId)}
                </span>
              </p>
            )}
            {match.loserTeamId && (
              <p>
                <span className="text-muted-foreground">Loser: </span>
                <span className="font-medium">
                  {getTeamName(match.loserTeamId)}
                </span>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
          <CardDescription>Match progression</CardDescription>
        </CardHeader>
        <CardContent>
          <MatchTimeline match={match} />
        </CardContent>
      </Card>
    </div>
  );
}
