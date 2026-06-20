import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { MatchStatusBadge } from "@/features/matches/components/match-status-badge";
import { cn } from "@/lib/utils";

import {
  getDisplayScore,
  getTeamCode,
  getTeamDisplayName,
  hasMatchScore,
  isTeamLoser,
  isTeamWinner,
} from "../lib/bracket-utils";
import type { BracketMatchData, BracketTeam } from "../types/bracket.types";

type BracketMatchProps = {
  match: BracketMatchData;
  compact?: boolean;
  className?: string;
};

function TeamRow({
  team,
  match,
  side,
}: {
  team: BracketTeam;
  match: BracketMatchData;
  side: "home" | "away";
}) {
  const winner = isTeamWinner(team, match);
  const loser = isTeamLoser(team, match);
  const showScore = hasMatchScore(match);

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2.5 py-1.5",
        winner && "bg-emerald-500/10 font-semibold text-emerald-950 dark:text-emerald-50",
        loser && "text-muted-foreground",
        !winner && !loser && "text-foreground",
      )}
    >
      {team?.flagUrl ? (
        <img
          src={team.flagUrl}
          alt=""
          className="size-4 shrink-0 rounded-sm border object-cover"
        />
      ) : (
        <span className="flex size-4 shrink-0 items-center justify-center rounded-sm border bg-muted text-[8px] font-bold text-muted-foreground">
          {getTeamCode(team).slice(0, 2)}
        </span>
      )}
      <span className="min-w-0 flex-1 truncate text-xs sm:text-sm">
        {getTeamDisplayName(team)}
      </span>
      <span
        className={cn(
          "w-8 shrink-0 text-right text-xs font-bold tabular-nums sm:text-sm",
          winner && "text-emerald-700 dark:text-emerald-300",
        )}
      >
        {showScore ? getDisplayScore(match, side) : ""}
      </span>
    </div>
  );
}

export function BracketMatch({ match, compact = false, className }: BracketMatchProps) {
  const content = (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md",
        match.status === "live" && "ring-2 ring-red-500/60",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-2.5 py-1">
        <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-medium">
          M{match.matchNumber}
        </Badge>
        <MatchStatusBadge
          status={match.status}
          className="h-5 px-1.5 text-[10px]"
        />
      </div>
      <div className="divide-y">
        <TeamRow team={match.homeTeam} match={match} side="home" />
        <TeamRow team={match.awayTeam} match={match} side="away" />
      </div>
      {!compact && match.hasPenalties && (
        <div className="border-t bg-muted/20 px-2.5 py-1 text-center text-[10px] text-muted-foreground">
          Decided on penalties
        </div>
      )}
    </div>
  );

  if (match.matchId) {
    return (
      <Link href={`/matches/${match.matchId}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
