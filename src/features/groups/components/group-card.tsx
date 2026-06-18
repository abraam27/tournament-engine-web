import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

import {
  GROUP_STATUS_LABELS,
  type Group,
} from "@/features/groups/types/group.types";

type GroupCardProps = {
  group: Group;
  tournamentId: string;
};

export function GroupCard({ group, tournamentId }: GroupCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle>{group.name}</CardTitle>
            <p className="text-sm text-muted-foreground">Group {group.code}</p>
          </div>
          <Badge variant="secondary">
            {GROUP_STATUS_LABELS[group.status] ?? group.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground capitalize">
          Status: {GROUP_STATUS_LABELS[group.status] ?? group.status}
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button
          size="sm"
          render={<Link href={`/groups/${group._id}`} />}
          nativeButton={false}
        >
          View Group
        </Button>
        <Button
          size="sm"
          variant="outline"
          render={
            <Link
              href={`/groups/${group._id}#standings`}
            />
          }
          nativeButton={false}
        >
          View Standings
        </Button>
        <Button
          size="sm"
          variant="ghost"
          render={
            <Link href={`/standings?tournamentId=${tournamentId}`} />
          }
          nativeButton={false}
        >
          Tournament Table
        </Button>
      </CardFooter>
    </Card>
  );
}
