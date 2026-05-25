import { PageHeading } from "@/components/layout/page-heading";
import { AdminFoodPanel } from "@/components/admin/admin-panels";

export default function AdminFoodsPage() {
  return (
    <>
      <PageHeading title="Manage Egyptian Foods" description="Admin-managed global Egyptian foods and approximate macros." />
      <AdminFoodPanel />
    </>
  );
}
