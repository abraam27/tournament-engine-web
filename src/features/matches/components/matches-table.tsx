import Link from "next/link";

import { Button } from "@/components/ui/button";
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
  formatMatchDate,
  formatRound,
} from "../lib/match-utils";
import type { Match } from "../types/match.types";
import { MatchScore } from "./match-score";
import { MatchStatusBadge } from "./match-status-badge";

type MatchesTableProps = {
  matches: Match[];
};

export function MatchesTable({ matches }: MatchesTableProps) {
  if (matches.length === 0) {
    return null;
  }

  const sorted = [...matches].sort((a, b) => {
    const dateA = a.matchDate ? new Date(a.matchDate).getTime() : 0;
    const dateB = b.matchDate ? new Date(b.matchDate).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Round</TableHead>
              <TableHead>Home</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Away</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Stadium</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((match) => (
              <TableRow key={match._id}>
                <TableCell>{match.matchNumber}</TableCell>
                <TableCell>{formatRound(match.round)}</TableCell>
                <TableCell className="font-medium">
                  {getTeamName(match.homeTeamId)}
                </TableCell>
                <TableCell>
                  <MatchScore match={match} />
                </TableCell>
                <TableCell className="font-medium">
                  {getTeamName(match.awayTeamId)}
                </TableCell>
                <TableCell>
                  <MatchStatusBadge status={match.status} />
                </TableCell>
                <TableCell>{formatMatchDate(match.matchDate)}</TableCell>
                <TableCell>{match.stadium ?? "—"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    render={<Link href={`/matches/${match._id}`} />}
                    nativeButton={false}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-4 md:hidden">
        {sorted.map((match) => (
          <div
            key={match._id}
            className="rounded-xl border p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">Match {match.matchNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {formatRound(match.round)}
                </p>
              </div>
              <MatchStatusBadge status={match.status} />
            </div>
            <p className="font-medium">
              {getTeamName(match.homeTeamId)}{" "}
              <MatchScore match={match} />{" "}
              {getTeamName(match.awayTeamId)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatMatchDate(match.matchDate)}
              {match.stadium ? ` · ${match.stadium}` : ""}
            </p>
            <Button
              size="sm"
              variant="outline"
              render={<Link href={`/matches/${match._id}`} />}
              nativeButton={false}
            >
              View Details
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
