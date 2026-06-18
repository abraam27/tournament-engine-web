"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftRight } from "lucide-react";
import { Suspense, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDeleteDialog } from "@/features/admin/components/confirm-delete-dialog";
import {
  getErrorMessage,
  useAdminMessage,
} from "@/features/admin/lib/use-admin-message";
import { getGroups } from "@/features/groups/api/groups.api";
import { getMatches } from "@/features/matches/api/matches.api";
import { deleteMatch, swapMatchTeams } from "@/features/matches/api/matches.mutations";
import { MatchesFilters } from "@/features/matches/components/matches-filters";
import { MatchScore } from "@/features/matches/components/match-score";
import { MatchStatusBadge } from "@/features/matches/components/match-status-badge";
import { useMatchFilters } from "@/features/matches/hooks/use-match-filters";
import { formatMatchDate, formatRound } from "@/features/matches/lib/match-utils";
import type { Match } from "@/features/matches/types/match.types";
import { useSelectedTournament } from "@/features/tournaments/hooks/use-selected-tournament";

import { EditScheduleDialog } from "./edit-schedule-dialog";
import { GenerateFixturesCard } from "./generate-fixtures-card";
import { MatchTeamCell } from "./match-team-cell";
import { SubmitResultDialog } from "./submit-result-dialog";

const TEAM_COLUMN_CLASS = "w-48";

function MatchesManagementInner() {
  const queryClient = useQueryClient();
  const { showSuccess, showError, MessageAlert } = useAdminMessage();
  const {
    tournaments,
    selectedTournamentId,
    setSelectedTournamentId,
    isLoading: tournamentsLoading,
  } = useSelectedTournament();

  const { groupId, round, status, filters, setGroupId, setRound, setStatus } =
    useMatchFilters(selectedTournamentId);

  const { data: groups = [] } = useQuery({
    queryKey: ["groups", selectedTournamentId],
    queryFn: () => getGroups({ tournamentId: selectedTournamentId! }),
    enabled: !!selectedTournamentId,
  });

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ["matches", filters],
    queryFn: () => getMatches(filters),
    enabled: !!selectedTournamentId,
  });

  const [scheduleMatch, setScheduleMatch] = useState<Match | null>(null);
  const [resultMatch, setResultMatch] = useState<Match | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Match | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      showSuccess("Match deleted");
      setDeleteTarget(null);
    },
    onError: (e) => showError(getErrorMessage(e)),
  });

  const swapMutation = useMutation({
    mutationFn: (id: string) => swapMatchTeams(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      setScheduleMatch((current) =>
        current?._id === updated._id ? updated : current,
      );
      showSuccess("Home and away teams swapped");
    },
    onError: (e) => showError(getErrorMessage(e)),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["matches"] });

  if (tournamentsLoading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      {MessageAlert}
      <MatchesFilters
        tournaments={tournaments}
        selectedTournamentId={selectedTournamentId}
        onTournamentChange={setSelectedTournamentId}
        groups={groups}
        groupId={groupId}
        round={round}
        status={status}
        onGroupChange={setGroupId}
        onRoundChange={setRound}
        onStatusChange={setStatus}
      />
      <GenerateFixturesCard
        tournamentId={selectedTournamentId}
        groups={groups}
      />
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading matches...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Round</TableHead>
                <TableHead className={TEAM_COLUMN_CLASS}>Home</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className={`${TEAM_COLUMN_CLASS} text-right`}>Away</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Stadium</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match._id}>
                  <TableCell>{match.matchNumber}</TableCell>
                  <TableCell>{formatRound(match.round)}</TableCell>
                  <TableCell className={TEAM_COLUMN_CLASS}>
                    <MatchTeamCell team={match.homeTeamId} />
                  </TableCell>
                  <TableCell>
                    <MatchScore match={match} />
                  </TableCell>
                  <TableCell className={`${TEAM_COLUMN_CLASS} text-right`}>
                    <MatchTeamCell team={match.awayTeamId} align="right" />
                  </TableCell>
                  <TableCell>
                    <MatchStatusBadge status={match.status} />
                  </TableCell>
                  <TableCell>{formatMatchDate(match.matchDate)}</TableCell>
                  <TableCell>{match.stadium ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={
                          match.status === "completed" ||
                          match.status === "cancelled" ||
                          swapMutation.isPending
                        }
                        title="Swap home and away"
                        onClick={() => swapMutation.mutate(match._id)}
                      >
                        <ArrowLeftRight />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setScheduleMatch(match)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={
                          match.status === "completed" ||
                          match.status === "cancelled"
                        }
                        onClick={() => setResultMatch(match)}
                      >
                        Result
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteTarget(match)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <EditScheduleDialog
        open={!!scheduleMatch}
        onOpenChange={(o) => !o && setScheduleMatch(null)}
        match={scheduleMatch}
        onSuccess={(updated) => {
          invalidate();
          if (updated) {
            setScheduleMatch(updated);
            showSuccess("Home and away teams swapped");
          } else {
            showSuccess("Match updated");
          }
        }}
      />
      <SubmitResultDialog
        open={!!resultMatch}
        onOpenChange={(o) => !o && setResultMatch(null)}
        match={resultMatch}
        onSuccess={() => {
          invalidate();
          showSuccess("Result submitted");
        }}
      />
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete match?"
        description={`Delete match ${deleteTarget?.matchNumber}?`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
      />
    </div>
  );
}

export function MatchesManagementTable() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
      <MatchesManagementInner />
    </Suspense>
  );
}
