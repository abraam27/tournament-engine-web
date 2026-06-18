import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTeamCode, getTeamName } from "@/lib/api-utils";

import type { GroupTeam } from "../types/group.types";

type GroupTeamsListProps = {
  teams: GroupTeam[];
};

export function GroupTeamsList({ teams }: GroupTeamsListProps) {
  if (teams.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No teams assigned yet.</p>
    );
  }

  const sorted = [...teams].sort(
    (a, b) => (a.seed ?? Infinity) - (b.seed ?? Infinity),
  );

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Seed</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((entry) => (
            <TableRow key={entry._id}>
              <TableCell>{entry.seed ?? "—"}</TableCell>
              <TableCell className="font-medium">
                {getTeamName(entry.teamId)}
              </TableCell>
              <TableCell>{getTeamCode(entry.teamId)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
