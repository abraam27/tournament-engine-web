import type { MatchRound } from "@/features/matches/types/match.types";
import { cn } from "@/lib/utils";

import {
  BRACKET_ROUND_WIDTH,
  getBracketTotalHeight,
  getRoundMatches,
} from "../lib/bracket-utils";
import type { KnockoutBracketRounds } from "../types/bracket.types";
import { BRACKET_ROUND_ORDER } from "../types/bracket.types";
import { BracketConnectors } from "./bracket-connectors";
import { BracketRound } from "./bracket-round";

type KnockoutBracketProps = {
  rounds: KnockoutBracketRounds;
  className?: string;
};

const DESKTOP_ROUNDS: MatchRound[] = [
  "round_32",
  "round_16",
  "quarter_final",
  "semi_final",
  "third_place",
  "final",
];

export function KnockoutBracket({ rounds, className }: KnockoutBracketProps) {
  const totalHeight = getBracketTotalHeight();
  const activeRounds = DESKTOP_ROUNDS.filter(
    (round) => getRoundMatches(rounds, round).length > 0,
  );

  if (activeRounds.length === 0) {
    return null;
  }

  const minWidth =
    activeRounds.length * BRACKET_ROUND_WIDTH +
    Math.max(0, activeRounds.length - 1) * 48;

  return (
    <div
      className={cn(
        "hidden overflow-x-auto rounded-xl border bg-gradient-to-b from-muted/20 to-background p-4 md:block",
        className,
      )}
    >
      <div className="relative mx-auto" style={{ minWidth }}>
        <div className="flex items-start">
          {activeRounds.map((round, index) => {
            const nextRound = activeRounds[index + 1];

            return (
              <div key={round} className="flex shrink-0 items-start">
                <BracketRound
                  round={round}
                  rounds={rounds}
                  layout="tree"
                  totalHeight={totalHeight}
                />
                {nextRound && (
                  <BracketConnectors
                    leftRound={round}
                    rightRound={nextRound}
                    rounds={rounds}
                    totalHeight={totalHeight}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function KnockoutBracketMobile({
  rounds,
  className,
}: KnockoutBracketProps) {
  const activeRounds = BRACKET_ROUND_ORDER.filter(
    (round) => getRoundMatches(rounds, round).length > 0,
  );

  if (activeRounds.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-8 md:hidden", className)}>
      {activeRounds.map((round) => (
        <BracketRound
          key={round}
          round={round}
          rounds={rounds}
          layout="stack"
        />
      ))}
    </div>
  );
}
