"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Users } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getTeams } from "@/features/teams/api/teams.api";
import { TeamSearch } from "@/features/teams/components/team-search";
import { TeamsTable } from "@/features/teams/components/teams-table";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { useMounted } from "@/lib/hooks/use-mounted";

function TeamsPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-8 w-full max-w-sm" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function TeamsPageContent() {
  const mounted = useMounted();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim());

  const {
    data: teams = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["teams", debouncedSearch],
    queryFn: () => getTeams(debouncedSearch || undefined),
    enabled: mounted,
  });

  if (!mounted || isLoading) {
    return <TeamsPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Teams</h2>
        <p className="text-sm text-muted-foreground">
          Browse and search participating teams
        </p>
      </div>

      <TeamSearch value={search} onChange={setSearch} />

      {isError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <AlertCircle className="size-10 text-destructive" />
            <div className="space-y-1">
              <p className="font-medium">Failed to load teams</p>
              <p className="text-sm text-muted-foreground">
                {(error as Error)?.message ?? "An unexpected error occurred."}
              </p>
            </div>
            <Button onClick={() => refetch()}>Try again</Button>
          </CardContent>
        </Card>
      ) : teams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Users className="size-10 text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium">No teams found</p>
              <p className="text-sm text-muted-foreground">
                {debouncedSearch
                  ? `No results for "${debouncedSearch}".`
                  : "No teams have been added yet."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <TeamsTable teams={teams} />
      )}
    </div>
  );
}
