import { apiClient } from "@/lib/api-client";
import { extractItem, extractList } from "@/lib/api-utils";

import type { Match, MatchFilters } from "../types/match.types";

function buildMatchParams(filters?: MatchFilters) {
  if (!filters) {
    return undefined;
  }

  const params: Record<string, string> = {};

  if (filters.tournamentId) {
    params.tournamentId = filters.tournamentId;
  }

  if (filters.groupId) {
    params.groupId = filters.groupId;
  }

  if (filters.round && filters.round !== "all") {
    params.round = filters.round;
  }

  if (filters.status && filters.status !== "all") {
    params.status = filters.status;
  }

  return Object.keys(params).length > 0 ? params : undefined;
}

export async function getMatches(filters?: MatchFilters): Promise<Match[]> {
  const response = await apiClient.get("/matches", {
    params: buildMatchParams(filters),
  });

  return extractList<Match>(response.data);
}

export async function getMatchById(matchId: string): Promise<Match | null> {
  try {
    const response = await apiClient.get(`/matches/${matchId}`);
    return extractItem<Match>(response.data);
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

export async function getMatchesByTournament(
  tournamentId: string,
): Promise<Match[]> {
  return getMatches({ tournamentId });
}

export async function getGroupMatches(groupId: string): Promise<Match[]> {
  try {
    const response = await apiClient.get(`/matches/group/${groupId}`);
    return extractList<Match>(response.data);
  } catch {
    return getMatches({ groupId });
  }
}
