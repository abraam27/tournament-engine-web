import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  THIRD_PLACE_QUALIFICATION_CUTOFF,
  type ThirdPlaceRankingResponse,
} from "../types/qualification.types";

type ThirdPlaceRankingCardProps = {
  data: ThirdPlaceRankingResponse;
};

export function ThirdPlaceRankingCard({ data }: ThirdPlaceRankingCardProps) {
  const qualifiedCount = data.ranking.filter((row) => row.qualified).length;
  const eliminatedCount = data.ranking.length - qualifiedCount;

  const stats = [
    { label: "Third-Place Teams", value: data.ranking.length },
    { label: "Qualified", value: qualifiedCount },
    { label: "Eliminated", value: eliminatedCount },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Top {THIRD_PLACE_QUALIFICATION_CUTOFF} third-place teams qualify for the
        knockout stage.
      </p>
    </div>
  );
}
