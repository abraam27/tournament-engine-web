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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getGroupById,
  getGroupTeams,
} from "@/features/groups/api/groups.api";
import { GroupFixturesList } from "@/features/groups/components/group-fixtures-list";
import { GroupResultsList } from "@/features/groups/components/group-results-list";
import { GroupTeamsList } from "@/features/groups/components/group-teams-list";
import { GROUP_STATUS_LABELS } from "@/features/groups/types/group.types";
import { getGroupMatches } from "@/features/matches/api/matches.api";
import { getGroupStandings } from "@/features/standings/api/standings.api";
import { StandingsTable } from "@/features/standings/components/standings-table";
import { useMounted } from "@/lib/hooks/use-mounted";

type GroupDetailsContentProps = {
  groupId: string;
};

function GroupDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function GroupDetailsContent({ groupId }: GroupDetailsContentProps) {
  const mounted = useMounted();

  const groupQuery = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => getGroupById(groupId),
    enabled: mounted,
  });

  const teamsQuery = useQuery({
    queryKey: ["group-teams", groupId],
    queryFn: () => getGroupTeams(groupId),
    enabled: mounted && !!groupQuery.data,
  });

  const matchesQuery = useQuery({
    queryKey: ["group-matches", groupId],
    queryFn: () => getGroupMatches(groupId),
    enabled: mounted && !!groupQuery.data,
  });

  const standingsQuery = useQuery({
    queryKey: ["group-standings", groupId],
    queryFn: () => getGroupStandings(groupId),
    enabled: mounted && !!groupQuery.data,
  });

  if (!mounted || groupQuery.isLoading) {
    return <GroupDetailsSkeleton />;
  }

  if (groupQuery.isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <AlertCircle className="size-10 text-destructive" />
          <div className="space-y-1">
            <p className="font-medium">Failed to load group</p>
            <p className="text-sm text-muted-foreground">
              {(groupQuery.error as Error)?.message ??
                "An unexpected error occurred."}
            </p>
          </div>
          <Button onClick={() => groupQuery.refetch()}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  const group = groupQuery.data;

  if (!group) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Group not found</h2>
          <p className="text-sm text-muted-foreground">
            The group you are looking for does not exist.
          </p>
        </div>
        <Button render={<Link href="/groups" />} nativeButton={false}>
          <ArrowLeft className="size-4" />
          Back to Groups
        </Button>
      </div>
    );
  }

  const groupsHref = `/groups?tournamentId=${group.tournamentId}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            render={<Link href={groupsHref} />}
            nativeButton={false}
            className="mb-2 -ml-2"
          >
            <ArrowLeft className="size-4" />
            Groups
          </Button>
          <h2 className="text-2xl font-semibold tracking-tight">
            {group.name}
          </h2>
          <p className="text-sm text-muted-foreground">Group {group.code}</p>
        </div>
        <Badge variant="secondary">
          {GROUP_STATUS_LABELS[group.status] ?? group.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Teams</CardTitle>
          <CardDescription>Teams assigned to this group</CardDescription>
        </CardHeader>
        <CardContent>
          {teamsQuery.isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <GroupTeamsList teams={teamsQuery.data ?? []} />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fixtures</CardTitle>
            <CardDescription>Scheduled and live matches</CardDescription>
          </CardHeader>
          <CardContent>
            {matchesQuery.isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <GroupFixturesList matches={matchesQuery.data ?? []} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Results</CardTitle>
            <CardDescription>Completed and cancelled matches</CardDescription>
          </CardHeader>
          <CardContent>
            {matchesQuery.isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <GroupResultsList matches={matchesQuery.data ?? []} />
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Card id="standings">
        <CardHeader>
          <CardTitle className="text-base">Standings</CardTitle>
          <CardDescription>Group table and qualification status</CardDescription>
        </CardHeader>
        <CardContent>
          {standingsQuery.isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : standingsQuery.isError ? (
            <p className="text-sm text-muted-foreground">
              Unable to load standings for this group.
            </p>
          ) : (
            <StandingsTable
              standings={standingsQuery.data?.standings ?? []}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
