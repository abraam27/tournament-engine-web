"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import type { MatchFilters } from "../types/match.types";

export function useMatchFilters(tournamentId: string | null) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const groupId = searchParams.get("groupId") ?? "all";
  const round = searchParams.get("round") ?? "all";
  const status = searchParams.get("status") ?? "all";

  const filters = useMemo<MatchFilters>(
    () => ({
      tournamentId: tournamentId ?? undefined,
      groupId: groupId !== "all" ? groupId : undefined,
      round: round !== "all" ? round : undefined,
      status: status !== "all" ? status : undefined,
    }),
    [groupId, round, status, tournamentId],
  );

  const updateFilter = useCallback(
    (key: "groupId" | "round" | "status", value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return {
    groupId,
    round,
    status,
    filters,
    setGroupId: (value: string) => updateFilter("groupId", value),
    setRound: (value: string) => updateFilter("round", value),
    setStatus: (value: string) => updateFilter("status", value),
  };
}
