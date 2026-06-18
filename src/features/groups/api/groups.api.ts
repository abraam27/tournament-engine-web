import { apiClient } from "@/lib/api-client";
import { extractItem, extractList } from "@/lib/api-utils";

import type { Group, GroupTeam } from "../types/group.types";

export async function getGroups(params?: {
  tournamentId?: string;
}): Promise<Group[]> {
  const response = await apiClient.get("/groups", { params });
  return extractList<Group>(response.data);
}

export async function getGroupsByTournament(
  tournamentId: string,
): Promise<Group[]> {
  return getGroups({ tournamentId });
}

export async function getGroupById(groupId: string): Promise<Group | null> {
  try {
    const response = await apiClient.get(`/groups/${groupId}`);
    return extractItem<Group>(response.data);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status === 404
    ) {
      return null;
    }

    throw error;
  }
}

export async function getGroupTeams(groupId: string): Promise<GroupTeam[]> {
  const response = await apiClient.get(`/groups/${groupId}/teams`);
  return extractList<GroupTeam>(response.data);
}
