import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SORTING_CRITERIA = [
  { order: 1, label: "Points" },
  { order: 2, label: "Goal Difference" },
  { order: 3, label: "Goals For" },
];

export function QualificationSortingVisual() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ranking Criteria</CardTitle>
        <CardDescription>
          Third-place teams are ranked by the following criteria in order:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {SORTING_CRITERIA.map((criterion) => (
            <div
              key={criterion.order}
              className="flex flex-1 min-w-[140px] items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {criterion.order}
              </span>
              <span className="text-sm font-medium">{criterion.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
