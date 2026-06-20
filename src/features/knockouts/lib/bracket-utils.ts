import {
  MATCH_ROUND_LABELS,
  type MatchRound,
} from "@/features/matches/types/match.types";

import type {
  BracketMatchData,
  BracketTeam,
  KnockoutBracketResponse,
  KnockoutBracketRounds,
} from "../types/bracket.types";
import { BRACKET_ROUND_ORDER } from "../types/bracket.types";

export const BRACKET_MATCH_HEIGHT = 88;
export const BRACKET_UNIT_HEIGHT = 56;
export const BRACKET_ROUND_WIDTH = 220;
export const BRACKET_CONNECTOR_WIDTH = 48;

const SLOT_MULTIPLIER: Record<MatchRound, number> = {
  group: 1,
  round_32: 1,
  round_16: 2,
  quarter_final: 4,
  semi_final: 8,
  third_place: 8,
  final: 16,
};

export function parseKnockoutBracket(data: unknown): KnockoutBracketResponse | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : record;

  if (!nested.tournamentId || !nested.rounds || typeof nested.rounds !== "object") {
    return null;
  }

  const rounds = nested.rounds as KnockoutBracketRounds;

  return {
    tournamentId: String(nested.tournamentId),
    rounds: normalizeBracketRounds(rounds),
  };
}

function normalizeBracketRounds(rounds: KnockoutBracketRounds): KnockoutBracketRounds {
  const normalized: KnockoutBracketRounds = {};

  for (const round of BRACKET_ROUND_ORDER) {
    const matches = rounds[round];
    if (Array.isArray(matches) && matches.length > 0) {
      normalized[round] = matches as BracketMatchData[];
    }
  }

  return normalized;
}

export function getBracketRoundLabel(round: MatchRound | string): string {
  if (round in MATCH_ROUND_LABELS) {
    return MATCH_ROUND_LABELS[round as MatchRound];
  }

  return round
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getTeamDisplayName(team: BracketTeam): string {
  if (!team) {
    return "TBD";
  }

  return team.name ?? team.code ?? "TBD";
}

export function getTeamCode(team: BracketTeam): string {
  if (!team) {
    return "—";
  }

  return team.code ?? "—";
}

export function getTeamId(team: BracketTeam): string | undefined {
  return team?._id;
}

export function isTeamWinner(
  team: BracketTeam,
  match: Pick<BracketMatchData, "winnerTeamId" | "status">,
): boolean {
  if (match.status !== "completed" || !match.winnerTeamId || !team?._id) {
    return false;
  }

  return match.winnerTeamId === team._id;
}

export function isTeamLoser(
  team: BracketTeam,
  match: Pick<BracketMatchData, "winnerTeamId" | "status">,
): boolean {
  if (match.status !== "completed" || !match.winnerTeamId || !team?._id) {
    return false;
  }

  return match.winnerTeamId !== team._id;
}

export function hasMatchScore(
  match: Pick<BracketMatchData, "status" | "homeScore" | "awayScore">,
): boolean {
  return (
    match.status === "completed" ||
    match.status === "live" ||
    match.homeScore !== undefined ||
    match.awayScore !== undefined
  );
}

export function getDisplayScore(
  match: BracketMatchData,
  side: "home" | "away",
): string {
  if (!hasMatchScore(match)) {
    return "—";
  }

  const score = side === "home" ? match.homeScore : match.awayScore;

  if (match.hasPenalties) {
    const pen =
      side === "home" ? match.penaltiesHomeScore : match.penaltiesAwayScore;
    return `${score ?? 0} (${pen ?? 0})`;
  }

  return String(score ?? 0);
}

export function getSlotMultiplier(round: MatchRound | string): number {
  if (round in SLOT_MULTIPLIER) {
    return SLOT_MULTIPLIER[round as MatchRound];
  }

  return 1;
}

export function getBracketTotalHeight(): number {
  return 16 * BRACKET_UNIT_HEIGHT;
}

export function getMatchTop(round: MatchRound | string, index: number): number {
  const multiplier = getSlotMultiplier(round);
  const slotHeight = multiplier * BRACKET_UNIT_HEIGHT;
  return index * slotHeight + (slotHeight - BRACKET_MATCH_HEIGHT) / 2;
}

export function getMatchCenterY(
  round: MatchRound | string,
  index: number,
): number {
  return getMatchTop(round, index) + BRACKET_MATCH_HEIGHT / 2;
}

export function getRoundMatches(
  rounds: KnockoutBracketRounds,
  round: MatchRound,
): BracketMatchData[] {
  return rounds[round] ?? [];
}

export function hasAnyBracketMatches(rounds: KnockoutBracketRounds): boolean {
  return BRACKET_ROUND_ORDER.some(
    (round) => (rounds[round]?.length ?? 0) > 0,
  );
}

export function countBracketMatches(rounds: KnockoutBracketRounds): number {
  return BRACKET_ROUND_ORDER.reduce(
    (total, round) => total + (rounds[round]?.length ?? 0),
    0,
  );
}
