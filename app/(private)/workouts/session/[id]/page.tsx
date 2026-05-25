"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeading } from "@/components/layout/page-heading";
import { WorkoutSessionForm } from "@/components/workouts/workout-session-form";
import { getWorkout } from "@/services/database/repository";
import type { Workout } from "@/types";

export default function WorkoutSessionPage() {
  const params = useParams<{ id: string }>();
  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    getWorkout(params.id).then(setWorkout);
  }, [params.id]);

  if (!workout) return <p className="text-sm text-muted-foreground">Loading workout session...</p>;

  return (
    <>
      <PageHeading title={`Start ${workout.name}`} description="Log sets, reps, weight, notes, and completion." />
      <WorkoutSessionForm workout={workout} />
    </>
  );
}
