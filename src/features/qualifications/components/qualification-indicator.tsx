import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type QualificationIndicatorProps = {
  qualified: boolean;
  className?: string;
  cutoffNote?: string;
};

export function QualificationIndicator({
  qualified,
  className,
  cutoffNote,
}: QualificationIndicatorProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Badge variant={qualified ? "default" : "secondary"}>
        {qualified ? "Qualified" : "Eliminated"}
      </Badge>
      {cutoffNote && (
        <span className="text-xs text-muted-foreground">{cutoffNote}</span>
      )}
    </div>
  );
}
