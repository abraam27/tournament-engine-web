import { AdminDashboardContent } from "@/features/admin/components/admin-dashboard-content";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";

export default function AdminPage() {
  return (
    <>
      <AdminPageHeader
        title="Admin Dashboard"
        description="Manage tournaments, teams, matches, and brackets"
      />
      <AdminDashboardContent />
    </>
  );
}
