"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  submitMatchResult,
  type MatchResultPayload,
} from "@/features/matches/api/matches.mutations";
import type { Match } from "@/features/matches/types/match.types";
import { getTeamName } from "@/lib/api-utils";

type SubmitResultDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match: Match | null;
  onSuccess: () => void;
};

export function SubmitResultDialog({
  open,
  onOpenChange,
  match,
  onSuccess,
}: SubmitResultDialogProps) {
  const { showError } = useAdminMessage();
  const isKnockout = match?.round !== "group";
  const isLocked =
    match?.status === "completed" || match?.status === "cancelled";

  const [form, setForm] = useState<MatchResultPayload>({
    homeScore: 0,
    awayScore: 0,
    hasExtraTime: false,
    hasPenalties: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (match) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset form when match changes
      setForm({
        homeScore: match.homeScore ?? 0,
        awayScore: match.awayScore ?? 0,
        hasExtraTime: match.hasExtraTime ?? false,
        extraTimeHomeScore: match.extraTimeHomeScore,
        extraTimeAwayScore: match.extraTimeAwayScore,
        hasPenalties: match.hasPenalties ?? false,
        penaltiesHomeScore: match.penaltiesHomeScore,
        penaltiesAwayScore: match.penaltiesAwayScore,
      });
    }
    setError(null);
  }, [match, open]);

  const mutation = useMutation({
    mutationFn: () => submitMatchResult(match!._id, form),
    onSuccess: () => {
      onSuccess();
      onOpenChange(false);
    },
    onError: (e) => showError(getErrorMessage(e)),
  });

  const handleSubmit = () => {
    if (form.homeScore < 0 || form.awayScore < 0) {
      setError("Scores must be >= 0");
      return;
    }
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Submit Result — Match {match?.matchNumber}
          </DialogTitle>
        </DialogHeader>
        {match && (
          <p className="text-sm text-muted-foreground">
            {getTeamName(match.homeTeamId)} vs {getTeamName(match.awayTeamId)}
          </p>
        )}
        {isLocked ? (
          <p className="text-sm text-destructive">
            This match is {match?.status} and cannot be updated.
          </p>
        ) : (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Home Score</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.homeScore}
                  onChange={(e) =>
                    setForm({ ...form, homeScore: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Away Score</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.awayScore}
                  onChange={(e) =>
                    setForm({ ...form, awayScore: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            {isKnockout && (
              <>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={form.hasExtraTime}
                    onCheckedChange={(c) =>
                      setForm({ ...form, hasExtraTime: !!c })
                    }
                  />
                  <Label>Extra Time</Label>
                </div>
                {form.hasExtraTime && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>ET Home</Label>
                      <Input
                        type="number"
                        min={0}
                        value={form.extraTimeHomeScore ?? ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            extraTimeHomeScore: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ET Away</Label>
                      <Input
                        type="number"
                        min={0}
                        value={form.extraTimeAwayScore ?? ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            extraTimeAwayScore: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={form.hasPenalties}
                    onCheckedChange={(c) =>
                      setForm({ ...form, hasPenalties: !!c })
                    }
                  />
                  <Label>Penalties</Label>
                </div>
                {form.hasPenalties && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>PEN Home</Label>
                      <Input
                        type="number"
                        min={0}
                        value={form.penaltiesHomeScore ?? ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            penaltiesHomeScore: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>PEN Away</Label>
                      <Input
                        type="number"
                        min={0}
                        value={form.penaltiesAwayScore ?? ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            penaltiesAwayScore: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="rounded-lg border bg-muted/30 p-3">
          <Button variant="outline" size="sm" disabled title="Reset result API is not implemented yet.">
            Reset Result
          </Button>
          <p className="mt-1 text-xs text-muted-foreground">
            Reset result API is not implemented yet.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLocked || mutation.isPending}
          >
            {mutation.isPending ? "Submitting..." : "Submit Result"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
