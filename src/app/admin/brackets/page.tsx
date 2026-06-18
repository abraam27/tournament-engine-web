import { Suspense } from "react";

import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { BracketAdminPanel } from "@/features/admin/brackets/components/bracket-admin-panel";

export default function AdminBracketsPage() {
  return (
    <>
      <AdminPageHeader
        title="Bracket Management"
        description="Generate knockout rounds and view bracket status"
      />
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
        <BracketAdminPanel />
      </Suspense>
    </>
  );
}
