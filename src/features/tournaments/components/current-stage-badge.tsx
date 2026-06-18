import { Badge } from "@/components/ui/badge";
import {
  TOURNAMENT_STATUS_LABELS,
  type TournamentStatus,
} from "@/features/tournaments/types/tournament.types";
import { cn } from "@/lib/utils";

const statusVariants: Record<
  TournamentStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  draft: "secondary",
  group_stage: "default",
  knockout: "outline",
  finished: "secondary",
};

type CurrentStageBadgeProps = {
  status: TournamentStatus;
  className?: string;
};

export function CurrentStageBadge({ status, className }: CurrentStageBadgeProps) {
  return (
    <Badge variant={statusVariants[status]} className={cn(className)}>
      {TOURNAMENT_STATUS_LABELS[status]}
    </Badge>
  );
}
