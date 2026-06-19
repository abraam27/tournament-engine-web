"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeftRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getErrorMessage,
  useAdminMessage,
} from "@/features/admin/lib/use-admin-message";
import {
  updateMatch,
  swapMatchTeams,
} from "@/features/matches/api/matches.mutations";
import type { Match } from "@/features/matches/types/match.types";
import { formatMatchDate } from "@/features/matches/lib/match-utils";
import {
  fromDatetimeLocalValue,
  toDatetimeLocalValue,
} from "@/lib/date-utils";
import { MatchTeamCell } from "./match-team-cell";

type EditScheduleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match: Match | null;
  onSuccess: (updated?: Match) => void;
};

export function EditScheduleDialog({
  open,
  onOpenChange,
  match,
  onSuccess,
}: EditScheduleDialogProps) {
  const { showError } = useAdminMessage();
  const [matchNumber, setMatchNumber] = useState(1);
  const [matchDate, setMatchDate] = useState("");
  const [stadium, setStadium] = useState("");
  const [homeTeam, setHomeTeam] = useState<Match["homeTeamId"]>("");
  const [awayTeam, setAwayTeam] = useState<Match["awayTeamId"]>("");
  const [error, setError] = useState<string | null>(null);

  const teamsLocked =
    match?.status === "completed" || match?.status === "cancelled";

  useEffect(() => {
    if (match) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset form when match changes
      setMatchNumber(match.matchNumber);
      setMatchDate(toDatetimeLocalValue(match.matchDate));
      setStadium(match.stadium ?? "");
      setHomeTeam(match.homeTeamId);
      setAwayTeam(match.awayTeamId);
      setError(null);
    }
  }, [match, open]);

  const mutation = useMutation({
    mutationFn: () => {
      const trimmedStadium = stadium.trim();

      return updateMatch(match!._id, {
        matchNumber,
        matchDate: matchDate ? fromDatetimeLocalValue(matchDate) : undefined,
        stadium: trimmedStadium || undefined,
      });
    },
    onSuccess: () => {
      onSuccess();
      onOpenChange(false);
    },
    onError: (e) => showError(getErrorMessage(e)),
  });

  const swapMutation = useMutation({
    mutationFn: () => swapMatchTeams(match!._id),
    onSuccess: (updated) => {
      setHomeTeam(updated.homeTeamId);
      setAwayTeam(updated.awayTeamId);
      onSuccess(updated);
    },
    onError: (e) => showError(getErrorMessage(e)),
  });

  const handleSubmit = () => {
    if (matchNumber < 1) {
      setError("Match number must be at least 1");
      return;
    }
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Match</DialogTitle>
        </DialogHeader>
        {match && (
          <div className="space-y-2 rounded-lg border bg-muted/30 p-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <MatchTeamCell team={homeTeam} side="home" />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="shrink-0"
                disabled={teamsLocked || swapMutation.isPending}
                title="Swap home and away"
                onClick={() => swapMutation.mutate()}
              >
                <ArrowLeftRight />
              </Button>
              <div className="min-w-0 flex-1">
                <MatchTeamCell team={awayTeam} side="away" />
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 border-t pt-2 text-xs text-muted-foreground">
              <span>
                <span className="font-medium text-foreground">Date:</span>{" "}
                {matchDate
                  ? formatMatchDate(fromDatetimeLocalValue(matchDate))
                  : formatMatchDate(match.matchDate)}
              </span>
              <span>
                <span className="font-medium text-foreground">Stadium:</span>{" "}
                {stadium.trim() || match.stadium || "—"}
              </span>
            </div>
          </div>
        )}
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="matchNumber">Match Number</Label>
            <Input
              id="matchNumber"
              type="number"
              min={1}
              value={matchNumber}
              onChange={(e) => setMatchNumber(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="matchDate">Match Date</Label>
            <Input
              id="matchDate"
              type="datetime-local"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stadium">Stadium</Label>
            <Input
              id="stadium"
              value={stadium}
              onChange={(e) => setStadium(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
