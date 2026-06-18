import { Suspense } from "react";

import {
  StandingsPageContent,
  StandingsPageSkeleton,
} from "@/features/standings/components/standings-page-content";

export default function StandingsPage() {
  return (
    <Suspense fallback={<StandingsPageSkeleton />}>
      <StandingsPageContent />
    </Suspense>
  );
}
