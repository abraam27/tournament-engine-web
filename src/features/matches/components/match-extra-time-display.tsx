import type { Match } from "@/features/matches/types/match.types";

type MatchExtraTimeDisplayProps = {
  match: Pick<
    Match,
    "hasExtraTime" | "extraTimeHomeScore" | "extraTimeAwayScore"
  >;
};

export function MatchExtraTimeDisplay({ match }: MatchExtraTimeDisplayProps) {
  if (!match.hasExtraTime) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <p className="text-sm font-medium">After Extra Time</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">
        {match.extraTimeHomeScore ?? 0} - {match.extraTimeAwayScore ?? 0}
      </p>
    </div>
  );
}
