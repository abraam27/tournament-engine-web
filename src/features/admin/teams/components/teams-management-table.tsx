"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { getTeams } from "@/features/teams/api/teams.api";
import {
  createTeam,
  deleteTeam,
  updateTeam,
  type TeamPayload,
} from "@/features/teams/api/teams.mutations";
import type { Team } from "@/features/teams/types/team.types";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { useMounted } from "@/lib/hooks/use-mounted";

import { TeamFormDialog } from "./team-form-dialog";

export function TeamsManagementTable() {
  const mounted = useMounted();
  const queryClient = useQueryClient();
  const { showSuccess, showError, MessageAlert } = useAdminMessage();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim());
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Team | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Team | null>(null);

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["teams", debouncedSearch],
    queryFn: () => getTeams(debouncedSearch || undefined),
    enabled: mounted,
  });

  const saveMutation = useMutation({
    mutationFn: (payload: TeamPayload) =>
      editing ? updateTeam(editing._id, payload) : createTeam(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      showSuccess(editing ? "Team updated" : "Team created");
      setFormOpen(false);
      setEditing(null);
    },
    onError: (e) => showError(getErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      showSuccess("Team deleted");
      setDeleteTarget(null);
    },
    onError: (e) => showError(getErrorMessage(e)),
  });

  return (
    <div className="space-y-4">
      {MessageAlert}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Create Team
        </Button>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Confederation</TableHead>
                <TableHead>FIFA</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((t) => (
                <TableRow key={t._id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{t.code}</TableCell>
                  <TableCell>{t.confederation ?? "—"}</TableCell>
                  <TableCell>{t.fifaRanking ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditing(t);
                          setFormOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteTarget(t)}
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
      <TeamFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        team={editing}
        onSubmit={(p) => saveMutation.mutate(p)}
        loading={saveMutation.isPending}
      />
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete team?"
        description={`Delete "${deleteTarget?.name}"?`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
      />
    </div>
  );
}
