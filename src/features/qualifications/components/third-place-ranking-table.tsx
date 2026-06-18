import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTeamName } from "@/lib/api-utils";
import { cn } from "@/lib/utils";

import { formatSourceRef, resolveTeam } from "../lib/qualification-utils";
import {
  THIRD_PLACE_QUALIFICATION_CUTOFF,
  type ThirdPlaceRankingRow,
} from "../types/qualification.types";
import { QualificationIndicator } from "./qualification-indicator";
import { QualificationSourceBadge } from "./qualification-source-badge";

type ThirdPlaceRankingTableProps = {
  ranking: ThirdPlaceRankingRow[];
};

function getCutoffNote(rank: number, qualified: boolean): string | undefined {
  if (rank === THIRD_PLACE_QUALIFICATION_CUTOFF && qualified) {
    return "Cutoff";
  }

  if (rank === THIRD_PLACE_QUALIFICATION_CUTOFF + 1 && !qualified) {
    return "Below cutoff";
  }

  return undefined;
}

export function ThirdPlaceRankingTable({
  ranking,
}: ThirdPlaceRankingTableProps) {
  if (ranking.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No third-place ranking data available.
      </p>
    );
  }

  const sorted = [...ranking].sort(
    (a, b) => a.thirdPlaceRank - b.thirdPlaceRank,
  );

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Rank</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Source</TableHead>
            <TableHead className="text-center">Pts</TableHead>
            <TableHead className="text-center">GD</TableHead>
            <TableHead className="text-center">GF</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row) => {
            const cutoffNote = getCutoffNote(row.thirdPlaceRank, row.qualified);

            return (
              <TableRow
                key={`${row.thirdPlaceRank}-${row.teamId}`}
                className={cn(
                  row.qualified
                    ? "bg-emerald-500/5 hover:bg-emerald-500/10"
                    : "text-muted-foreground",
                )}
              >
                <TableCell className="font-medium">
                  {row.thirdPlaceRank}
                </TableCell>
                <TableCell>
                  <QualificationIndicator
                    qualified={row.qualified}
                    cutoffNote={cutoffNote}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {getTeamName(resolveTeam(row.teamId, row.team))}
                </TableCell>
                <TableCell>{row.groupCode ?? "—"}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <QualificationSourceBadge
                      sourceRef={row.originalGroupSourceRef}
                      originalGroupSourceRef={row.originalGroupSourceRef}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formatSourceRef(row.originalGroupSourceRef)}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-center">{row.points}</TableCell>
                <TableCell className="text-center">
                  {row.goalDifference > 0
                    ? `+${row.goalDifference}`
                    : row.goalDifference}
                </TableCell>
                <TableCell className="text-center">{row.goalsFor}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
