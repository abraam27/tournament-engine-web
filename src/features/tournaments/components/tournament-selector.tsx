"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tournament } from "@/features/tournaments/types/tournament.types";

type TournamentSelectorProps = {
  tournaments: Tournament[];
  value: string | null;
  onChange: (tournamentId: string) => void;
};

export function TournamentSelector({
  tournaments,
  value,
  onChange,
}: TournamentSelectorProps) {
  if (tournaments.length <= 1) {
    return null;
  }

  return (
    <Select
      value={value ?? undefined}
      onValueChange={(id) => {
        if (id) onChange(id);
      }}
    >
      <SelectTrigger className="w-full max-w-xs">
        <SelectValue placeholder="Select tournament" />
      </SelectTrigger>
      <SelectContent>
        {tournaments.map((tournament) => (
          <SelectItem key={tournament._id} value={tournament._id}>
            {tournament.name} ({tournament.year})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
