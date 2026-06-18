import { Suspense } from "react";

import {
  QualifiedTeamsPageContent,
  QualifiedTeamsPageSkeleton,
} from "@/features/qualifications/components/qualified-teams-page-content";

export default function QualificationsPage() {
  return (
    <Suspense fallback={<QualifiedTeamsPageSkeleton />}>
      <QualifiedTeamsPageContent />
    </Suspense>
  );
}
