import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTeamName } from "@/lib/api-utils";

import {
  displayNumber,
  formatSourceRef,
  resolveTeam,
  sortBySourceRef,
} from "../lib/qualification-utils";
import type { QualifiedTeam } from "../types/qualification.types";
import { QualificationSourceBadge } from "./qualification-source-badge";

type AutomaticQualifiersTableProps = {
  teams: QualifiedTeam[];
};

export function AutomaticQualifiersTable({
  teams,
}: AutomaticQualifiersTableProps) {
  if (teams.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No automatic qualifiers yet.
      </p>
    );
  }

  const sorted = [...teams].sort(sortBySourceRef);

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Source</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Group</TableHead>
            <TableHead className="text-center">Rank</TableHead>
            <TableHead className="text-center">Pts</TableHead>
            <TableHead className="text-center">GD</TableHead>
            <TableHead className="text-center">GF</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((entry) => (
            <TableRow key={`${entry.sourceRef}-${entry.teamId}`}>
              <TableCell>
                <div className="space-y-1">
                  <QualificationSourceBadge
                    sourceRef={entry.sourceRef}
                    qualificationType={entry.qualificationType}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formatSourceRef(entry.sourceRef)}
                  </p>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {getTeamName(resolveTeam(entry.teamId, entry.team))}
              </TableCell>
              <TableCell>{entry.groupCode ?? "—"}</TableCell>
              <TableCell className="text-center">
                {displayNumber(entry.rank)}
              </TableCell>
              <TableCell className="text-center">
                {displayNumber(entry.points)}
              </TableCell>
              <TableCell className="text-center">
                {displayNumber(entry.goalDifference)}
              </TableCell>
              <TableCell className="text-center">
                {displayNumber(entry.goalsFor)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
