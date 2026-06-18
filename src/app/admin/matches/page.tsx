import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { MatchesManagementTable } from "@/features/admin/matches/components/matches-management-table";

export default function AdminMatchesPage() {
  return (
    <>
      <AdminPageHeader
        title="Match Management"
        description="Generate fixtures, update schedules, and submit results"
      />
      <MatchesManagementTable />
    </>
  );
}
