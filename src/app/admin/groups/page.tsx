import { Suspense } from "react";

import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { GroupsManagementTable } from "@/features/admin/groups/components/groups-management-table";

export default function AdminGroupsPage() {
  return (
    <>
      <AdminPageHeader
        title="Group Management"
        description="Manage groups and team assignments"
      />
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
        <GroupsManagementTable />
      </Suspense>
    </>
  );
}
