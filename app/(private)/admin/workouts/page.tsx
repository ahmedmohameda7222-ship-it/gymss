import { PageHeading } from "@/components/layout/page-heading";
import { AdminWorkoutPanel } from "@/components/admin/admin-panels";

export default function AdminWorkoutsPage() {
  return (
    <>
      <PageHeading title="Manage Workouts" description="Global workout library with instructions, difficulty, equipment, and target muscles." />
      <AdminWorkoutPanel />
    </>
  );
}
