import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { TeamsManagementTable } from "@/features/admin/teams/components/teams-management-table";

export default function AdminTeamsPage() {
  return (
    <>
      <AdminPageHeader
        title="Team Management"
        description="Create, edit, and delete teams"
      />
      <TeamsManagementTable />
    </>
  );
}
