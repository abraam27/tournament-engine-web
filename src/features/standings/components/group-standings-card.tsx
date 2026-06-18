import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { StandingsTable } from "./standings-table";
import type { GroupStandingsResponse } from "../types/standing.types";

type GroupStandingsCardProps = {
  groupStandings: GroupStandingsResponse;
  showQualificationHighlight?: boolean;
};

export function GroupStandingsCard({
  groupStandings,
  showQualificationHighlight = true,
}: GroupStandingsCardProps) {
  const groupName =
    groupStandings.group?.name ?? `Group ${groupStandings.groupId}`;
  const groupCode = groupStandings.group?.code;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{groupName}</CardTitle>
            {groupCode && (
              <CardDescription>Group {groupCode}</CardDescription>
            )}
          </div>
          {groupStandings.groupId && (
            <Button
              size="sm"
              variant="outline"
              render={<Link href={`/groups/${groupStandings.groupId}`} />}
              nativeButton={false}
            >
              View Group
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <StandingsTable
          standings={groupStandings.standings}
          showQualificationHighlight={showQualificationHighlight}
        />
      </CardContent>
    </Card>
  );
}
