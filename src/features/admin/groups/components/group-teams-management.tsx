"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getErrorMessage,
  useAdminMessage,
} from "@/features/admin/lib/use-admin-message";
import { getGroupTeams } from "@/features/groups/api/groups.api";
import { removeTeamFromGroup } from "@/features/groups/api/groups.mutations";
import { getTeamCode, getTeamName } from "@/lib/api-utils";
import type { Group } from "@/features/groups/types/group.types";

type GroupTeamsManagementProps = {
  group: Group;
};

export function GroupTeamsManagement({ group }: GroupTeamsManagementProps) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAdminMessage();

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["group-teams", group._id],
    queryFn: () => getGroupTeams(group._id),
  });

  const removeMutation = useMutation({
    mutationFn: (teamId: string) => removeTeamFromGroup(group._id, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-teams", group._id] });
      showSuccess("Team removed from group");
    },
    onError: (e) => showError(getErrorMessage(e)),
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading teams...</p>;
  }

  if (teams.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No teams assigned yet.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Seed</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Code</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((entry) => (
            <TableRow key={entry._id}>
              <TableCell>{entry.seed ?? "—"}</TableCell>
              <TableCell>{getTeamName(entry.teamId)}</TableCell>
              <TableCell>{getTeamCode(entry.teamId)}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    removeMutation.mutate(
                      typeof entry.teamId === "string"
                        ? entry.teamId
                        : entry.teamId._id,
                    )
                  }
                  disabled={removeMutation.isPending}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
