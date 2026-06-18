import { apiClient } from "@/lib/api-client";
import { extractItem } from "@/lib/api-utils";

import type { Tournament, TournamentStatus } from "../types/tournament.types";

export type TournamentPayload = {
  name: string;
  year: number;
  status: TournamentStatus;
  teamsCount: number;
  groupsCount: number;
  teamsPerGroup: number;
  qualifiedPerGroup: number;
  bestThirdCount: number;
};

export async function createTournament(
  payload: TournamentPayload,
): Promise<Tournament> {
  const response = await apiClient.post("/tournaments", payload);
  return extractItem<Tournament>(response.data) ?? response.data;
}

export async function updateTournament(
  id: string,
  payload: Partial<TournamentPayload>,
): Promise<Tournament> {
  const response = await apiClient.patch(`/tournaments/${id}`, payload);
  return extractItem<Tournament>(response.data) ?? response.data;
}

export async function deleteTournament(id: string): Promise<void> {
  await apiClient.delete(`/tournaments/${id}`);
}
