"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmDeleteDialog } from "@/features/admin/components/confirm-delete-dialog";
import {
  getErrorMessage,
  useAdminMessage,
} from "@/features/admin/lib/use-admin-message";
import { getGroups } from "@/features/groups/api/groups.api";
import {
  createGroup,
  deleteGroup,
  updateGroup,
  type GroupPayload,
} from "@/features/groups/api/groups.mutations";
import { GROUP_STATUS_LABELS } from "@/features/groups/types/group.types";
import type { Group } from "@/features/groups/types/group.types";
import { TournamentSelector } from "@/features/tournaments/components/tournament-selector";
import { useSelectedTournament } from "@/features/tournaments/hooks/use-selected-tournament";

import { AssignTeamDialog } from "./assign-team-dialog";
import { GroupFormDialog } from "./group-form-dialog";
import { GroupTeamsManagement } from "./group-teams-management";

export function GroupsManagementTable() {
  const queryClient = useQueryClient();
  const { showSuccess, showError, MessageAlert } = useAdminMessage();
  const {
    tournaments,
    selectedTournament,
    selectedTournamentId,
    setSelectedTournamentId,
    isLoading: tournamentsLoading,
  } = useSelectedTournament();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Group | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null);
  const [assignGroup, setAssignGroup] = useState<Group | null>(null);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["groups", selectedTournamentId],
    queryFn: () => getGroups({ tournamentId: selectedTournamentId! }),
    enabled: !!selectedTournamentId,
  });

  const saveMutation = useMutation({
    mutationFn: (payload: GroupPayload) =>
      editing
        ? updateGroup(editing._id, {
            name: payload.name,
            code: payload.code,
            status: payload.status,
          })
        : createGroup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      showSuccess(editing ? "Group updated" : "Group created");
      setFormOpen(false);
      setEditing(null);
    },
    onError: (e) => showError(getErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      showSuccess("Group deleted");
      setDeleteTarget(null);
    },
    onError: (e) => showError(getErrorMessage(e)),
  });

  if (tournamentsLoading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="space-y-4">
      {MessageAlert}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TournamentSelector
          tournaments={tournaments}
          value={selectedTournamentId}
          onChange={setSelectedTournamentId}
        />
        <Button
          disabled={!selectedTournamentId}
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Create Group
        </Button>
      </div>

      {!selectedTournament ? (
        <p className="text-sm text-muted-foreground">Select a tournament.</p>
      ) : isLoading ? (
        <p className="text-sm text-muted-foreground">Loading groups...</p>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <Card key={group._id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    {group.name}{" "}
                    <span className="text-muted-foreground">
                      ({group.code})
                    </span>
                  </CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {GROUP_STATUS_LABELS[group.status]}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setExpandedGroupId(
                        expandedGroupId === group._id ? null : group._id,
                      )
                    }
                  >
                    {expandedGroupId === group._id ? "Hide Teams" : "View Teams"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAssignGroup(group)}
                  >
                    Assign Team
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditing(group);
                      setFormOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteTarget(group)}
                  >
                    Delete
                  </Button>
                </div>
              </CardHeader>
              {expandedGroupId === group._id && (
                <CardContent>
                  <GroupTeamsManagement group={group} />
                </CardContent>
              )}
            </Card>
          ))}
          {groups.length === 0 && (
            <p className="text-sm text-muted-foreground">No groups yet.</p>
          )}
        </div>
      )}

      {selectedTournamentId && (
        <GroupFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          group={editing}
          tournamentId={selectedTournamentId}
          onSubmit={(p) => saveMutation.mutate(p)}
          loading={saveMutation.isPending}
        />
      )}
      <AssignTeamDialog
        open={!!assignGroup}
        onOpenChange={(o) => !o && setAssignGroup(null)}
        group={assignGroup}
      />
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete group?"
        description={`Delete "${deleteTarget?.name}"?`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
      />
    </div>
  );
}
