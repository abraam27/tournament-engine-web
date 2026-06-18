import type { Match } from "@/features/matches/types/match.types";
import { hasScore } from "@/features/matches/lib/match-utils";
import { cn } from "@/lib/utils";

type MatchScoreProps = {
  match: Pick<
    Match,
    | "status"
    | "homeScore"
    | "awayScore"
    | "hasExtraTime"
    | "extraTimeHomeScore"
    | "extraTimeAwayScore"
    | "hasPenalties"
    | "penaltiesHomeScore"
    | "penaltiesAwayScore"
  >;
  className?: string;
  showDetails?: boolean;
};

export function MatchScore({
  match,
  className,
  showDetails = false,
}: MatchScoreProps) {
  if (!hasScore(match)) {
    return <span className={className}>vs</span>;
  }

  const mainScore = `${match.homeScore ?? 0} - ${match.awayScore ?? 0}`;

  if (!showDetails) {
    return <span className={className}>{mainScore}</span>;
  }

  return (
    <span className={cn("inline-flex flex-col gap-0.5", className)}>
      <span>
        FT: {match.homeScore ?? 0}-{match.awayScore ?? 0}
      </span>
      {match.hasExtraTime && (
        <span className="text-xs text-muted-foreground">
          AET: {match.extraTimeHomeScore ?? match.homeScore ?? 0}-
          {match.extraTimeAwayScore ?? match.awayScore ?? 0}
        </span>
      )}
      {match.hasPenalties && (
        <span className="text-xs text-muted-foreground">
          PEN: {match.penaltiesHomeScore ?? 0}-{match.penaltiesAwayScore ?? 0}
        </span>
      )}
    </span>
  );
}
