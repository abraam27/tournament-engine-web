import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  QUALIFICATION_SLOT_TARGET,
  type QualifiedTeamsResponse,
} from "../types/qualification.types";

type QualifiedTeamsSummaryProps = {
  data: QualifiedTeamsResponse;
};

export function QualifiedTeamsSummary({ data }: QualifiedTeamsSummaryProps) {
  const remainingSlots = Math.max(
    0,
    QUALIFICATION_SLOT_TARGET - data.totalQualified,
  );

  const stats = [
    { label: "Total Qualified", value: data.totalQualified },
    {
      label: "Automatic Qualifiers",
      value: data.automaticQualified.length,
    },
    {
      label: "Best Third-Place",
      value: data.bestThirdQualified.length,
    },
    {
      label: "Remaining Slots",
      value: data.totalQualified < QUALIFICATION_SLOT_TARGET ? remainingSlots : 0,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
  );
}
