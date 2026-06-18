"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Group } from "@/features/groups/types/group.types";
import { TournamentSelector } from "@/features/tournaments/components/tournament-selector";
import type { Tournament } from "@/features/tournaments/types/tournament.types";

import {
  MATCH_ROUND_OPTIONS,
  MATCH_STATUS_OPTIONS,
} from "../types/match.types";

type MatchesFiltersProps = {
  tournaments: Tournament[];
  selectedTournamentId: string | null;
  onTournamentChange: (tournamentId: string) => void;
  groups: Group[];
  groupId: string;
  round: string;
  status: string;
  onGroupChange: (value: string) => void;
  onRoundChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export function MatchesFilters({
  tournaments,
  selectedTournamentId,
  onTournamentChange,
  groups,
  groupId,
  round,
  status,
  onGroupChange,
  onRoundChange,
  onStatusChange,
}: MatchesFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-4 lg:flex-row lg:flex-wrap lg:items-end">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Tournament</p>
        <TournamentSelector
          tournaments={tournaments}
          value={selectedTournamentId}
          onChange={onTournamentChange}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Group</p>
        <Select value={groupId} onValueChange={(v) => v && onGroupChange(v)}>
          <SelectTrigger className="w-full min-w-[160px]">
            <SelectValue placeholder="All groups" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            {groups.map((group) => (
              <SelectItem key={group._id} value={group._id}>
                {group.name} ({group.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Round</p>
        <Select value={round} onValueChange={(v) => v && onRoundChange(v)}>
          <SelectTrigger className="w-full min-w-[160px]">
            <SelectValue placeholder="All rounds" />
          </SelectTrigger>
          <SelectContent>
            {MATCH_ROUND_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Status</p>
        <Select value={status} onValueChange={(v) => v && onStatusChange(v)}>
          <SelectTrigger className="w-full min-w-[160px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            {MATCH_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
