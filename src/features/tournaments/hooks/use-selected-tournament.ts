"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { getTournaments } from "@/features/tournaments/api/tournaments.api";
import type { Tournament } from "@/features/tournaments/types/tournament.types";
import { useMounted } from "@/lib/hooks/use-mounted";

export function useSelectedTournament() {
  const mounted = useMounted();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const queryTournamentId = searchParams.get("tournamentId");

  const query = useQuery({
    queryKey: ["tournaments"],
    queryFn: getTournaments,
    enabled: mounted,
  });

  const tournaments = useMemo(
    () => [...(query.data ?? [])].sort((a, b) => b.year - a.year),
    [query.data],
  );

  const selectedTournament = useMemo((): Tournament | null => {
    if (tournaments.length === 0) {
      return null;
    }

    if (queryTournamentId) {
      return (
        tournaments.find((t) => t._id === queryTournamentId) ?? tournaments[0]
      );
    }

    return tournaments[0];
  }, [queryTournamentId, tournaments]);

  const setSelectedTournamentId = useCallback(
    (tournamentId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tournamentId", tournamentId);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return {
    mounted,
    tournaments,
    selectedTournament,
    selectedTournamentId: selectedTournament?._id ?? null,
    setSelectedTournamentId,
    isLoading: !mounted || query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
