import { MatchScore } from "@/features/matches/components/match-score";
import { MatchStatusBadge } from "@/features/matches/components/match-status-badge";
import type { Match } from "@/features/matches/types/match.types";
import { formatDate, getTeamName } from "@/lib/api-utils";

type GroupFixturesListProps = {
  matches: Match[];
};

export function GroupFixturesList({ matches }: GroupFixturesListProps) {
  const fixtures = matches
    .filter((m) => m.status === "scheduled" || m.status === "live")
    .sort((a, b) => {
      const dateA = a.matchDate ? new Date(a.matchDate).getTime() : Infinity;
      const dateB = b.matchDate ? new Date(b.matchDate).getTime() : Infinity;
      return dateA - dateB;
    });

  if (fixtures.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No upcoming fixtures.</p>
    );
  }

  return (
    <div className="space-y-3">
      {fixtures.map((match) => (
        <div
          key={match._id}
          className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Match {match.matchNumber} · {match.round}
            </p>
            <p className="font-medium">
              {getTeamName(match.homeTeamId)}{" "}
              <MatchScore match={match} className="text-muted-foreground" />{" "}
              {getTeamName(match.awayTeamId)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(match.matchDate)}
              {match.stadium ? ` · ${match.stadium}` : ""}
            </p>
          </div>
          <MatchStatusBadge status={match.status} />
        </div>
      ))}
    </div>
  );
}
