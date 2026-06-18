import type { Group } from "@/features/groups/types/group.types";
import type { Team } from "@/features/teams/types/team.types";

export type MatchStatus = "scheduled" | "live" | "completed" | "cancelled";

export type MatchRound =
  | "group"
  | "round_32"
  | "round_16"
  | "quarter_final"
  | "semi_final"
  | "third_place"
  | "final";

export type Match = {
  _id: string;
  tournamentId: string;
  stageId?: string;
  groupId?: string | Group;
  round: MatchRound | string;
  matchNumber: number;
  homeTeamId: string | Team;
  awayTeamId: string | Team;
  homeScore?: number;
  awayScore?: number;
  status: MatchStatus;
  matchDate?: string;
  stadium?: string;
  winnerTeamId?: string | Team;
  loserTeamId?: string | Team;
  hasExtraTime?: boolean;
  extraTimeHomeScore?: number;
  extraTimeAwayScore?: number;
  hasPenalties?: boolean;
  penaltiesHomeScore?: number;
  penaltiesAwayScore?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type MatchFilters = {
  tournamentId?: string;
  groupId?: string;
  round?: string;
  status?: string;
};

export const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
  scheduled: "Scheduled",
  live: "Live",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const MATCH_ROUND_LABELS: Record<MatchRound, string> = {
  group: "Group Stage",
  round_32: "Round of 32",
  round_16: "Round of 16",
  quarter_final: "Quarter Final",
  semi_final: "Semi Final",
  third_place: "Third Place",
  final: "Final",
};

export const MATCH_ROUND_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Rounds" },
  { value: "group", label: "Group Stage" },
  { value: "round_32", label: "Round of 32" },
  { value: "round_16", label: "Round of 16" },
  { value: "quarter_final", label: "Quarter Final" },
  { value: "semi_final", label: "Semi Final" },
  { value: "third_place", label: "Third Place" },
  { value: "final", label: "Final" },
];

export const MATCH_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "scheduled", label: "Scheduled" },
  { value: "live", label: "Live" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];
