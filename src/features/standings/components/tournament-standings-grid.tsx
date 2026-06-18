import { GroupStandingsCard } from "./group-standings-card";
import type { GroupStandingsResponse } from "../types/standing.types";

type TournamentStandingsGridProps = {
  groups: GroupStandingsResponse[];
  showQualificationHighlight?: boolean;
};

export function TournamentStandingsGrid({
  groups,
  showQualificationHighlight = true,
}: TournamentStandingsGridProps) {
  if (groups.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No group standings available for this tournament.
      </p>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {groups.map((groupStandings) => (
        <GroupStandingsCard
          key={groupStandings.groupId}
          groupStandings={groupStandings}
          showQualificationHighlight={showQualificationHighlight}
        />
      ))}
    </div>
  );
}
