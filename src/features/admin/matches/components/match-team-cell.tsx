import type { Team } from "@/features/teams/types/team.types";
import { getTeamFlag } from "@/features/matches/lib/match-utils";
import { getTeamCode, getTeamName } from "@/lib/api-utils";

type MatchTeamCellProps = {
  team: string | Team;
  side?: "home" | "away";
};

function TeamFlag({ team }: { team: string | Team }) {
  const flagUrl = getTeamFlag(team);
  const code = getTeamCode(team);

  if (flagUrl) {
    return (
      <img
        src={flagUrl}
        alt=""
        className="size-5 shrink-0 rounded border object-cover"
      />
    );
  }

  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded border bg-muted text-[10px] font-medium text-muted-foreground">
      {code.slice(0, 2)}
    </span>
  );
}

function TeamText({
  team,
  align,
}: {
  team: string | Team;
  align: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : undefined}>
      <p className="font-medium">{getTeamName(team)}</p>
      <p className="text-xs text-muted-foreground">{getTeamCode(team)}</p>
    </div>
  );
}

export function MatchTeamCell({ team, side = "home" }: MatchTeamCellProps) {
  if (side === "away") {
    return (
      <div className="flex w-full items-center justify-end gap-2">
        <TeamText team={team} align="right" />
        <TeamFlag team={team} />
      </div>
    );
  }

  return (
    <div className="flex w-full items-center gap-2">
      <TeamFlag team={team} />
      <TeamText team={team} align="left" />
    </div>
  );
}
