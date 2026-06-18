import type { Team } from "@/features/teams/types/team.types";

export function extractList<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (Array.isArray(record.data)) {
      return record.data as T[];
    }

    if (Array.isArray(record.items)) {
      return record.items as T[];
    }

    if (Array.isArray(record.results)) {
      return record.results as T[];
    }
  }

  return [];
}

export function extractItem<T>(data: unknown): T | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;

  if ("data" in record && record.data && typeof record.data === "object") {
    return record.data as T;
  }

  return data as T;
}

export function getTeamId(team: string | Team): string {
  return typeof team === "string" ? team : team._id;
}

export function getTeamLabel(team: string | Team | undefined | null): string {
  return getTeamName(team === null ? undefined : team);
}

export function getTeamName(team: string | Team | undefined | null): string {
  if (!team) {
    return "Unknown Team";
  }

  if (typeof team === "string") {
    return team;
  }

  return team.name ?? team.code ?? "Unknown Team";
}

export function getTeamCode(team: string | Team | undefined | null): string {
  if (!team) {
    return "—";
  }

  if (typeof team === "string") {
    return team.slice(0, 3).toUpperCase();
  }

  return team.code ?? "—";
}

export function formatDate(value?: string): string {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
