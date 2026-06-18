import { apiClient } from "@/lib/api-client";
import { extractItem } from "@/lib/api-utils";

import type { Group, GroupStatus, GroupTeam } from "../types/group.types";

export type GroupPayload = {
  tournamentId: string;
  name: string;
  code: string;
  status: GroupStatus;
};

export type AssignTeamPayload = {
  teamId: string;
  seed?: number;
};

export async function createGroup(payload: GroupPayload): Promise<Group> {
  const response = await apiClient.post("/groups", payload);
  return extractItem<Group>(response.data) ?? response.data;
}

export async function updateGroup(
  id: string,
  payload: Partial<Omit<GroupPayload, "tournamentId">>,
): Promise<Group> {
  const response = await apiClient.patch(`/groups/${id}`, payload);
  return extractItem<Group>(response.data) ?? response.data;
}

export async function deleteGroup(id: string): Promise<void> {
  await apiClient.delete(`/groups/${id}`);
}

export async function assignTeamToGroup(
  groupId: string,
  payload: AssignTeamPayload,
): Promise<GroupTeam> {
  const response = await apiClient.post(`/groups/${groupId}/teams`, payload);
  return extractItem<GroupTeam>(response.data) ?? response.data;
}

export async function removeTeamFromGroup(
  groupId: string,
  teamId: string,
): Promise<void> {
  await apiClient.delete(`/groups/${groupId}/teams/${teamId}`);
}
