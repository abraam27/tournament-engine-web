"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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
import {
  getErrorMessage,
  useAdminMessage,
} from "@/features/admin/lib/use-admin-message";
import { getGroupTeams } from "@/features/groups/api/groups.api";
import { assignTeamToGroup } from "@/features/groups/api/groups.mutations";
import { getTeams } from "@/features/teams/api/teams.api";
import { getTeamId } from "@/lib/api-utils";
import type { Group } from "@/features/groups/types/group.types";

type AssignTeamDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group | null;
};

export function AssignTeamDialog({
  open,
  onOpenChange,
  group,
}: AssignTeamDialogProps) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAdminMessage();
  const [teamId, setTeamId] = useState("");
  const [seed, setSeed] = useState<number | undefined>();

  const { data: allTeams = [] } = useQuery({
    queryKey: ["teams"],
    queryFn: () => getTeams(),
    enabled: open,
  });

  const { data: groupTeams = [] } = useQuery({
    queryKey: ["group-teams", group?._id],
    queryFn: () => getGroupTeams(group!._id),
    enabled: open && !!group,
  });

  const assignedIds = new Set(
    groupTeams.map((gt) => getTeamId(gt.teamId)),
  );
  const availableTeams = allTeams.filter((t) => !assignedIds.has(t._id));

  const mutation = useMutation({
    mutationFn: () =>
      assignTeamToGroup(group!._id, { teamId, seed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-teams", group?._id] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      showSuccess("Team assigned to group");
      setTeamId("");
      setSeed(undefined);
      onOpenChange(false);
    },
    onError: (e) => showError(getErrorMessage(e)),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Team to {group?.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Team</Label>
            <Select value={teamId} onValueChange={(v) => v && setTeamId(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {availableTeams.length === 0 ? (
                  <p className="px-2 py-4 text-sm text-muted-foreground">
                    No available teams to assign
                  </p>
                ) : (
                  availableTeams.map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.name} ({t.code})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="seed">Seed (optional)</Label>
            <Input
              id="seed"
              type="number"
              min={1}
              value={seed ?? ""}
              onChange={(e) =>
                setSeed(e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={!teamId || mutation.isPending}
          >
            {mutation.isPending ? "Assigning..." : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
