import type { Group } from "@/features/groups/types/group.types";
import type { Team } from "@/features/teams/types/team.types";

import {
  MATCH_ROUND_LABELS,
  type Match,
  type MatchRound,
} from "../types/match.types";

export function getTeamFlag(
  team: string | Team | undefined | null,
): string | undefined {
  if (!team || typeof team === "string") {
    return undefined;
  }

  return team.flagUrl;
}

export function getGroupName(
  group: string | Group | undefined | null,
): string {
  if (!group) {
    return "—";
  }

  if (typeof group === "string") {
    return group;
  }

  return group.name ?? `Group ${group.code}`;
}

export function formatRound(round: string): string {
  if (round in MATCH_ROUND_LABELS) {
    return MATCH_ROUND_LABELS[round as MatchRound];
  }

  return round
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatMatchDate(date?: string): string {
  if (!date) {
    return "—";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isCompletedMatch(match: Pick<Match, "status">): boolean {
  return match.status === "completed";
}

export function hasScore(
  match: Pick<Match, "homeScore" | "awayScore" | "status">,
): boolean {
  return (
    match.status === "completed" ||
    match.status === "live" ||
    match.homeScore !== undefined ||
    match.awayScore !== undefined
  );
}

export function isDraw(match: Match): boolean {
  if (!isCompletedMatch(match)) {
    return false;
  }

  if (match.winnerTeamId) {
    return false;
  }

  if (match.homeScore !== undefined && match.awayScore !== undefined) {
    return match.homeScore === match.awayScore;
  }

  return false;
}
