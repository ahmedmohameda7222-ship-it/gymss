"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MyMealPlanError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("My Meal Plan page error", error);
  }, [error]);

  return (
    <Card className="mx-auto max-w-xl">
      <CardContent className="pt-6 text-center">
        <h1 className="text-xl font-semibold">My Meal Plan could not load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This is usually caused by an old deploy cache or a missing meal-plan database migration.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="outline"><Link href="/dashboard">Dashboard</Link></Button>
        </div>
      </CardContent>
    </Card>
  );
}
