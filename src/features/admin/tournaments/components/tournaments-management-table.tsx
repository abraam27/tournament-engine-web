"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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
import { getTournaments } from "@/features/tournaments/api/tournaments.api";
import {
  createTournament,
  deleteTournament,
  updateTournament,
  type TournamentPayload,
} from "@/features/tournaments/api/tournaments.mutations";
import { CurrentStageBadge } from "@/features/tournaments/components/current-stage-badge";
import type { Tournament } from "@/features/tournaments/types/tournament.types";
import { useMounted } from "@/lib/hooks/use-mounted";

import { TournamentFormDialog } from "./tournament-form-dialog";

export function TournamentsManagementTable() {
  const mounted = useMounted();
  const queryClient = useQueryClient();
  const { showSuccess, showError, MessageAlert } = useAdminMessage();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Tournament | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Tournament | null>(null);

  const { data: tournaments = [], isLoading } = useQuery({
    queryKey: ["tournaments"],
    queryFn: getTournaments,
    enabled: mounted,
  });

  const saveMutation = useMutation({
    mutationFn: (payload: TournamentPayload) =>
      editing
        ? updateTournament(editing._id, payload)
        : createTournament(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      showSuccess(editing ? "Tournament updated" : "Tournament created");
      setFormOpen(false);
      setEditing(null);
    },
    onError: (e) => showError(getErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTournament(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      showSuccess("Tournament deleted");
      setDeleteTarget(null);
    },
    onError: (e) => showError(getErrorMessage(e)),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-4">
      {MessageAlert}
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Create Tournament
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Teams</TableHead>
              <TableHead>Groups</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tournaments.map((t) => (
              <TableRow key={t._id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell>{t.year}</TableCell>
                <TableCell>
                  <CurrentStageBadge status={t.status} />
                </TableCell>
                <TableCell>{t.teamsCount}</TableCell>
                <TableCell>{t.groupsCount}</TableCell>
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
      <TournamentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        tournament={editing}
        onSubmit={(p) => saveMutation.mutate(p)}
        loading={saveMutation.isPending}
      />
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete tournament?"
        description={`This will permanently delete "${deleteTarget?.name}".`}
        loading={deleteMutation.isPending}
        onConfirm={() =>
          deleteTarget && deleteMutation.mutate(deleteTarget._id)
        }
      />
    </div>
  );
}
