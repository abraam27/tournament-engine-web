import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { TournamentsManagementTable } from "@/features/admin/tournaments/components/tournaments-management-table";

export default function AdminTournamentsPage() {
  return (
    <>
      <AdminPageHeader
        title="Tournament Management"
        description="Create and configure tournaments"
      />
      <TournamentsManagementTable />
    </>
  );
}
