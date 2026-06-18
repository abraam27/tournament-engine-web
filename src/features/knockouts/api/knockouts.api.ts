import { apiClient } from "@/lib/api-client";
import { extractItem } from "@/lib/api-utils";

import type { MatchRound } from "@/features/matches/types/match.types";

export type KnockoutBracket = {
  tournamentId?: string;
  rounds?: BracketRound[];
  [key: string]: unknown;
};

export type BracketRound = {
  round?: string;
  matches?: unknown[];
  scheduled?: number;
  completed?: number;
  total?: number;
};

export async function getKnockoutBracket(
  tournamentId: string,
): Promise<KnockoutBracket | null> {
  try {
    const response = await apiClient.get(
      `/knockouts/tournaments/${tournamentId}/bracket`,
    );
    return extractItem<KnockoutBracket>(response.data) ?? response.data;
  } catch {
    return null;
  }
}

export async function getBracketRound(
  tournamentId: string,
  round: string,
): Promise<unknown> {
  const response = await apiClient.get(
    `/brackets/tournaments/${tournamentId}/rounds/${round}`,
  );
  return response.data;
}

export async function generateRoundOf32(
  tournamentId: string,
): Promise<unknown> {
  const response = await apiClient.post(
    `/brackets/tournaments/${tournamentId}/round-of-32`,
  );
  return response.data;
}

export async function generateNextRound(
  tournamentId: string,
  currentRound: MatchRound | string,
): Promise<unknown> {
  const response = await apiClient.post(
    `/knockouts/tournaments/${tournamentId}/generate-next-round`,
    { currentRound },
  );
  return response.data;
}
