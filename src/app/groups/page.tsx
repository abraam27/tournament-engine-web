import { Suspense } from "react";

import {
  GroupsPageContent,
  GroupsPageSkeleton,
} from "@/features/groups/components/groups-page-content";

export default function GroupsPage() {
  return (
    <Suspense fallback={<GroupsPageSkeleton />}>
      <GroupsPageContent />
    </Suspense>
  );
}
