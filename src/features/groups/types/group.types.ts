import type { Team } from "@/features/teams/types/team.types";

export type GroupStatus = "pending" | "in_progress" | "completed";

export type Group = {
  _id: string;
  tournamentId: string;
  name: string;
  code: string;
  status: GroupStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type GroupTeam = {
  _id: string;
  tournamentId: string;
  groupId: string;
  teamId: string | Team;
  seed?: number;
};

export const GROUP_STATUS_LABELS: Record<GroupStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};
