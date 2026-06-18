import type { Team } from "@/features/teams/types/team.types";
import type { Group } from "@/features/groups/types/group.types";

export type StandingRow = {
  teamId: string;
  team?: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  rank: number;
};

export type GroupStandingsResponse = {
  groupId: string;
  group?: Group;
  standings: StandingRow[];
};

export type TournamentStandingsResponse = {
  tournamentId: string;
  groups: GroupStandingsResponse[];
};

/** @deprecated Use StandingRow for Phase 3 standings views */
export type Standing = {
  _id?: string;
  tournamentId?: string;
  groupId?: string;
  teamId?: string;
  played?: number;
  won?: number;
  drawn?: number;
  lost?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  goalDifference?: number;
  points?: number;
  position?: number;
};
