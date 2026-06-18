"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import type { Group } from "@/features/groups/types/group.types";
import {
  generateGroupFixtures,
  generateTournamentGroupStageFixtures,
} from "@/features/matches/api/matches.mutations";

type GenerateFixturesCardProps = {
  tournamentId: string | null;
  groups: Group[];
};

export function GenerateFixturesCard({
  tournamentId,
  groups,
}: GenerateFixturesCardProps) {
  const queryClient = useQueryClient();
  const { showSuccess, showError, MessageAlert } = useAdminMessage();
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?._id ?? "");

  const groupMutation = useMutation({
    mutationFn: (groupId: string) => generateGroupFixtures(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      showSuccess("Group fixtures generated");
    },
    onError: (e) => showError(getErrorMessage(e)),
  });

  const tournamentMutation = useMutation({
    mutationFn: (tid: string) => generateTournamentGroupStageFixtures(tid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      showSuccess("Tournament group-stage fixtures generated");
    },
    onError: (e) => showError(getErrorMessage(e)),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Generate Fixtures</CardTitle>
        <CardDescription>
          Create match schedules for groups or the full group stage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {MessageAlert}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Group</p>
            <Select
              value={selectedGroupId}
              onValueChange={(v) => v && setSelectedGroupId(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((g) => (
                  <SelectItem key={g._id} value={g._id}>
                    {g.name} ({g.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            disabled={!selectedGroupId || groupMutation.isPending}
            onClick={() => groupMutation.mutate(selectedGroupId)}
          >
            {groupMutation.isPending
              ? "Generating..."
              : "Generate Group Fixtures"}
          </Button>
        </div>
        <Button
          disabled={!tournamentId || tournamentMutation.isPending}
          onClick={() => tournamentId && tournamentMutation.mutate(tournamentId)}
        >
          {tournamentMutation.isPending
            ? "Generating..."
            : "Generate All Group-Stage Fixtures"}
        </Button>
      </CardContent>
    </Card>
  );
}
