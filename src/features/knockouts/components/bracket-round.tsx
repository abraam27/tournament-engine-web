import type { MatchRound } from "@/features/matches/types/match.types";
import { cn } from "@/lib/utils";

import {
  BRACKET_MATCH_HEIGHT,
  BRACKET_ROUND_WIDTH,
  getBracketRoundLabel,
  getMatchTop,
  getRoundMatches,
} from "../lib/bracket-utils";
import type { BracketMatchData, KnockoutBracketRounds } from "../types/bracket.types";
import { BracketMatch } from "./bracket-match";

type BracketRoundProps = {
  round: MatchRound;
  rounds: KnockoutBracketRounds;
  layout?: "tree" | "stack";
  totalHeight?: number;
  className?: string;
};

export function BracketRound({
  round,
  rounds,
  layout = "stack",
  totalHeight,
  className,
}: BracketRoundProps) {
  const matches = getRoundMatches(rounds, round);

  if (matches.length === 0) {
    return null;
  }

  if (layout === "stack") {
    return (
      <section className={cn("space-y-3", className)}>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {getBracketRoundLabel(round)}
        </h3>
        <div className="grid gap-3">
          {matches.map((match) => (
            <BracketMatch key={match.matchId} match={match} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div
      className={cn("flex shrink-0 flex-col", className)}
      style={{ width: BRACKET_ROUND_WIDTH }}
    >
      <div className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {getBracketRoundLabel(round)}
      </div>
      <div
        className="relative"
        style={{ height: totalHeight, width: BRACKET_ROUND_WIDTH }}
      >
        {matches.map((match, index) => (
          <BracketMatchTreeItem
            key={match.matchId}
            match={match}
            round={round}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

function BracketMatchTreeItem({
  match,
  round,
  index,
}: {
  match: BracketMatchData;
  round: MatchRound;
  index: number;
}) {
  return (
    <div
      className="absolute left-0 right-0"
      style={{
        top: getMatchTop(round, index),
        height: BRACKET_MATCH_HEIGHT,
      }}
    >
      <BracketMatch match={match} compact />
    </div>
  );
}
