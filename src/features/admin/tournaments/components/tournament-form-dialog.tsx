"use client";

import { useEffect, useState } from "react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tournament } from "@/features/tournaments/types/tournament.types";
import {
  TOURNAMENT_STATUS_LABELS,
  type TournamentStatus,
} from "@/features/tournaments/types/tournament.types";
import type { TournamentPayload } from "@/features/tournaments/api/tournaments.mutations";

const defaultForm: TournamentPayload = {
  name: "",
  year: new Date().getFullYear(),
  status: "draft",
  teamsCount: 32,
  groupsCount: 8,
  teamsPerGroup: 4,
  qualifiedPerGroup: 2,
  bestThirdCount: 8,
};

type TournamentFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournament?: Tournament | null;
  onSubmit: (payload: TournamentPayload) => void;
  loading?: boolean;
};

export function TournamentFormDialog({
  open,
  onOpenChange,
  tournament,
  onSubmit,
  loading = false,
}: TournamentFormDialogProps) {
  const [form, setForm] = useState<TournamentPayload>(defaultForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tournament) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset form when editing target changes
      setForm({
        name: tournament.name,
        year: tournament.year,
        status: tournament.status,
        teamsCount: tournament.teamsCount,
        groupsCount: tournament.groupsCount,
        teamsPerGroup: tournament.teamsPerGroup,
        qualifiedPerGroup: tournament.qualifiedPerGroup,
        bestThirdCount: tournament.bestThirdCount,
      });
    } else {
      setForm(defaultForm);
    }
    setError(null);
  }, [tournament, open]);

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    if (form.year < 1900) {
      setError("Year must be valid");
      return;
    }
    const nums = [
      form.teamsCount,
      form.groupsCount,
      form.teamsPerGroup,
      form.qualifiedPerGroup,
      form.bestThirdCount,
    ];
    if (nums.some((n) => n < 0)) {
      setError("Counts must be positive");
      return;
    }
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {tournament ? "Edit Tournament" : "Create Tournament"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={form.year}
              onChange={(e) =>
                setForm({ ...form, year: Number(e.target.value) })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) =>
                v && setForm({ ...form, status: v as TournamentStatus })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  Object.keys(TOURNAMENT_STATUS_LABELS) as TournamentStatus[]
                ).map((status) => (
                  <SelectItem key={status} value={status}>
                    {TOURNAMENT_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(
            [
              ["teamsCount", "Teams Count"],
              ["groupsCount", "Groups Count"],
              ["teamsPerGroup", "Teams per Group"],
              ["qualifiedPerGroup", "Qualified per Group"],
              ["bestThirdCount", "Best Third Count"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type="number"
                min={0}
                value={form[key]}
                onChange={(e) =>
                  setForm({ ...form, [key]: Number(e.target.value) })
                }
              />
            </div>
          ))}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : tournament ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
