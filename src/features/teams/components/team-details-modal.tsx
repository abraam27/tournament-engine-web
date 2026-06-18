import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Team } from "../types/team.types";
import { formatDate } from "@/lib/api-utils";

type TeamDetailsModalProps = {
  team: Team | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TeamDetailsModal({
  team,
  open,
  onOpenChange,
}: TeamDetailsModalProps) {
  if (!team) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{team.name}</DialogTitle>
          <DialogDescription>Team details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {team.flagUrl && (
            <img
              src={team.flagUrl}
              alt={`${team.name} flag`}
              className="h-12 w-auto rounded border object-cover"
            />
          )}

          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Code</dt>
              <dd className="font-medium">{team.code}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Confederation</dt>
              <dd className="font-medium">{team.confederation ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">FIFA Ranking</dt>
              <dd className="font-medium">{team.fifaRanking ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Created</dt>
              <dd className="font-medium">{formatDate(team.createdAt)}</dd>
            </div>
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  );
}
