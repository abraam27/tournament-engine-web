import { apiClient } from "@/lib/api-client";
import { extractList } from "@/lib/api-utils";
import type { Group } from "@/features/groups/types/group.types";
import type { Team } from "@/features/teams/types/team.types";

import type {
  GroupStandingsResponse,
  StandingRow,
  TournamentStandingsResponse,
} from "../types/standing.types";

function normalizeStandingRow(raw: unknown, index: number): StandingRow {
  const record = (raw ?? {}) as Record<string, unknown>;
  const teamField = record.team ?? record.teamId;

  let teamId = "";
  let team: Team | undefined;

  if (typeof teamField === "string") {
    teamId = teamField;
  } else if (teamField && typeof teamField === "object") {
    const teamObj = teamField as Team;
    teamId = teamObj._id;
    team = teamObj;
  } else if (record.teamId) {
    teamId = String(record.teamId);
  }

  const goalsFor = Number(record.goalsFor ?? 0);
  const goalsAgainst = Number(record.goalsAgainst ?? 0);

  return {
    teamId,
    team,
    played: Number(record.played ?? 0),
    won: Number(record.won ?? 0),
    drawn: Number(record.drawn ?? 0),
    lost: Number(record.lost ?? 0),
    goalsFor,
    goalsAgainst,
    goalDifference: Number(
      record.goalDifference ?? goalsFor - goalsAgainst,
    ),
    points: Number(record.points ?? 0),
    rank: Number(record.rank ?? record.position ?? index + 1),
  };
}

function isGroup(value: unknown): value is Group {
  return (
    !!value &&
    typeof value === "object" &&
    "_id" in value &&
    "code" in value &&
    "name" in value
  );
}

export function parseGroupStandingsResponse(
  data: unknown,
  fallbackGroupId?: string,
): GroupStandingsResponse {
  if (Array.isArray(data)) {
    const standings = data
      .map((row, index) => normalizeStandingRow(row, index))
      .sort((a, b) => a.rank - b.rank);

    return {
      groupId: fallbackGroupId ?? "",
      standings,
    };
  }

  if (!data || typeof data !== "object") {
    return { groupId: fallbackGroupId ?? "", standings: [] };
  }

  const record = data as Record<string, unknown>;
  const standingsRaw = record.standings ?? record.data ?? [];
  const standings = extractList<unknown>(standingsRaw)
    .map((row, index) => normalizeStandingRow(row, index))
    .sort((a, b) => a.rank - b.rank);

  const embeddedGroup = isGroup(record.group)
    ? record.group
    : isGroup(record)
      ? (record as unknown as Group)
      : undefined;

  return {
    groupId: String(
      record.groupId ?? embeddedGroup?._id ?? fallbackGroupId ?? "",
    ),
    group: embeddedGroup,
    standings,
  };
}

export async function getGroupStandings(
  groupId: string,
): Promise<GroupStandingsResponse> {
  const response = await apiClient.get(`/standings/group/${groupId}`);
  return parseGroupStandingsResponse(response.data, groupId);
}

export async function getTournamentStandings(
  tournamentId: string,
): Promise<TournamentStandingsResponse> {
  const response = await apiClient.get(
    `/standings/tournament/${tournamentId}`,
  );
  const data = response.data;

  if (data && typeof data === "object" && "groups" in data) {
    const record = data as { tournamentId?: string; groups: unknown };
    const groups = extractList<unknown>(record.groups).map((group) =>
      parseGroupStandingsResponse(group),
    );

    return {
      tournamentId: String(record.tournamentId ?? tournamentId),
      groups,
    };
  }

  const rows = extractList<Record<string, unknown>>(data);
  const grouped = new Map<string, Record<string, unknown>[]>();

  for (const row of rows) {
    const groupId = String(row.groupId ?? "unknown");
    const existing = grouped.get(groupId) ?? [];
    existing.push(row);
    grouped.set(groupId, existing);
  }

  const groups: GroupStandingsResponse[] = [];

  grouped.forEach((items, groupId) => {
    groups.push(
      parseGroupStandingsResponse({ groupId, standings: items }, groupId),
    );
  });

  groups.sort((a, b) =>
    (a.group?.code ?? a.groupId).localeCompare(b.group?.code ?? b.groupId),
  );

  return { tournamentId, groups };
}
