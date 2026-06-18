import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CurrentStageBadge } from "./current-stage-badge";
import type { Tournament } from "../types/tournament.types";
import { TOURNAMENT_STATUS_LABELS } from "../types/tournament.types";

type TournamentOverviewCardProps = {
  tournament: Tournament;
};

export function TournamentOverviewCard({
  tournament,
}: TournamentOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-xl">{tournament.name}</CardTitle>
            <CardDescription>Season {tournament.year}</CardDescription>
          </div>
          <CurrentStageBadge status={tournament.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">Teams</dt>
            <dd className="text-lg font-semibold">{tournament.teamsCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Groups</dt>
            <dd className="text-lg font-semibold">{tournament.groupsCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Teams per Group</dt>
            <dd className="text-lg font-semibold">{tournament.teamsPerGroup}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Current Phase</dt>
            <dd className="text-sm font-medium">
              {TOURNAMENT_STATUS_LABELS[tournament.status]}
            </dd>
          </div>
        </dl>

        <Button
          render={<Link href={`/tournaments/${tournament._id}`} />}
          nativeButton={false}
        >
          View Tournament
          <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
