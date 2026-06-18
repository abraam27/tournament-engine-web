import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { formatSourceRef } from "../lib/qualification-utils";
import type { QualificationType } from "../types/qualification.types";

type QualificationSourceBadgeProps = {
  sourceRef: string;
  qualificationType?: QualificationType;
  originalGroupSourceRef?: string;
  thirdPlaceRank?: number;
  className?: string;
};

export function QualificationSourceBadge({
  sourceRef,
  qualificationType,
  originalGroupSourceRef,
  thirdPlaceRank,
  className,
}: QualificationSourceBadgeProps) {
  if (qualificationType === "best_third") {
    const label =
      thirdPlaceRank !== undefined
        ? `BEST THIRD #${thirdPlaceRank}`
        : sourceRef.replace(/^BEST_THIRD_/i, "BEST THIRD #");

    return (
      <Badge variant="outline" className={cn(className)} title={formatSourceRef(sourceRef)}>
        {label}
      </Badge>
    );
  }

  if (originalGroupSourceRef) {
    return (
      <Badge variant="secondary" className={cn(className)} title={formatSourceRef(originalGroupSourceRef)}>
        {originalGroupSourceRef}
      </Badge>
    );
  }

  return (
    <Badge className={cn(className)} title={formatSourceRef(sourceRef)}>
      {sourceRef}
    </Badge>
  );
}
