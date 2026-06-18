import { apiClient } from "@/lib/api-client";
import { extractList } from "@/lib/api-utils";
import type { Team } from "@/features/teams/types/team.types";

import { isQualificationType } from "../lib/qualification-utils";
import type {
  QualifiedTeam,
  QualifiedTeamsResponse,
  ThirdPlaceRankingResponse,
  ThirdPlaceRankingRow,
} from "../types/qualification.types";

function normalizeTeamField(
  teamField: unknown,
  teamId: string,
): { teamId: string; team?: Team } {
  if (teamField && typeof teamField === "object") {
    const team = teamField as Team;
    return { teamId: team._id ?? teamId, team };
  }

  return { teamId: teamId || String(teamField ?? "") };
}

function normalizeQualifiedTeam(raw: unknown): QualifiedTeam {
  const record = (raw ?? {}) as Record<string, unknown>;
  const teamField = record.team ?? record.teamId;
  const teamId =
    typeof teamField === "string"
      ? teamField
      : String(record.teamId ?? (teamField as Team)?._id ?? "");

  const { teamId: resolvedTeamId, team } = normalizeTeamField(teamField, teamId);

  const qualificationType = isQualificationType(record.qualificationType)
    ? record.qualificationType
    : record.thirdPlaceRank !== undefined || record.originalGroupSourceRef
      ? "best_third"
      : "group_rank";

  return {
    sourceRef: String(record.sourceRef ?? record.source ?? ""),
    qualificationType,
    originalGroupSourceRef: record.originalGroupSourceRef
      ? String(record.originalGroupSourceRef)
      : undefined,
    groupId: record.groupId ? String(record.groupId) : undefined,
    groupCode: record.groupCode ? String(record.groupCode) : undefined,
    rank: record.rank !== undefined ? Number(record.rank) : undefined,
    teamId: resolvedTeamId,
    team,
    points: record.points !== undefined ? Number(record.points) : undefined,
    goalDifference:
      record.goalDifference !== undefined
        ? Number(record.goalDifference)
        : undefined,
    goalsFor:
      record.goalsFor !== undefined ? Number(record.goalsFor) : undefined,
    thirdPlaceRank:
      record.thirdPlaceRank !== undefined
        ? Number(record.thirdPlaceRank)
        : undefined,
  };
}

function normalizeThirdPlaceRow(raw: unknown, index: number): ThirdPlaceRankingRow {
  const record = (raw ?? {}) as Record<string, unknown>;
  const teamField = record.team ?? record.teamId;
  const teamId =
    typeof teamField === "string"
      ? teamField
      : String(record.teamId ?? (teamField as Team)?._id ?? "");

  const { teamId: resolvedTeamId, team } = normalizeTeamField(teamField, teamId);

  return {
    thirdPlaceRank: Number(record.thirdPlaceRank ?? record.rank ?? index + 1),
    qualified: Boolean(record.qualified),
    originalGroupSourceRef: String(
      record.originalGroupSourceRef ?? record.sourceRef ?? "",
    ),
    groupId: record.groupId ? String(record.groupId) : undefined,
    groupCode: record.groupCode ? String(record.groupCode) : undefined,
    teamId: resolvedTeamId,
    team,
    points: Number(record.points ?? 0),
    goalDifference: Number(record.goalDifference ?? 0),
    goalsFor: Number(record.goalsFor ?? 0),
  };
}

export function parseQualifiedTeamsResponse(
  data: unknown,
  tournamentId: string,
): QualifiedTeamsResponse {
  if (!data || typeof data !== "object") {
    return {
      tournamentId,
      totalQualified: 0,
      automaticQualified: [],
      bestThirdQualified: [],
      qualifiedMap: {},
    };
  }

  const record = data as Record<string, unknown>;

  if (Array.isArray(data)) {
    const items = data.map(normalizeQualifiedTeam);
    const automaticQualified = items.filter(
      (item) => item.qualificationType === "group_rank",
    );
    const bestThirdQualified = items.filter(
      (item) => item.qualificationType === "best_third",
    );

    return {
      tournamentId,
      totalQualified: items.length,
      automaticQualified,
      bestThirdQualified,
      qualifiedMap: {},
    };
  }

  const automaticRaw =
    record.automaticQualified ?? record.automatic ?? record.groupQualified;
  const bestThirdRaw =
    record.bestThirdQualified ?? record.bestThird ?? record.thirdPlaceQualified;

  let automaticQualified = extractList<unknown>(automaticRaw).map(
    normalizeQualifiedTeam,
  );
  let bestThirdQualified = extractList<unknown>(bestThirdRaw).map(
    normalizeQualifiedTeam,
  );

  if (automaticQualified.length === 0 && bestThirdQualified.length === 0) {
    const all = extractList<unknown>(record.qualifiedTeams ?? record.data ?? []);
    if (all.length > 0) {
      const items = all.map(normalizeQualifiedTeam);
      automaticQualified = items.filter(
        (item) => item.qualificationType === "group_rank",
      );
      bestThirdQualified = items.filter(
        (item) => item.qualificationType === "best_third",
      );
    }
  }

  const totalQualified = Number(
    record.totalQualified ??
      automaticQualified.length + bestThirdQualified.length,
  );

  const qualifiedMap =
    record.qualifiedMap && typeof record.qualifiedMap === "object"
      ? (record.qualifiedMap as Record<string, string>)
      : {};

  return {
    tournamentId: String(record.tournamentId ?? tournamentId),
    totalQualified,
    automaticQualified,
    bestThirdQualified,
    qualifiedMap,
  };
}

export function parseThirdPlaceRankingResponse(
  data: unknown,
  tournamentId: string,
): ThirdPlaceRankingResponse {
  if (!data || typeof data !== "object") {
    return { tournamentId, ranking: [] };
  }

  const record = data as Record<string, unknown>;
  const rankingRaw = record.ranking ?? record.data ?? data;

  const ranking = extractList<unknown>(rankingRaw)
    .map((row, index) => normalizeThirdPlaceRow(row, index))
    .sort((a, b) => a.thirdPlaceRank - b.thirdPlaceRank);

  return {
    tournamentId: String(record.tournamentId ?? tournamentId),
    ranking,
  };
}

export async function getQualifiedTeams(
  tournamentId: string,
): Promise<QualifiedTeamsResponse> {
  const response = await apiClient.get(
    `/qualifications/tournaments/${tournamentId}/qualified-teams`,
  );

  return parseQualifiedTeamsResponse(response.data, tournamentId);
}

export async function getThirdPlaceRanking(
  tournamentId: string,
): Promise<ThirdPlaceRankingResponse> {
  const response = await apiClient.get(
    `/qualifications/tournaments/${tournamentId}/third-place-ranking`,
  );

  const parsed = parseThirdPlaceRankingResponse(response.data, tournamentId);
  return parsed;
}
