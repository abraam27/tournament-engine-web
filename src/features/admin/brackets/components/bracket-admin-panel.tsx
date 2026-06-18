"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getErrorMessage,
  useAdminMessage,
} from "@/features/admin/lib/use-admin-message";
import {
  generateNextRound,
  generateRoundOf32,
  getKnockoutBracket,
} from "@/features/knockouts/api/knockouts.api";
import { getMatches } from "@/features/matches/api/matches.api";
import {
  MATCH_ROUND_LABELS,
  type MatchRound,
} from "@/features/matches/types/match.types";
import { TournamentSelector } from "@/features/tournaments/components/tournament-selector";
import { useSelectedTournament } from "@/features/tournaments/hooks/use-selected-tournament";

const KNOCKOUT_ROUNDS: MatchRound[] = [
  "round_32",
  "round_16",
  "quarter_final",
  "semi_final",
  "third_place",
  "final",
];

const NEXT_ROUND_OPTIONS: MatchRound[] = [
  "round_32",
  "round_16",
  "quarter_final",
  "semi_final",
];

export function BracketAdminPanel() {
  const queryClient = useQueryClient();
  const { showSuccess, showError, MessageAlert } = useAdminMessage();
  const {
    tournaments,
    selectedTournamentId,
    setSelectedTournamentId,
    isLoading: tournamentsLoading,
  } = useSelectedTournament();

  const [currentRound, setCurrentRound] = useState<MatchRound>("round_32");

  const { data: bracket } = useQuery({
    queryKey: ["knockout-bracket", selectedTournamentId],
    queryFn: () => getKnockoutBracket(selectedTournamentId!),
    enabled: !!selectedTournamentId,
  });

  const { data: matches = [] } = useQuery({
    queryKey: ["matches", { tournamentId: selectedTournamentId }],
    queryFn: () => getMatches({ tournamentId: selectedTournamentId! }),
    enabled: !!selectedTournamentId,
  });

  const roundOf32Mutation = useMutation({
    mutationFn: () => generateRoundOf32(selectedTournamentId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knockout-bracket"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      showSuccess("Round of 32 generated");
    },
    onError: (e) => showError(getErrorMessage(e)),
  });

  const nextRoundMutation = useMutation({
    mutationFn: () =>
      generateNextRound(selectedTournamentId!, currentRound),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knockout-bracket"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      showSuccess("Next round generated");
    },
    onError: (e) => showError(getErrorMessage(e)),
  });

  const roundStats = KNOCKOUT_ROUNDS.map((round) => {
    const roundMatches = matches.filter((m) => m.round === round);
    return {
      round,
      total: roundMatches.length,
      completed: roundMatches.filter((m) => m.status === "completed").length,
      scheduled: roundMatches.filter((m) => m.status === "scheduled").length,
    };
  });

  const groupStageComplete =
    matches.filter((m) => m.round === "group").length > 0 &&
    matches
      .filter((m) => m.round === "group")
      .every((m) => m.status === "completed");

  if (tournamentsLoading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      {MessageAlert}
      <TournamentSelector
        tournaments={tournaments}
        value={selectedTournamentId}
        onChange={setSelectedTournamentId}
      />

      {!selectedTournamentId ? (
        <p className="text-sm text-muted-foreground">Select a tournament.</p>
      ) : (
        <>
          {!groupStageComplete && (
            <Alert variant="destructive">
              <AlertDescription>
                Group stage may be incomplete. Round of 32 generation may fail
                until all group matches are completed.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generate Bracket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => roundOf32Mutation.mutate()}
                disabled={roundOf32Mutation.isPending}
              >
                {roundOf32Mutation.isPending
                  ? "Generating..."
                  : "Generate Round of 32"}
              </Button>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Current Round
                  </p>
                  <Select
                    value={currentRound}
                    onValueChange={(v) => v && setCurrentRound(v as MatchRound)}
                  >
                    <SelectTrigger className="w-full min-w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {NEXT_ROUND_OPTIONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {MATCH_ROUND_LABELS[r]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={() => nextRoundMutation.mutate()}
                  disabled={nextRoundMutation.isPending}
                >
                  {nextRoundMutation.isPending
                    ? "Generating..."
                    : "Generate Next Round"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bracket Status</CardTitle>
            </CardHeader>
            <CardContent>
              {bracket ? (
                <p className="mb-4 text-sm text-muted-foreground">
                  Bracket data loaded for tournament.
                </p>
              ) : (
                <p className="mb-4 text-sm text-muted-foreground">
                  No bracket generated yet.
                </p>
              )}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {roundStats.map((stat) => (
                  <div
                    key={stat.round}
                    className="rounded-lg border p-3"
                  >
                    <p className="font-medium">
                      {MATCH_ROUND_LABELS[stat.round]}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline">Total: {stat.total}</Badge>
                      <Badge variant="secondary">
                        Completed: {stat.completed}
                      </Badge>
                      <Badge variant="outline">
                        Scheduled: {stat.scheduled}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
