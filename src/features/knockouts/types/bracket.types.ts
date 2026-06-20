import type { MatchRound, MatchStatus } from "@/features/matches/types/match.types";

export type BracketTeam = {
  _id?: string;
  name?: string;
  code?: string;
  flagUrl?: string;
} | null;

export type BracketMatchData = {
  matchId: string;
  matchNumber: number;
  round: MatchRound | string;
  homeTeam: BracketTeam;
  awayTeam: BracketTeam;
  homeScore?: number;
  awayScore?: number;
  hasExtraTime?: boolean;
  extraTimeHomeScore?: number;
  extraTimeAwayScore?: number;
  hasPenalties?: boolean;
  penaltiesHomeScore?: number;
  penaltiesAwayScore?: number;
  winnerTeamId?: string;
  loserTeamId?: string;
  status: MatchStatus;
};

export type KnockoutBracketRounds = Partial<
  Record<MatchRound, BracketMatchData[]>
>;

export type KnockoutBracketResponse = {
  tournamentId: string;
  rounds: KnockoutBracketRounds;
};

export const BRACKET_ROUND_ORDER: MatchRound[] = [
  "round_32",
  "round_16",
  "quarter_final",
  "semi_final",
  "third_place",
  "final",
];

export const BRACKET_MAIN_ROUNDS: MatchRound[] = [
  "round_32",
  "round_16",
  "quarter_final",
  "semi_final",
  "final",
];
