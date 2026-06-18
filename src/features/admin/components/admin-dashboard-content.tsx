"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Grid3X3,
  Medal,
  Swords,
  Trophy,
  Users,
  GitBranch,
} from "lucide-react";
import { Suspense } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminSectionCard } from "@/features/admin/components/admin-section-card";
import { AdminStatCard } from "@/features/admin/components/admin-stat-card";
import { CurrentStageBadge } from "@/features/tournaments/components/current-stage-badge";
import { getGroups } from "@/features/groups/api/groups.api";
import { getMatches } from "@/features/matches/api/matches.api";
import { getTeams } from "@/features/teams/api/teams.api";
import { getTournaments } from "@/features/tournaments/api/tournaments.api";
import { useSelectedTournament } from "@/features/tournaments/hooks/use-selected-tournament";
import { useMounted } from "@/lib/hooks/use-mounted";

function AdminDashboardInner() {
  const mounted = useMounted();
  const { selectedTournament, isLoading: tournamentsLoading, isError } =
    useSelectedTournament();

  const { data: tournaments = [] } = useQuery({
    queryKey: ["tournaments"],
    queryFn: getTournaments,
    enabled: mounted,
  });

  const { data: teams = [] } = useQuery({
    queryKey: ["teams"],
    queryFn: () => getTeams(),
    enabled: mounted,
  });

  const { data: groups = [] } = useQuery({
    queryKey: ["groups", selectedTournament?._id],
    queryFn: () => getGroups({ tournamentId: selectedTournament!._id }),
    enabled: mounted && !!selectedTournament,
  });

  const { data: matches = [] } = useQuery({
    queryKey: ["matches", { tournamentId: selectedTournament?._id }],
    queryFn: () => getMatches({ tournamentId: selectedTournament!._id }),
    enabled: mounted && !!selectedTournament,
  });

  if (!mounted || tournamentsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load admin dashboard data.</AlertDescription>
      </Alert>
    );
  }

  const completedMatches = matches.filter((m) => m.status === "completed");
  const scheduledMatches = matches.filter((m) => m.status === "scheduled");

  const sections = [
    {
      title: "Manage Tournaments",
      description: "Create, edit, and delete tournaments",
      href: "/admin/tournaments",
      icon: Trophy,
    },
    {
      title: "Manage Teams",
      description: "Add and update participating teams",
      href: "/admin/teams",
      icon: Users,
    },
    {
      title: "Manage Groups",
      description: "Configure groups and assign teams",
      href: "/admin/groups",
      icon: Grid3X3,
    },
    {
      title: "Manage Matches",
      description: "Fixtures, schedules, and results",
      href: "/admin/matches",
      icon: Swords,
    },
    {
      title: "Qualifications",
      description: "View qualification status",
      href: "/admin/qualifications",
      icon: Medal,
    },
    {
      title: "Brackets",
      description: "Generate knockout rounds",
      href: "/admin/brackets",
      icon: GitBranch,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AdminStatCard label="Tournaments" value={tournaments.length} icon={Trophy} />
        <AdminStatCard label="Teams" value={teams.length} icon={Users} />
        <AdminStatCard
          label="Groups"
          value={selectedTournament ? groups.length : "—"}
          icon={Grid3X3}
        />
        <AdminStatCard
          label="Matches"
          value={selectedTournament ? matches.length : "—"}
          icon={Swords}
        />
        <AdminStatCard
          label="Completed"
          value={selectedTournament ? completedMatches.length : "—"}
        />
        <AdminStatCard
          label="Scheduled"
          value={selectedTournament ? scheduledMatches.length : "—"}
        />
      </div>

      {selectedTournament ? (
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
            <div>
              <p className="font-semibold">{selectedTournament.name}</p>
              <p className="text-sm text-muted-foreground">
                {selectedTournament.year} · {selectedTournament.teamsCount}{" "}
                teams · {selectedTournament.groupsCount} groups
              </p>
            </div>
            <CurrentStageBadge status={selectedTournament.status} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No tournaments available. Create one to get started.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((s) => (
          <AdminSectionCard key={s.href} {...s} />
        ))}
      </div>
    </div>
  );
}

export function AdminDashboardContent() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <AdminDashboardInner />
    </Suspense>
  );
}
