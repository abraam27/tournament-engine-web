import type { Match } from "@/features/matches/types/match.types";

type MatchPenaltyDisplayProps = {
  match: Pick<Match, "hasPenalties" | "penaltiesHomeScore" | "penaltiesAwayScore">;
};

export function MatchPenaltyDisplay({ match }: MatchPenaltyDisplayProps) {
  if (!match.hasPenalties) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <p className="text-sm font-medium">Penalty Shootout</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">
        {match.penaltiesHomeScore ?? 0} - {match.penaltiesAwayScore ?? 0}
      </p>
    </div>
  );
}
