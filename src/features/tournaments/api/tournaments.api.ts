import { apiClient } from "@/lib/api-client";
import { extractItem, extractList } from "@/lib/api-utils";

import type { Tournament } from "../types/tournament.types";

export async function getTournaments(): Promise<Tournament[]> {
  const response = await apiClient.get("/tournaments");
  return extractList<Tournament>(response.data);
}

export async function getTournamentById(
  tournamentId: string,
): Promise<Tournament | null> {
  try {
    const response = await apiClient.get(`/tournaments/${tournamentId}`);
    return extractItem<Tournament>(response.data);
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
