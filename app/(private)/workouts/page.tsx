import { PageHeading } from "@/components/layout/page-heading";
import { WorkoutBrowser } from "@/components/workouts/workout-browser";

export default function WorkoutsPage() {
  return (
    <>
      <PageHeading title="Workouts" description="Search global workouts, view instructions, start a session, and save your history." />
      <WorkoutBrowser />
    </>
  );
}
