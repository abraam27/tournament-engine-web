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
import type { Team, Confederation } from "@/features/teams/types/team.types";
import type { TeamPayload } from "@/features/teams/api/teams.mutations";

const CONFEDERATIONS: Confederation[] = [
  "CAF",
  "UEFA",
  "AFC",
  "CONMEBOL",
  "CONCACAF",
  "OFC",
];

const defaultForm: TeamPayload = {
  name: "",
  code: "",
  flagUrl: "",
  confederation: undefined,
  fifaRanking: undefined,
};

type TeamFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team?: Team | null;
  onSubmit: (payload: TeamPayload) => void;
  loading?: boolean;
};

export function TeamFormDialog({
  open,
  onOpenChange,
  team,
  onSubmit,
  loading = false,
}: TeamFormDialogProps) {
  const [form, setForm] = useState<TeamPayload>(defaultForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (team) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset form when editing target changes
      setForm({
        name: team.name,
        code: team.code,
        flagUrl: team.flagUrl ?? "",
        confederation: team.confederation,
        fifaRanking: team.fifaRanking,
      });
    } else {
      setForm(defaultForm);
    }
    setError(null);
  }, [team, open]);

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    const code = form.code.toUpperCase().trim();
    if (code.length !== 3) {
      setError("Code must be exactly 3 characters");
      return;
    }
    if (form.fifaRanking !== undefined && form.fifaRanking < 1) {
      setError("FIFA ranking must be positive");
      return;
    }
    onSubmit({
      ...form,
      code,
      flagUrl: form.flagUrl || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{team ? "Edit Team" : "Create Team"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="team-name">Name</Label>
            <Input
              id="team-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team-code">Code</Label>
            <Input
              id="team-code"
              maxLength={3}
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="flagUrl">Flag URL</Label>
            <Input
              id="flagUrl"
              value={form.flagUrl}
              onChange={(e) => setForm({ ...form, flagUrl: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Confederation</Label>
            <Select
              value={form.confederation ?? ""}
              onValueChange={(v) =>
                setForm({
                  ...form,
                  confederation: v ? (v as Confederation) : undefined,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select confederation" />
              </SelectTrigger>
              <SelectContent>
                {CONFEDERATIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fifaRanking">FIFA Ranking</Label>
            <Input
              id="fifaRanking"
              type="number"
              min={1}
              value={form.fifaRanking ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  fifaRanking: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : team ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
