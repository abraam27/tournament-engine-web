import type { MatchRound } from "@/features/matches/types/match.types";

import {
  BRACKET_CONNECTOR_WIDTH,
  getMatchCenterY,
  getRoundMatches,
} from "../lib/bracket-utils";
import type { KnockoutBracketRounds } from "../types/bracket.types";

type BracketConnectorsProps = {
  leftRound: MatchRound;
  rightRound: MatchRound;
  rounds: KnockoutBracketRounds;
  totalHeight: number;
};

export function BracketConnectors({
  leftRound,
  rightRound,
  rounds,
  totalHeight,
}: BracketConnectorsProps) {
  const leftMatches = getRoundMatches(rounds, leftRound);
  const rightMatches = getRoundMatches(rounds, rightRound);

  if (leftMatches.length === 0 || rightMatches.length === 0) {
    return (
      <div
        className="shrink-0"
        style={{ width: BRACKET_CONNECTOR_WIDTH, height: totalHeight }}
      />
    );
  }

  const paths: string[] = [];

  for (let i = 0; i < leftMatches.length; i += 2) {
    const topMatch = leftMatches[i];
    const bottomMatch = leftMatches[i + 1];
    const targetIndex = Math.floor(i / 2);
    const targetMatch = rightMatches[targetIndex];

    if (!topMatch || !targetMatch) {
      continue;
    }

    const topY = getMatchCenterY(leftRound, i);
    const bottomY = bottomMatch
      ? getMatchCenterY(leftRound, i + 1)
      : topY;
    const targetY = getMatchCenterY(rightRound, targetIndex);
    const midY = (topY + bottomY) / 2;

    const x1 = 0;
    const xMid = BRACKET_CONNECTOR_WIDTH / 2;
    const x2 = BRACKET_CONNECTOR_WIDTH;

    paths.push(
      `M ${x1} ${topY} H ${xMid} V ${midY} H ${x2} V ${targetY}`,
    );

    if (bottomMatch) {
      paths.push(`M ${x1} ${bottomY} H ${xMid}`);
    }
  }

  return (
    <svg
      className="shrink-0 text-border"
      width={BRACKET_CONNECTOR_WIDTH}
      height={totalHeight}
      aria-hidden
    >
      {paths.map((d, index) => (
        <path
          key={index}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
