import { PageHeading } from "@/components/layout/page-heading";
import { AdminVideoPanel } from "@/components/admin/admin-panels";

export default function AdminVideosPage() {
  return (
    <>
      <PageHeading title="Manage Workout Videos" description="Connect instruction videos to workouts by exercise name and category." />
      <AdminVideoPanel />
    </>
  );
}
