"use client";

import { FoodBrowser } from "@/components/meals/food-browser";
import { PageHeading } from "@/components/layout/page-heading";

export default function MealsPage() {
  return (
    <>
      <PageHeading
        title="Egyptian Foods"
        description="Browse the S&S Gym Egyptian food database and add servings to today's log."
      />
      <FoodBrowser />
    </>
  );
}
