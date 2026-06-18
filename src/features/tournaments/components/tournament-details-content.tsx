"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getGroupsByTournament } from "@/features/groups/api/groups.api";
import { GROUP_STATUS_LABELS } from "@/features/groups/types/group.types";
import { getMatchesByTournament } from "@/features/matches/api/matches.api";
import { MATCH_STATUS_LABELS } from "@/features/matches/types/match.types";
import { getTournamentById } from "@/features/tournaments/api/tournaments.api";
import { CurrentStageBadge } from "@/features/tournaments/components/current-stage-badge";
import { TOURNAMENT_STATUS_LABELS } from "@/features/tournaments/types/tournament.types";
import { formatDate, getTeamLabel } from "@/lib/api-utils";
import { useMounted } from "@/lib/hooks/use-mounted";

type TournamentDetailsContentProps = {
  tournamentId: string;
};

function TournamentDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-40 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}

export function TournamentDetailsContent({
  tournamentId,
}: TournamentDetailsContentProps) {
  const mounted = useMounted();

  const tournamentQuery = useQuery({
    queryKey: ["tournament", tournamentId],
    queryFn: () => getTournamentById(tournamentId),
    enabled: mounted,
  });

  const groupsQuery = useQuery({
    queryKey: ["groups", tournamentId],
    queryFn: () => getGroupsByTournament(tournamentId),
    enabled: mounted && !!tournamentQuery.data,
  });

  const matchesQuery = useQuery({
    queryKey: ["matches", tournamentId],
    queryFn: () => getMatchesByTournament(tournamentId),
    enabled: mounted && !!tournamentQuery.data,
  });

  if (!mounted || tournamentQuery.isLoading) {
    return <TournamentDetailsSkeleton />;
  }

  if (tournamentQuery.isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <AlertCircle className="size-10 text-destructive" />
          <div className="space-y-1">
            <p className="font-medium">Failed to load tournament</p>
            <p className="text-sm text-muted-foreground">
              {(tournamentQuery.error as Error)?.message ??
                "An unexpected error occurred."}
            </p>
          </div>
          <Button onClick={() => tournamentQuery.refetch()}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  const tournament = tournamentQuery.data;

  if (!tournament) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Tournament not found</h2>
          <p className="text-sm text-muted-foreground">
            The tournament you are looking for does not exist.
          </p>
        </div>
        <Button render={<Link href="/" />} nativeButton={false}>
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const matches = matchesQuery.data ?? [];
  const groups = groupsQuery.data ?? [];
  const completedMatches = matches.filter((m) => m.status === "completed");
  const scheduledMatches = matches.filter((m) => m.status === "scheduled");

  const recentMatches = [...matches]
    .filter((m) => m.status === "completed")
    .sort((a, b) => {
      const dateA = a.matchDate ? new Date(a.matchDate).getTime() : 0;
      const dateB = b.matchDate ? new Date(b.matchDate).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  const upcomingMatches = [...matches]
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => {
      const dateA = a.matchDate ? new Date(a.matchDate).getTime() : Infinity;
      const dateB = b.matchDate ? new Date(b.matchDate).getTime() : Infinity;
      return dateA - dateB;
    })
    .slice(0, 5);

  const statCards = [
    { label: "Teams", value: tournament.teamsCount },
    { label: "Groups", value: tournament.groupsCount },
    { label: "Matches", value: matches.length },
    { label: "Completed", value: completedMatches.length },
    { label: "Scheduled", value: scheduledMatches.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/" />}
            nativeButton={false}
            className="mb-2 -ml-2"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </Button>
          <h2 className="text-2xl font-semibold tracking-tight">
            {tournament.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {tournament.year} · {TOURNAMENT_STATUS_LABELS[tournament.status]}
          </p>
        </div>
        <CurrentStageBadge status={tournament.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tournament Information</CardTitle>
          <CardDescription>Configuration and current phase</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-xs text-muted-foreground">Teams</dt>
              <dd className="font-medium">{tournament.teamsCount}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Groups</dt>
              <dd className="font-medium">{tournament.groupsCount}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Teams per Group</dt>
              <dd className="font-medium">{tournament.teamsPerGroup}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Qualified per Group</dt>
              <dd className="font-medium">{tournament.qualifiedPerGroup}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Best Third Places</dt>
              <dd className="font-medium">{tournament.bestThirdCount}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Status</dt>
              <dd className="font-medium">
                {TOURNAMENT_STATUS_LABELS[tournament.status]}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Groups Summary</CardTitle>
          <CardDescription>
            {groupsQuery.isLoading
              ? "Loading groups..."
              : `${groups.length} group(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {groupsQuery.isError ? (
            <p className="text-sm text-muted-foreground">
              Unable to load groups.
            </p>
          ) : groups.length === 0 ? (
            <p className="text-sm text-muted-foreground">No groups yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <div
                  key={group._id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">
                      {group.name}{" "}
                      <span className="text-muted-foreground">
                        ({group.code})
                      </span>
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {GROUP_STATUS_LABELS[group.status] ?? group.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {(recentMatches.length > 0 || upcomingMatches.length > 0) && (
        <div className="grid gap-4 lg:grid-cols-2">
          {recentMatches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Matches</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentMatches.map((match) => (
                  <div
                    key={match._id}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {getTeamLabel(match.homeTeamId)} vs{" "}
                        {getTeamLabel(match.awayTeamId)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {match.round} · {formatDate(match.matchDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {match.homeScore ?? "-"} - {match.awayScore ?? "-"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {MATCH_STATUS_LABELS[match.status]}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {upcomingMatches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upcoming Matches</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingMatches.map((match) => (
                  <div
                    key={match._id}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {getTeamLabel(match.homeTeamId)} vs{" "}
                        {getTeamLabel(match.awayTeamId)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {match.round} · {formatDate(match.matchDate)}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {MATCH_STATUS_LABELS[match.status]}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
