import { apiClient } from "@/lib/api-client";
import { extractItem } from "@/lib/api-utils";

import type { Confederation, Team } from "../types/team.types";

export type TeamPayload = {
  name: string;
  code: string;
  flagUrl?: string;
  confederation?: Confederation;
  fifaRanking?: number;
};

export async function createTeam(payload: TeamPayload): Promise<Team> {
  const response = await apiClient.post("/teams", payload);
  return extractItem<Team>(response.data) ?? response.data;
}

export async function updateTeam(
  id: string,
  payload: Partial<TeamPayload>,
): Promise<Team> {
  const response = await apiClient.patch(`/teams/${id}`, payload);
  return extractItem<Team>(response.data) ?? response.data;
}

export async function deleteTeam(id: string): Promise<void> {
  await apiClient.delete(`/teams/${id}`);
}
