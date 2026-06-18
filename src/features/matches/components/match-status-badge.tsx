import { Badge } from "@/components/ui/badge";
import {
  MATCH_STATUS_LABELS,
  type MatchStatus,
} from "@/features/matches/types/match.types";
import { cn } from "@/lib/utils";

const statusVariants: Record<
  MatchStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  scheduled: "outline",
  live: "default",
  completed: "secondary",
  cancelled: "destructive",
};

type MatchStatusBadgeProps = {
  status: MatchStatus;
  className?: string;
};

export function MatchStatusBadge({ status, className }: MatchStatusBadgeProps) {
  return (
    <Badge variant={statusVariants[status]} className={cn(className)}>
      {MATCH_STATUS_LABELS[status]}
    </Badge>
  );
}
