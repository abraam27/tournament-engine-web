import type { Team } from "@/features/teams/types/team.types";

import type {
  QualifiedTeam,
  QualificationType,
} from "../types/qualification.types";

export function formatQualificationType(type: string): string {
  switch (type) {
    case "group_rank":
      return "Group Rank";
    case "best_third":
      return "Best Third Place";
    default:
      return type
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
  }
}

export function formatSourceRef(sourceRef: string): string {
  const bestThirdMatch = sourceRef.match(/^BEST_THIRD_(\d+)$/i);
  if (bestThirdMatch) {
    return `Best third-place #${bestThirdMatch[1]}`;
  }

  const groupMatch = sourceRef.match(/^([A-Z])(\d+)$/);
  if (groupMatch) {
    const [, letter, rank] = groupMatch;
    const rankNum = Number(rank);

    if (rankNum === 1) return `Group ${letter} Winner`;
    if (rankNum === 2) return `Group ${letter} Runner-up`;
    if (rankNum === 3) return `Group ${letter} third-place`;
    return `Group ${letter} Rank ${rank}`;
  }

  return sourceRef;
}

export function displayNumber(value?: number): number {
  return value ?? 0;
}

export function resolveTeam(
  teamId: string,
  team?: Team,
): string | Team | undefined {
  return team ?? teamId;
}

export function sortBySourceRef(a: QualifiedTeam, b: QualifiedTeam): number {
  return a.sourceRef.localeCompare(b.sourceRef, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export function sortByThirdPlaceRank(
  a: QualifiedTeam,
  b: QualifiedTeam,
): number {
  return (a.thirdPlaceRank ?? Infinity) - (b.thirdPlaceRank ?? Infinity);
}

export function isQualificationType(
  value: unknown,
): value is QualificationType {
  return value === "group_rank" || value === "best_third";
}
