import { GroupCard } from "./group-card";
import type { Group } from "../types/group.types";

type GroupsGridProps = {
  groups: Group[];
  tournamentId: string;
};

export function GroupsGrid({ groups, tournamentId }: GroupsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => (
        <GroupCard key={group._id} group={group} tournamentId={tournamentId} />
      ))}
    </div>
  );
}
