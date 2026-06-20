import { apiClient } from "@/lib/api-client";
import { extractItem } from "@/lib/api-utils";

import type { Match } from "../types/match.types";

export type MatchUpdatePayload = {
  matchNumber?: number;
  matchDate?: string;
  stadium?: string;
  homeTeamId?: string;
  awayTeamId?: string;
};

export type MatchResultPayload = {
  homeScore: number;
  awayScore: number;
  hasExtraTime?: boolean;
  extraTimeHomeScore?: number;
  extraTimeAwayScore?: number;
  hasPenalties?: boolean;
  penaltiesHomeScore?: number;
  penaltiesAwayScore?: number;
};

export async function generateGroupFixtures(
  groupId: string,
): Promise<Match[]> {
  const response = await apiClient.post(
    `/matches/generate/group/${groupId}`,
  );
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
}

export async function generateTournamentGroupStageFixtures(
  tournamentId: string,
): Promise<Match[]> {
  const response = await apiClient.post(
    `/matches/generate/tournament/${tournamentId}/group-stage`,
  );
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
}

export async function updateMatch(
  id: string,
  payload: MatchUpdatePayload,
): Promise<Match> {
  const response = await apiClient.patch(`/matches/${id}`, payload);
  return extractItem<Match>(response.data) ?? response.data;
}

export async function swapMatchTeams(id: string): Promise<Match> {
  const response = await apiClient.patch(`/matches/${id}/swap-teams`);
  return extractItem<Match>(response.data) ?? response.data;
}

export async function updateMatchSchedule(
  id: string,
  payload: MatchUpdatePayload,
): Promise<Match> {
  try {
    const response = await apiClient.patch(`/matches/${id}/schedule`, payload);
    return extractItem<Match>(response.data) ?? response.data;
  } catch {
    return updateMatch(id, payload);
  }
}

export async function submitMatchResult(
  id: string,
  payload: MatchResultPayload,
): Promise<Match> {
  const response = await apiClient.post(`/matches/${id}/result`, payload);
  return extractItem<Match>(response.data) ?? response.data;
}

export async function resetMatchResult(id: string): Promise<Match> {
  const response = await apiClient.delete(`/matches/${id}/result`);
  return extractItem<Match>(response.data) ?? response.data;
}

export async function deleteMatch(id: string): Promise<void> {
  await apiClient.delete(`/matches/${id}`);
}
