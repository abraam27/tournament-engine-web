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
import { Skeleton } from "@/components/ui/skeleton";
import { getTeamById } from "@/features/teams/api/teams.api";
import { TeamInfoCard } from "@/features/teams/components/team-info-card";
import { useMounted } from "@/lib/hooks/use-mounted";

type TeamDetailsPageContentProps = {
  teamId: string;
};

function TeamDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export function TeamDetailsPageContent({
  teamId,
}: TeamDetailsPageContentProps) {
  const mounted = useMounted();

  const {
    data: team,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["team", teamId],
    queryFn: () => getTeamById(teamId),
    enabled: mounted,
  });

  if (!mounted || isLoading) {
    return <TeamDetailsSkeleton />;
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <AlertCircle className="size-10 text-destructive" />
          <div className="space-y-1">
            <p className="font-medium">Failed to load team</p>
            <p className="text-sm text-muted-foreground">
              {(error as Error)?.message ?? "An unexpected error occurred."}
            </p>
          </div>
          <Button onClick={() => refetch()}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  if (!team) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Team not found</h2>
          <p className="text-sm text-muted-foreground">
            The team you are looking for does not exist.
          </p>
        </div>
        <Button render={<Link href="/teams" />} nativeButton={false}>
          <ArrowLeft className="size-4" />
          Back to Teams
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
          render={<Link href="/teams" />}
          nativeButton={false}
          className="mb-2 -ml-2"
        >
          <ArrowLeft className="size-4" />
          Teams
        </Button>
        <h2 className="text-2xl font-semibold tracking-tight">{team.name}</h2>
        <p className="text-sm text-muted-foreground">Team profile</p>
      </div>

      <TeamInfoCard team={team} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Group Information</CardTitle>
          <CardDescription>Tournament assignment</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Group information will appear once team assignment API is connected.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tournament Progress</CardTitle>
          <CardDescription>Standings and knockout results</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Tournament progress will appear after standings and bracket pages
            are connected.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
