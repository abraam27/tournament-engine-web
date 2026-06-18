import { apiClient } from "@/lib/api-client";
import { extractItem, extractList } from "@/lib/api-utils";

import type { Team } from "../types/team.types";

export async function getTeams(search?: string): Promise<Team[]> {
  const response = await apiClient.get("/teams", {
    params: search ? { search } : undefined,
  });

  return extractList<Team>(response.data);
}

export async function getTeamById(teamId: string): Promise<Team | null> {
  try {
    const response = await apiClient.get(`/teams/${teamId}`);
    return extractItem<Team>(response.data);
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
