import { apiClient } from "@/lib/api-client";
import { extractItem } from "@/lib/api-utils";

import type { MatchRound } from "@/features/matches/types/match.types";

import { parseKnockoutBracket } from "../lib/bracket-utils";
import type { KnockoutBracketResponse } from "../types/bracket.types";

export type { BracketMatchData, KnockoutBracketResponse } from "../types/bracket.types";

export async function getKnockoutBracket(
  tournamentId: string,
): Promise<KnockoutBracketResponse | null> {
  try {
    const response = await apiClient.get(
      `/knockouts/tournaments/${tournamentId}/bracket`,
    );
    return parseKnockoutBracket(response.data);
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
  return extractItem(response.data) ?? response.data;
}
