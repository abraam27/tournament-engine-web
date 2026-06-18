import { cn } from "@/lib/utils";

import type { Match } from "../types/match.types";

type MatchTimelineProps = {
  match: Match;
};

type TimelineStep = {
  label: string;
  description?: string;
};

function getTimelineSteps(match: Match): TimelineStep[] {
  if (match.status === "cancelled") {
    return [{ label: "Cancelled", description: "Match was cancelled" }];
  }

  if (match.status === "scheduled") {
    return [
      { label: "Scheduled", description: "Fixture confirmed" },
      { label: "Awaiting kickoff", description: "Match not started yet" },
    ];
  }

  const steps: TimelineStep[] = [{ label: "Full Time" }];

  if (match.hasExtraTime) {
    steps.push({ label: "Extra Time" });
  }

  if (match.hasPenalties) {
    steps.push({ label: "Penalty Shootout" });
  }

  if (match.status === "completed") {
    steps.push({ label: "Result saved" });
  } else if (match.status === "live") {
    steps.push({ label: "In progress" });
  }

  return steps;
}

export function MatchTimeline({ match }: MatchTimelineProps) {
  const steps = getTimelineSteps(match);

  return (
    <ol className="relative space-y-4 border-l pl-6">
      {steps.map((step, index) => (
        <li key={`${step.label}-${index}`} className="relative">
          <span
            className={cn(
              "absolute top-1 -left-[1.6rem] size-3 rounded-full border-2 border-primary bg-background",
              index === steps.length - 1 && "bg-primary",
            )}
          />
          <p className="font-medium">{step.label}</p>
          {step.description && (
            <p className="text-sm text-muted-foreground">{step.description}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
