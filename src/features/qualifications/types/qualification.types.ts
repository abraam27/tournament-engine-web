import type { Team } from "@/features/teams/types/team.types";

export type QualificationType = "group_rank" | "best_third";

export type QualifiedTeam = {
  sourceRef: string;
  qualificationType: QualificationType;
  originalGroupSourceRef?: string;
  groupId?: string;
  groupCode?: string;
  rank?: number;
  teamId: string;
  team?: Team;
  points?: number;
  goalDifference?: number;
  goalsFor?: number;
  thirdPlaceRank?: number;
};

export type QualifiedTeamsResponse = {
  tournamentId: string;
  totalQualified: number;
  automaticQualified: QualifiedTeam[];
  bestThirdQualified: QualifiedTeam[];
  qualifiedMap: Record<string, string>;
};

export type ThirdPlaceRankingRow = {
  thirdPlaceRank: number;
  qualified: boolean;
  originalGroupSourceRef: string;
  groupId?: string;
  groupCode?: string;
  teamId: string;
  team?: Team;
  points: number;
  goalDifference: number;
  goalsFor: number;
};

export type ThirdPlaceRankingResponse = {
  tournamentId: string;
  ranking: ThirdPlaceRankingRow[];
};

export const QUALIFICATION_SLOT_TARGET = 32;
export const THIRD_PLACE_QUALIFICATION_CUTOFF = 8;
