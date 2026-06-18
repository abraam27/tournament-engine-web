import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTeamName } from "@/lib/api-utils";

import {
  formatMatchDate,
  formatRound,
} from "../lib/match-utils";
import type { Match } from "../types/match.types";
import { MatchScore } from "./match-score";
import { MatchStatusBadge } from "./match-status-badge";

type MatchCardProps = {
  match: Match;
};

export function MatchCard({ match }: MatchCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">
              Match {match.matchNumber}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {formatRound(match.round)}
            </p>
          </div>
          <MatchStatusBadge status={match.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="font-medium">
          {getTeamName(match.homeTeamId)}{" "}
          <MatchScore match={match} className="text-muted-foreground" />{" "}
          {getTeamName(match.awayTeamId)}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatMatchDate(match.matchDate)}
          {match.stadium ? ` · ${match.stadium}` : ""}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          size="sm"
          variant="outline"
          render={<Link href={`/matches/${match._id}`} />}
          nativeButton={false}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
