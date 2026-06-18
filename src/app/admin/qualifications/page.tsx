import { Suspense } from "react";

import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { QualificationAdminPanel } from "@/features/admin/qualifications/components/qualification-admin-panel";

export default function AdminQualificationsPage() {
  return (
    <>
      <AdminPageHeader
        title="Qualification Management"
        description="View qualified teams and third-place ranking"
      />
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
        <QualificationAdminPanel />
      </Suspense>
    </>
  );
}
