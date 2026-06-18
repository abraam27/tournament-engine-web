import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTeamCode, getTeamName } from "@/lib/api-utils";

import {
  formatMatchDate,
  formatRound,
  getGroupName,
  getTeamFlag,
} from "../lib/match-utils";
import type { Match } from "../types/match.types";
import { MatchStatusBadge } from "./match-status-badge";

type MatchDetailsCardProps = {
  match: Match;
};

function TeamLine({
  team,
  align = "left",
}: {
  team: Match["homeTeamId"];
  align?: "left" | "right";
}) {
  const flagUrl = getTeamFlag(team);

  return (
    <div
      className={
        align === "right"
          ? "flex flex-col items-end text-right"
          : "flex flex-col items-start"
      }
    >
      {flagUrl && (
        <img
          src={flagUrl}
          alt=""
          className="mb-2 size-10 rounded border object-cover"
        />
      )}
      <p className="text-lg font-semibold">{getTeamName(team)}</p>
      <p className="text-sm text-muted-foreground">{getTeamCode(team)}</p>
    </div>
  );
}

export function MatchDetailsCard({ match }: MatchDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>Match {match.matchNumber}</CardTitle>
            <CardDescription>{formatRound(match.round)}</CardDescription>
          </div>
          <MatchStatusBadge status={match.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3 sm:items-center">
          <TeamLine team={match.homeTeamId} />
          <div className="text-center">
            <p className="text-3xl font-bold tracking-tight">
              {match.homeScore ?? "-"} : {match.awayScore ?? "-"}
            </p>
          </div>
          <TeamLine team={match.awayTeamId} align="right" />
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Stadium</dt>
            <dd className="font-medium">{match.stadium ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Match Date</dt>
            <dd className="font-medium">{formatMatchDate(match.matchDate)}</dd>
          </div>
          {match.groupId && (
            <div>
              <dt className="text-xs text-muted-foreground">Group</dt>
              <dd className="font-medium">{getGroupName(match.groupId)}</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}
