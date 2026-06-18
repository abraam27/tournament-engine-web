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
import type { Group } from "@/features/groups/types/group.types";
import {
  GROUP_STATUS_LABELS,
  type GroupStatus,
} from "@/features/groups/types/group.types";
import type { GroupPayload } from "@/features/groups/api/groups.mutations";

type GroupFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: Group | null;
  tournamentId: string;
  onSubmit: (payload: GroupPayload) => void;
  loading?: boolean;
};

export function GroupFormDialog({
  open,
  onOpenChange,
  group,
  tournamentId,
  onSubmit,
  loading = false,
}: GroupFormDialogProps) {
  const [form, setForm] = useState<GroupPayload>({
    tournamentId,
    name: "",
    code: "",
    status: "pending",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (group) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset form when editing target changes
      setForm({
        tournamentId: group.tournamentId,
        name: group.name,
        code: group.code,
        status: group.status,
      });
    } else {
      setForm({
        tournamentId,
        name: "",
        code: "",
        status: "pending",
      });
    }
    setError(null);
  }, [group, tournamentId, open]);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.code.trim()) {
      setError("Name and code are required");
      return;
    }
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{group ? "Edit Group" : "Create Group"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Name</Label>
            <Input
              id="group-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-code">Code</Label>
            <Input
              id="group-code"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) =>
                v && setForm({ ...form, status: v as GroupStatus })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(GROUP_STATUS_LABELS) as GroupStatus[]).map(
                  (s) => (
                    <SelectItem key={s} value={s}>
                      {GROUP_STATUS_LABELS[s]}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : group ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
