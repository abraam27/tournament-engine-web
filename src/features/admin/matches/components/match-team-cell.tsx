import type { Team } from "@/features/teams/types/team.types";
import { getTeamFlag } from "@/features/matches/lib/match-utils";
import { getTeamCode, getTeamName } from "@/lib/api-utils";

type MatchTeamCellProps = {
  team: string | Team;
  align?: "left" | "right";
};

export function MatchTeamCell({ team, align = "left" }: MatchTeamCellProps) {
  const flagUrl = getTeamFlag(team);
  const name = getTeamName(team);
  const code = getTeamCode(team);

  const flag = flagUrl ? (
    <img
      src={flagUrl}
      alt=""
      className="size-5 shrink-0 rounded border object-cover"
    />
  ) : (
    <span className="flex size-5 shrink-0 items-center justify-center rounded border bg-muted text-[10px] font-medium text-muted-foreground">
      {code.slice(0, 2)}
    </span>
  );

  return (
    <div
      className={
        align === "right"
          ? "flex w-full items-center justify-end gap-2"
          : "flex w-full items-center gap-2"
      }
    >
      {align === "right" ? (
        <>
          <div className="text-right">
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{code}</p>
          </div>
          {flag}
        </>
      ) : (
        <>
          {flag}
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{code}</p>
          </div>
        </>
      )}
    </div>
  );
}
