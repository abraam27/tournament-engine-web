import { Badge } from "@/components/ui/badge";
import { getTeamName } from "@/lib/api-utils";

import { isDraw } from "../lib/match-utils";
import type { Match } from "../types/match.types";

type MatchResultDisplayProps = {
  match: Match;
};

export function MatchResultDisplay({ match }: MatchResultDisplayProps) {
  if (match.status === "scheduled") {
    return (
      <p className="text-sm text-muted-foreground">Not played yet</p>
    );
  }

  if (match.status === "live") {
    if (match.homeScore !== undefined || match.awayScore !== undefined) {
      return (
        <p className="text-lg font-semibold">
          {getTeamName(match.homeTeamId)} {match.homeScore ?? 0} -{" "}
          {match.awayScore ?? 0} {getTeamName(match.awayTeamId)}
        </p>
      );
    }

    return <p className="text-lg font-semibold text-primary">Live</p>;
  }

  if (match.status === "cancelled") {
    return (
      <p className="text-sm text-muted-foreground">Match cancelled</p>
    );
  }

  if (match.status === "completed") {
    return (
      <div className="space-y-2">
        <p className="text-lg font-semibold">
          {getTeamName(match.homeTeamId)} {match.homeScore ?? 0} -{" "}
          {match.awayScore ?? 0} {getTeamName(match.awayTeamId)}
        </p>
        {isDraw(match) ? (
          <Badge variant="outline">Draw</Badge>
        ) : match.winnerTeamId ? (
          <Badge>Winner: {getTeamName(match.winnerTeamId)}</Badge>
        ) : null}
      </div>
    );
  }

  return null;
}
