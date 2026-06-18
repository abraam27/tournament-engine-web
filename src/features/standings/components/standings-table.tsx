import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTeamCode, getTeamName } from "@/lib/api-utils";
import { cn } from "@/lib/utils";

import type { StandingRow } from "../types/standing.types";

type StandingsTableProps = {
  standings: StandingRow[];
  showQualificationHighlight?: boolean;
};

function getQualificationLabel(rank: number): string | null {
  if (rank === 1 || rank === 2) return "Qualified";
  if (rank === 3) return "Possible";
  if (rank >= 4) return "Eliminated";
  return null;
}

function getRowClassName(rank: number, highlight: boolean): string {
  if (!highlight) return "";

  if (rank === 1 || rank === 2) {
    return "bg-emerald-500/5 hover:bg-emerald-500/10";
  }

  if (rank === 3) {
    return "bg-amber-500/5 hover:bg-amber-500/10";
  }

  if (rank >= 4) {
    return "bg-muted/30 hover:bg-muted/50";
  }

  return "";
}

export function StandingsTable({
  standings,
  showQualificationHighlight = true,
}: StandingsTableProps) {
  if (standings.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No standings available.</p>
    );
  }

  const sorted = [...standings].sort((a, b) => a.rank - b.rank);

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">P</TableHead>
            <TableHead className="text-center">W</TableHead>
            <TableHead className="text-center">D</TableHead>
            <TableHead className="text-center">L</TableHead>
            <TableHead className="text-center">GF</TableHead>
            <TableHead className="text-center">GA</TableHead>
            <TableHead className="text-center">GD</TableHead>
            <TableHead className="text-center">Pts</TableHead>
            {showQualificationHighlight && (
              <TableHead className="hidden sm:table-cell">Status</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row) => {
            const label = getQualificationLabel(row.rank);
            const teamName = row.team ? getTeamName(row.team) : getTeamName(row.teamId);
            const teamCode = row.team ? getTeamCode(row.team) : getTeamCode(row.teamId);

            return (
              <TableRow
                key={`${row.rank}-${row.teamId}`}
                className={cn(getRowClassName(row.rank, showQualificationHighlight))}
              >
                <TableCell className="font-medium">{row.rank}</TableCell>
                <TableCell>
                  <div className="min-w-[120px]">
                    <p className="font-medium">{teamName}</p>
                    <p className="text-xs text-muted-foreground">{teamCode}</p>
                  </div>
                </TableCell>
                <TableCell className="text-center">{row.played}</TableCell>
                <TableCell className="text-center">{row.won}</TableCell>
                <TableCell className="text-center">{row.drawn}</TableCell>
                <TableCell className="text-center">{row.lost}</TableCell>
                <TableCell className="text-center">{row.goalsFor}</TableCell>
                <TableCell className="text-center">{row.goalsAgainst}</TableCell>
                <TableCell className="text-center">
                  {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                </TableCell>
                <TableCell className="text-center font-semibold">
                  {row.points}
                </TableCell>
                {showQualificationHighlight && label && (
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant={
                        row.rank <= 2
                          ? "default"
                          : row.rank === 3
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {label}
                    </Badge>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
