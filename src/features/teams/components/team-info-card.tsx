import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Team } from "../types/team.types";

type TeamInfoCardProps = {
  team: Team;
};

export function TeamInfoCard({ team }: TeamInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          {team.flagUrl && (
            <img
              src={team.flagUrl}
              alt={`${team.name} flag`}
              className="size-12 rounded border object-cover"
            />
          )}
          <div>
            <CardTitle>{team.name}</CardTitle>
            <CardDescription>Code: {team.code}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Confederation</dt>
            <dd className="font-medium">{team.confederation ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">FIFA Ranking</dt>
            <dd className="font-medium">{team.fifaRanking ?? "—"}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
