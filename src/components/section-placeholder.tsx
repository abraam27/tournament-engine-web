import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SectionPlaceholderProps = {
  title: string;
  description: string;
  tournamentId?: string;
};

export function SectionPlaceholder({
  title,
  description,
  tournamentId,
}: SectionPlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Coming in a future phase</CardTitle>
          <CardDescription>
            This section is not fully implemented yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {tournamentId
              ? `Tournament context: ${tournamentId}. Visit the tournament details page for an overview.`
              : "Select a tournament from the dashboard to get started."}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button render={<Link href="/" />} nativeButton={false}>
              Dashboard
            </Button>
            {tournamentId && (
              <Button
                variant="outline"
                render={<Link href={`/tournaments/${tournamentId}`} />}
                nativeButton={false}
              >
                View Tournament
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
